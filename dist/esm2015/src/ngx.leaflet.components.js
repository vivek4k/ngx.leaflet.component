import { Component, Injectable, Input, NgModule, Optional, ViewChild } from '@angular/core';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Headers, Http, HttpModule, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MapService {
    constructor() {
        this.basemaps = {};
        this.overlays = {};
        this.layerControlflag = false;
        this.layersInControlNumber = 0;
        this.layerControlObject = {};
        this.groupIdentifiers = [];
        this.groupNames = [];
    }
    /**
     * @param {?} map
     * @return {?}
     */
    setMap(map$$1) {
        this.map = map$$1;
    }
    /**
     * @return {?}
     */
    getMap() {
        return this.map;
    }
    /**
     * @param {?} state
     * @return {?}
     */
    setLayerControl(state) {
        this.layerControlflag = state;
    }
    /**
     * @return {?}
     */
    getLayerControl() {
        return this.layerControlflag;
    }
    /**
     * @param {?} basemap
     * @param {?} name
     * @return {?}
     */
    addBasemap(basemap, name) {
        if (name === '') {
            name = 'unknown layer';
        }
        if (this.basemaps[name] === undefined) {
            this.basemaps[name] = basemap;
        }
        else {
            name = this.getUniqueName(name);
            this.addBasemap(basemap, name);
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getUniqueName(name) {
        let /** @type {?} */ nameindex = 0;
        let /** @type {?} */ newName = name;
        if (name.indexOf('(') !== -1) {
            nameindex = parseInt(name.split('(')[1].split(')')[0]);
            nameindex += 1;
            newName = name.split('(')[0];
        }
        else {
            nameindex = 1;
        }
        return name = newName + '(' + nameindex + ')';
    }
    /**
     * @param {?} overlay
     * @param {?} name
     * @param {?=} gId
     * @return {?}
     */
    addOverlay(overlay, name, gId) {
        if (this.groupIdentifiers.indexOf(gId) !== -1) {
            let /** @type {?} */ index = this.groupIdentifiers.indexOf(gId);
            let /** @type {?} */ existing_name = this.groupNames[index];
            this.overlays[existing_name] = overlay;
        }
        else {
            if (name === '') {
                name = 'unknown group';
            }
            if (this.overlays[name] === undefined) {
                this.groupNames.push(name);
                this.groupIdentifiers.push(gId);
                this.overlays[name] = overlay;
            }
            else {
                name = this.getUniqueName(name);
                if (this.groupNames.indexOf(name) === -1) {
                    this.groupNames.push(name);
                    this.groupIdentifiers.push(gId);
                }
                else {
                    this.addOverlay(overlay, name);
                }
            }
        }
        this.addControl();
    }
    /**
     * @return {?}
     */
    getBasemaps() {
        return this.basemaps;
    }
    /**
     * @return {?}
     */
    getOverlays() {
        return this.overlays;
    }
    /**
     * @return {?}
     */
    getObservableOverlays() {
        return Observable$1.create(observer => {
            observer.next(this.overlays);
            observer.complete();
        });
    }
    /**
     * @return {?}
     */
    getObservableBasemaps() {
        return Observable$1.create(observer => {
            observer.next(this.basemaps);
            observer.complete();
        });
    }
    /**
     * @param {?} remove
     * @param {?} add
     * @return {?}
     */
    refreshOverlays(remove, add) {
        let /** @type {?} */ overlays = this.getOverlays();
        for (var /** @type {?} */ key in overlays) {
            if (overlays[key] instanceof Array) {
                overlays[key].forEach((element, index, arr) => {
                    if (element._leaflet_id == remove._leaflet_id) {
                        arr[index] = add;
                    }
                });
            }
        }
    }
    /**
     * @return {?}
     */
    increaseNumber() {
        this.layersInControlNumber += 1;
    }
    /**
     * @return {?}
     */
    getLayerNumber() {
        return this.layersInControlNumber;
    }
    /**
     * @return {?}
     */
    addControl() {
        if (this.layerControlflag) {
            let /** @type {?} */ map$$1 = this.getMap();
            if (Object.keys(this.layerControlObject).length !== 0) {
                this.layerControlObject.getContainer().innerHTML = '';
                map$$1.removeControl(this.layerControlObject);
            }
            this.layerControlObject = L.control.layers(this.getBasemaps(), this.getOverlays()).addTo(map$$1);
        }
    }
}
MapService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MapService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CoordinateHandler {
    constructor() {
    }
    /**
     * @return {?}
     */
    assignCartesianPointToLeafletsLatLngSchema() {
        if (this.x !== undefined) {
            this.lon = this.x;
        }
        if (this.y !== undefined) {
            this.lat = this.y;
        }
    }
    /**
     * @param {?=} arr
     * @return {?}
     */
    assignCartesianArrayToLeafletsLatLngSchema(arr) {
        if (this.xys !== undefined) {
            if (!arr) {
                arr = this.xys;
            }
            for (var /** @type {?} */ i = 0; i < arr.length; i++) {
                if (typeof (arr[0]) !== "number") {
                    this.assignCartesianArrayToLeafletsLatLngSchema(arr[i]);
                }
                else {
                    arr.reverse();
                }
            }
            this.latlngs = this.xys;
        }
    }
    /**
     * @param {?} crs
     * @return {?}
     */
    transformPointCoordinates(crs) {
        /**
                 * this is because leaflet default CRS is 3857 (so it can render wms properly)
                 * but uses 4326 everywhere else so if CRS is 3857 don't reproject coordinates
                 * also proj4 by default unprojects (inverse) to wgs84 (4326) which is handy but
                 * doesnt match leaflet's default projection. Generally I don't really agree on
                 * how leaflet doesn't handle projections on a global state
                 */
        if (crs.code && crs.code !== "EPSG:3857") {
            let /** @type {?} */ newlatlng = crs.unproject({ y: this.lat, x: this.lon });
            this.setNewLatLng(newlatlng);
        }
        else {
            let /** @type {?} */ newlatlng = { lat: this.lat, lng: this.lon };
            this.setNewLatLng(newlatlng);
        }
    }
    /**
     * @param {?} newlatlng
     * @return {?}
     */
    setNewLatLng(newlatlng) {
        this.lat = newlatlng.lat;
        this.lon = newlatlng.lng;
    }
    /**
     * @param {?} crs
     * @param {?=} arr
     * @return {?}
     */
    transformArrayCoordinates(crs, arr) {
        if (!arr) {
            arr = this.latlngs;
        }
        for (var /** @type {?} */ i = 0; i < arr.length; i++) {
            if (typeof (arr[0]) !== "number") {
                arr[i] = this.transformArrayCoordinates(crs, arr[i]);
            }
            else {
                if (crs.code && crs.code !== "EPSG:3857") {
                    let /** @type {?} */ trasformed = crs.unproject({ x: arr[0], y: arr[1] });
                    arr = { lat: trasformed.lat, lng: trasformed.lng };
                }
                else {
                    arr = { lat: arr[0], lng: arr[1] };
                }
            }
        }
        return arr;
    }
}
CoordinateHandler.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "x": [{ type: Input },],
    "y": [{ type: Input },],
    "latlngs": [{ type: Input },],
    "xys": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LeafletElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     */
    constructor(mapService) {
        super();
        this.mapService = mapService;
        this.lat = 52.6;
        this.lon = -1.1;
        this.zoom = 12;
        this.minZoom = 4;
        this.maxZoom = 19;
        this.layerControl = false;
        this.crs = L.CRS.EPSG3857;
        this.maxBounds = null;
        this.layerControlObject = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianPointToLeafletsLatLngSchema();
        if (typeof (this.crs) === "string") {
            var /** @type {?} */ splitCrs = this.crs.split(".");
            if (splitCrs[0] === "L") {
                this.crs = L[splitCrs[1]][splitCrs[2]];
            }
            else {
                console.warn("something is not right, reverting to default EPSG3857");
                this.crs = L.CRS.EPSG3857;
            }
        }
        super.transformPointCoordinates(this.crs);
        let /** @type {?} */ map$$1 = L.map(this.mapElement.nativeElement, {
            crs: this.crs,
            zoomControl: this.zoomControl,
            center: L.latLng(this.lat, this.lon),
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            maxBounds: this.maxBounds,
            layers: [],
            closePopupOnClick: false,
            attributionControl: false
        });
        this.mapElement.nativeElement.myMapProperty = map$$1;
        //set variables for childrent components
        this.mapService.setMap(map$$1);
        this.mapService.setLayerControl(this.layerControl);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
    }
    /**
     * @return {?}
     */
    setLayerControl() {
        if (this.layerControl) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.layerControlObject !== null) {
                this.layerControlObject.getContainer().innerHTML = '';
            }
            this.layerControlObject = L.control.layers(this.mapService.getBasemaps(), this.mapService.getOverlays()).addTo(map$$1);
        }
    }
}
LeafletElement.decorators = [
    { type: Component, args: [{
                selector: 'leaf-element',
                template: `
  <div class="page-background map-container" layout-padding>
	  <div #map></div>
  </div>`,
                styles: [
                    ':host {width: 100%;height:100%;}' +
                        ':host .map-container {position: absolute;display: block;top: 0px;left: 0px;right: 0px;bottom: 0px;}' +
                        'leaf-element{width:100%;}' +
                        '.leaflet-pane {z-index: 0 !important;}' +
                        '.leaflet-bottom.leaflet-left {z-index: 1 !important;}'
                ],
                providers: [MapService]
            },] },
];
/** @nocollapse */
LeafletElement.ctorParameters = () => [
    { type: MapService, },
];
LeafletElement.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "zoom": [{ type: Input },],
    "minZoom": [{ type: Input },],
    "maxZoom": [{ type: Input },],
    "layerControl": [{ type: Input },],
    "crs": [{ type: Input },],
    "zoomControl": [{ type: Input },],
    "maxBounds": [{ type: Input },],
    "mapElement": [{ type: ViewChild, args: ['map',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GeoJSONCoordinateHandler {
    constructor() {
        this.geojson = {};
    }
    /**
     * @param {?} geoJSON
     * @param {?} crs
     * @return {?}
     */
    transformJSONCoordinates(geoJSON, crs) {
        /**
                 * 7.  GeoJSON Types Are Not Extensible
                 * Implementations MUST NOT extend the fixed set of GeoJSON types:
                 * FeatureCollection, Feature, Point, LineString, MultiPoint, Polygon,
                 * MultiLineString, MultiPolygon, and GeometryCollection.
                 */
        if (geoJSON.type === "FeatureCollection") {
            var /** @type {?} */ featureCollection = geoJSON;
            featureCollection.features.forEach(feature => {
                this.transformJSONCoordinates(feature, crs);
            });
        }
        if (geoJSON.type === "Feature") {
            var /** @type {?} */ feature = geoJSON;
            this.transformJSONCoordinates(feature.geometry, crs);
        }
        if (geoJSON.type === "Point") {
            var /** @type {?} */ point = geoJSON;
            point = this.transformPointCoordinates(point.coordinates, crs);
        }
        if (geoJSON.type === "LineString") {
            var /** @type {?} */ lineString = geoJSON;
            lineString.coordinates.forEach(point => {
                this.transformPointCoordinates(point, crs);
            });
        }
        if (geoJSON.type === "MultiPoint") {
            var /** @type {?} */ multiPoint = geoJSON;
            multiPoint.coordinates.forEach(point => {
                this.transformPointCoordinates(point, crs);
            });
        }
        if (geoJSON.type === "Polygon") {
            var /** @type {?} */ polygon = geoJSON;
            polygon.coordinates.forEach(polygonElement => {
                polygonElement.forEach(point => {
                    this.transformPointCoordinates(point, crs);
                });
            });
        }
        if (geoJSON.type === "MultiLineString") {
            var /** @type {?} */ multiLineString = geoJSON;
            multiLineString.coordinates.forEach(lineString => {
                lineString.forEach(point => {
                    this.transformPointCoordinates(point, crs);
                });
            });
        }
        if (geoJSON.type === "MultiPolygon") {
            var /** @type {?} */ multiPolygon = geoJSON;
            multiPolygon.coordinates.forEach(polygon => {
                polygon.forEach(polygonElement => {
                    polygonElement.forEach(point => {
                        this.transformPointCoordinates(point, crs);
                    });
                });
            });
        }
        if (geoJSON.type === "GeometryCollection") {
            var /** @type {?} */ geometryCollection = geoJSON;
            geometryCollection.geometries.forEach(geometry => {
                this.transformJSONCoordinates(geometry, crs);
            });
        }
    }
    /**
     * @param {?} point
     * @param {?} crs
     * @return {?}
     */
    transformPointCoordinates(point, crs) {
        /**
                 * this is because leaflet default CRS is 3857 (so it can render wms properly)
                 * but uses 4326 everywhere else so if CRS is 3857 don't reproject coordinates
                 * also proj4 by default unprojects (inverse) to wgs84 (4326) which is handy but
                 * doesnt match leaflet's default projection. Generally I don't really agree on
                 * how leaflet doesn't handle projections on a global state
                 */
        if (crs.code && crs.code !== "EPSG:3857") {
            let /** @type {?} */ newlatlng = crs.unproject({ x: point[0], y: point[1] });
            point[1] = newlatlng.lat;
            point[0] = newlatlng.lng;
            return point;
        }
        else {
            return point;
        }
    }
}
GeoJSONCoordinateHandler.propDecorators = {
    "geojson": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class attributionModel {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.prefix = "Leaflet";
        this.position = "bottomright";
        if (options !== null) {
            for (var /** @type {?} */ key in options) {
                if (options[key] !== undefined) {
                    this[key] = options[key];
                }
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AttributionControl {
    /**
     * @param {?} mapService
     * @param {?=} LeafletElement
     */
    constructor(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new attributionModel(null);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.LeafletElement) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.attribution(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This attribution-control will not be rendered \n the expected parent node of attribution-control should be either leaf-element or layer-element");
        }
    }
}
AttributionControl.decorators = [
    { type: Component, args: [{
                selector: 'attribution-control',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
AttributionControl.ctorParameters = () => [
    { type: MapService, },
    { type: LeafletElement, decorators: [{ type: Optional },] },
];
AttributionControl.propDecorators = {
    "Options": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class scaleModel {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.maxWidth = 100;
        this.metric = true;
        this.imperial = true;
        this.updateWhenIdle = true;
        this.position = "bottomleft";
        let /** @type {?} */ source = options;
        let /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ScaleControl {
    /**
     * @param {?} mapService
     * @param {?=} LeafletElement
     */
    constructor(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new scaleModel(null);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.LeafletElement) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.scale(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This scale-control will not be rendered \n the expected parent node of scale-control should be leaf-element");
        }
    }
}
ScaleControl.decorators = [
    { type: Component, args: [{
                selector: 'scale-control',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
ScaleControl.ctorParameters = () => [
    { type: MapService, },
    { type: LeafletElement, decorators: [{ type: Optional },] },
];
ScaleControl.propDecorators = {
    "Options": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class zoomModel {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.zoomInText = "+";
        this.zoomInTitle = "Zoom in";
        this.zoomOutText = "-";
        this.zoomOutTitle = "Zoom out";
        this.position = "topright";
        let /** @type {?} */ source = options;
        let /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ZoomControl {
    /**
     * @param {?} mapService
     * @param {?=} LeafletElement
     */
    constructor(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new zoomModel(null);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.LeafletElement) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.zoom(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This zoom-control will not be rendered \n the expected parent node of zoom-control should be leaf-element");
        }
    }
}
ZoomControl.decorators = [
    { type: Component, args: [{
                selector: 'zoom-control',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
ZoomControl.ctorParameters = () => [
    { type: MapService, },
    { type: LeafletElement, decorators: [{ type: Optional },] },
];
ZoomControl.propDecorators = {
    "Options": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class WatermarkControl {
    /**
     * @param {?} mapService
     * @param {?=} LeafletElement
     */
    constructor(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        var /** @type {?} */ self = this;
        if (this.LeafletElement) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.url) {
                L.Control['Watermark'] = /** @type {?} */ ({});
                L.Control['Watermark'] = L.Control.extend({
                    onAdd: function (map$$1) {
                        var /** @type {?} */ basediv = L.DomUtil.create('div', 'watermark');
                        var /** @type {?} */ howManyInX = Math.ceil(map$$1.getSize().x / self.imagewidth);
                        var /** @type {?} */ howManyInY = Math.ceil(map$$1.getSize().y / self.imageheight);
                        var /** @type {?} */ numberOfLogo = howManyInX * howManyInY;
                        console.log(numberOfLogo);
                        let /** @type {?} */ i = 0;
                        for (i; i < numberOfLogo; i++) {
                            var /** @type {?} */ img = L.DomUtil.create('img', 'watermark-elements', basediv);
                            img.src = self.url;
                            img.style.width = self.imagewidth + 'px';
                        }
                        return basediv;
                    },
                    onRemove: function (map$$1) {
                    }
                });
                L.control['watermark'] = function (opts) {
                    return new L.Control['Watermark'](opts);
                };
            }
            L.control['watermark']({ position: "bottomleft" }).addTo(map$$1);
        }
    }
}
WatermarkControl.decorators = [
    { type: Component, args: [{
                selector: 'watermark-element',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
WatermarkControl.ctorParameters = () => [
    { type: MapService, },
    { type: LeafletElement, decorators: [{ type: Optional },] },
];
WatermarkControl.propDecorators = {
    "url": [{ type: Input },],
    "imagewidth": [{ type: Input },],
    "imageheight": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LayerElement {
    /**
     * @param {?} mapService
     */
    constructor(mapService) {
        this.mapService = mapService;
        this.slippyLayer = '';
        this.wmsLayer = '';
        this.name = '';
        this.opacity = 1;
        this.type = 'overlay';
        this.attribution = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.mapService.increaseNumber();
        let /** @type {?} */ map$$1 = this.mapService.getMap();
        let /** @type {?} */ layer = null;
        if (this.slippyLayer !== "") {
            layer = L.tileLayer(this.slippyLayer, {
                attribution: this.attribution,
            });
        }
        if (this.wmsLayer !== "" && this.name !== "") {
            layer = L.tileLayer.wms(this.wmsLayer, {
                layers: this.name,
                attribution: this.attribution
            }).setOpacity(this.opacity);
        }
        if (layer !== {}) {
            if (this.type === "overlay") {
                this.mapService.addOverlay(layer, this.name);
                layer.addTo(map$$1);
            }
            else if (this.type === "basemap") {
                this.mapService.addBasemap(layer, this.name);
                layer.addTo(map$$1);
            }
        }
    }
}
LayerElement.decorators = [
    { type: Component, args: [{
                selector: 'layer-element',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
LayerElement.ctorParameters = () => [
    { type: MapService, },
];
LayerElement.propDecorators = {
    "slippyLayer": [{ type: Input },],
    "wmsLayer": [{ type: Input },],
    "name": [{ type: Input },],
    "opacity": [{ type: Input },],
    "type": [{ type: Input },],
    "attribution": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ImageOverlayElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?=} LeafletElement
     */
    constructor(mapService, LeafletElement$$1) {
        super();
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.bounds = [[-26.5, -25], [1021.5, 1023]];
        this.imagepath = '';
        this.name = '';
        this.opacity = 1;
        this.type = 'overlay';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.latlngs = this.bounds;
        if (this.LeafletElement) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformArrayCoordinates(this.LeafletElement.crs);
            let /** @type {?} */ layer = null;
            layer = L.imageOverlay(this.imagepath, this.bounds).setOpacity(this.opacity);
            if (layer !== {}) {
                if (this.type === "overlay") {
                    this.mapService.addOverlay(layer, this.name);
                    layer.addTo(map$$1);
                }
                else if (this.type === "basemap") {
                    this.mapService.addBasemap(layer, this.name);
                }
            }
        }
    }
}
ImageOverlayElement.decorators = [
    { type: Component, args: [{
                selector: 'image-overlay-element',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
ImageOverlayElement.ctorParameters = () => [
    { type: MapService, },
    { type: LeafletElement, decorators: [{ type: Optional },] },
];
ImageOverlayElement.propDecorators = {
    "bounds": [{ type: Input },],
    "imagepath": [{ type: Input },],
    "name": [{ type: Input },],
    "opacity": [{ type: Input },],
    "type": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GuidService {
    constructor() { }
    /**
     * @return {?}
     */
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var /** @type {?} */ r = Math.random() * 16 | 0, /** @type {?} */ v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
GuidService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GuidService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GroupService {
    /**
     * @param {?} guidService
     */
    constructor(guidService) {
        this.guidService = guidService;
        this.layerGroup = [];
        this.layerId = [];
        this.layerGroupNumber = 0;
        this.group = {};
    }
    /**
     * @param {?} overlay
     * @param {?} map
     * @param {?} mapService
     * @param {?} group
     * @param {?=} replace
     * @param {?=} gId
     * @return {?}
     */
    addOLayersToGroup(overlay, map$$1, mapService, group, replace = false, gId) {
        if (!gId) {
            gId = this.guidService.newGuid();
        }
        if (this.layerId.indexOf(gId) === -1) {
            this.layerId.push(gId);
        }
        if (Object.keys(this.group).length !== 0) {
            if (replace) {
                map$$1.removeLayer(this.group);
                if (this.layerId.indexOf(gId) !== -1) {
                    this.layerGroup[this.layerId.indexOf(gId)] = overlay;
                }
                else {
                    this.layerGroup.push(overlay);
                }
                this.group = L.layerGroup(this.getLayerGroup());
                this.group.addTo(map$$1);
            }
            else {
                this.layerGroup.push(overlay);
                this.group.addLayer(overlay);
            }
        }
        if (!replace) {
            this.layerGroup.push(overlay);
            this.group = L.layerGroup(this.getLayerGroup());
            this.group.addTo(map$$1);
        }
        mapService.addOverlay(this.getGroup(), group.name, group.globalId);
    }
    /**
     * @return {?}
     */
    getObservableGroup() {
        return Observable$1.create(observer => {
            var /** @type {?} */ group = this.getGroup();
            observer.next(group);
            observer.complete();
        });
    }
    /**
     * @return {?}
     */
    getGroup() {
        return this.group;
    }
    /**
     * @return {?}
     */
    getLayerGroup() {
        return this.layerGroup;
    }
    /**
     * @return {?}
     */
    getLayerNumber() {
        return this.layerGroupNumber;
    }
}
GroupService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GroupService.ctorParameters = () => [
    { type: GuidService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PopupService {
    constructor() { }
    /**
     * @param {?} mouseover
     * @param {?} onclick
     * @param {?} element
     * @param {?} text
     * @return {?}
     */
    enablePopup(mouseover, onclick, element, text) {
        if (mouseover && onclick) {
            mouseover = undefined;
            console.warn('you can not use mouseover and onclick at the same time, mouseover is going to be depressed');
        }
        if (mouseover) {
            if (mouseover === 'true' && text) {
                mouseover = text;
            }
            else if (mouseover === true && !text) {
                mouseover = "true";
            }
            element.bindPopup(mouseover);
            element.on('mouseover', function () {
                this.openPopup();
            }).on('mouseout', function () {
                this.closePopup();
            });
        }
        if (onclick) {
            if (onclick === 'true' && text) {
                onclick = text;
            }
            else if (onclick === true && !text) {
                onclick = "true";
            }
            element.bindPopup(onclick);
            element.on('click', function () {
                this.openPopup();
            });
        }
        if (!mouseover && !onclick && text) {
            element.bindPopup(text);
            element.on('mouseover', function () {
                this.openPopup();
            }).on('mouseout', function () {
                this.closePopup();
            });
        }
    }
}
PopupService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PopupService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LeafletGroup {
    /**
     * @param {?} mapService
     * @param {?} groupService
     * @param {?} guidService
     */
    constructor(mapService, groupService, guidService) {
        this.mapService = mapService;
        this.groupService = groupService;
        this.guidService = guidService;
        this.name = '';
        this.globalId = this.guidService.newGuid();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
    }
}
LeafletGroup.decorators = [
    { type: Component, args: [{
                selector: 'leaflet-group',
                template: ``,
                styles: [''],
                providers: [GroupService]
            },] },
];
/** @nocollapse */
LeafletGroup.ctorParameters = () => [
    { type: MapService, },
    { type: GroupService, },
    { type: GuidService, },
];
LeafletGroup.propDecorators = {
    "name": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MarkerElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?} http
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, http$$1, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.http = http$$1;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.lat = 52.6;
        this.lon = -1.1;
        this.mouseover = undefined;
        this.onclick = undefined;
        this.iconUrl = "";
        this.marker = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianPointToLeafletsLatLngSchema();
        var /** @type {?} */ model = this;
        if (this.LeafletElement || this.LeafletGroup) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformPointCoordinates(this.LeafletElement.crs);
            if (this.iconUrl === "") {
                this.marker = L.marker([this.lat, this.lon]);
                this.createMarkerlayer(this.marker, map$$1);
            }
            else {
                this.imageExists(this.iconUrl, function (exists) {
                    model.getImage().subscribe(image => {
                        var /** @type {?} */ img = document.createElement("img");
                        window.URL.createObjectURL(image.blob());
                        var /** @type {?} */ reader = new FileReader();
                        reader.onload = function () {
                            img.src = reader.result;
                            var /** @type {?} */ myIcon = L.icon({
                                iconUrl: model.iconUrl,
                                iconSize: [img.width, img.height],
                                iconAnchor: [img.width / 2, img.height - 1],
                                popupAnchor: [0, -img.height]
                            });
                            var /** @type {?} */ obj = { icon: myIcon, options: null };
                            model.marker = L.marker([model.lat, model.lon], obj);
                            model.createMarkerlayer(model.marker, map$$1);
                        };
                        reader.readAsDataURL(image.blob());
                    }, err => {
                        console.log(err);
                    });
                });
            }
        }
        else {
            console.warn("This marker-element will not be rendered \n the expected parent node of marker-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @param {?} marker
     * @param {?} map
     * @return {?}
     */
    createMarkerlayer(marker, map$$1) {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.marker, textInput);
        }
        //only if the parent is map should the marker-element should be directly added to the map
        if (this.LeafletGroup) {
            this.groupService.addOLayersToGroup(marker, map$$1, this.mapService, this.LeafletGroup);
        }
        else {
            marker.addTo(map$$1);
        }
    }
    /**
     * @param {?} url
     * @param {?} callback
     * @return {?}
     */
    imageExists(url, callback) {
        var /** @type {?} */ img = new Image();
        img.onload = function () { callback(true); };
        img.onerror = function () { callback(false); };
        img.src = url;
    }
    /**
     * @return {?}
     */
    getImage() {
        let /** @type {?} */ headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let /** @type {?} */ options = new RequestOptions({
            responseType: ResponseContentType.Blob,
            headers: headers
        });
        return this.http.get(this.iconUrl, options)
            .map((res) => res)
            .catch((error) => Observable$1.throw('Server error'));
    }
}
MarkerElement.decorators = [
    { type: Component, args: [{
                selector: 'marker-element',
                template: `<div #ngel><ng-content></ng-content></div>`,
                styles: [''],
                providers: [PopupService]
            },] },
];
/** @nocollapse */
MarkerElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: Http, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
MarkerElement.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "mouseover": [{ type: Input },],
    "onclick": [{ type: Input },],
    "iconUrl": [{ type: Input },],
    "ngEl": [{ type: ViewChild, args: ['ngel',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class path {
    /**
     * @param {?} pathInfo
     */
    constructor(pathInfo) {
        this.stroke = true;
        this.color = '#3388ff';
        this.weight = 3;
        this.opacity = 1;
        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.dashArray = null;
        this.dashOffset = null;
        this.fill = true;
        this.fillColor = '#3388ff';
        this.fillOpacity = 0.2;
        this.fillRule = 'evenodd';
        //TODO renderer: Renderer; 		Use this specific instance of Renderer for this path. Takes precedence over the map's default renderer.
        this.className = null;
        let /** @type {?} */ source = pathInfo;
        let /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CircleElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.lat = 52.6;
        this.lon = -1.1;
        this.radius = 20;
        this.mouseover = undefined;
        this.onclick = undefined;
        this.Options = new path(null);
        this.circle = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianPointToLeafletsLatLngSchema();
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformPointCoordinates(this.LeafletElement.crs);
            this.circle = L.circle([this.lat, this.lon], this.radius, inheritedOptions);
            if (this.LeafletGroup) {
                this.groupService.addOLayersToGroup(this.circle, map$$1, this.mapService, this.LeafletGroup);
            }
            else {
                this.circle.addTo(map$$1);
            }
        }
        else {
            console.warn("This circle-element will not be rendered \n the expected parent node of circle-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ textInput = undefined;
            if (this.ngEl.nativeElement.childNodes.length > 0) {
                var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
                textInput = textNode.nodeValue;
            }
            //add popup methods on element only if any of the tests are not undefined
            if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
                this.popupService.enablePopup(this.mouseover, this.onclick, this.circle, textInput);
            }
        }
    }
}
CircleElement.decorators = [
    { type: Component, args: [{
                selector: 'circle-element',
                template: `<div #ngel><ng-content></ng-content></div>`,
                styles: ['']
            },] },
];
/** @nocollapse */
CircleElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
CircleElement.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "radius": [{ type: Input },],
    "mouseover": [{ type: Input },],
    "onclick": [{ type: Input },],
    "Options": [{ type: Input },],
    "ngEl": [{ type: ViewChild, args: ['ngel',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CircleMarkerElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.lat = 52.6;
        this.lon = -1.1;
        this.mouseover = undefined;
        this.onclick = undefined;
        this.Options = new path(null);
        this.circle = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianPointToLeafletsLatLngSchema();
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            let /** @type {?} */ elementPosition = super.transformPointCoordinates(this.LeafletElement.crs);
            this.circle = L.circleMarker([this.lat, this.lon], inheritedOptions);
            if (this.LeafletGroup) {
                this.groupService.addOLayersToGroup(this.circle, map$$1, this.mapService, this.LeafletGroup);
            }
            else {
                this.circle.addTo(map$$1);
            }
        }
        else {
            console.warn("This circle-element will not be rendered \n the expected parent node of circle-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.circle, textInput);
        }
    }
}
CircleMarkerElement.decorators = [
    { type: Component, args: [{
                selector: 'circle-marker-element',
                template: `<div #ngel><ng-content></ng-content></div>`,
                styles: ['']
            },] },
];
/** @nocollapse */
CircleMarkerElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
CircleMarkerElement.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "mouseover": [{ type: Input },],
    "onclick": [{ type: Input },],
    "Options": [{ type: Input },],
    "ngEl": [{ type: ViewChild, args: ['ngel',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class HelperService {
    constructor() { }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    arrayCompare(a, b) {
        if (a.length != b.length) {
            return false;
        }
        for (var /** @type {?} */ i in a) {
            // Don't forget to check for arrays in our arrays.
            if (a[i] instanceof Array && b[i] instanceof Array) {
                if (!this.arrayCompare(a[i], b[i])) {
                    return false;
                }
            }
            else if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}
HelperService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
HelperService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PolygonElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?} guidService
     * @param {?} helperService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.guidService = guidService;
        this.helperService = helperService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.latlngs = [[[52.65, -1.2], [52.645, -1.15], [52.696, -1.155], [52.697, -1.189]],
            [[52.66, -1.19], [52.665, -1.16], [52.686, -1.161], [52.687, -1.179]]];
        this.Options = new path(null);
        this.mouseover = undefined;
        this.onclick = undefined;
        this.polygon = null;
        this.originalObject = [...this.latlngs];
        this.globalId = this.guidService.newGuid();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianArrayToLeafletsLatLngSchema();
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformArrayCoordinates(this.LeafletElement.crs);
            this.polygon = L.polygon([this.latlngs], inheritedOptions);
            if (this.LeafletGroup) {
                this.groupService.addOLayersToGroup(this.polygon, map$$1, this.mapService, this.LeafletGroup, false, this.globalId);
            }
            else {
                this.polygon.addTo(map$$1);
            }
        }
        else {
            console.warn("This polygon-element will not be rendered \n the expected parent node of polygon-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.polygon, textInput);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        let /** @type {?} */ map$$1 = this.mapService.getMap();
        var /** @type {?} */ same = this.helperService.arrayCompare(this.originalObject, this.latlngs);
        if (!same) {
            this.originalObject = [...this.latlngs];
            //if the layer is part of a group
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            if (this.LeafletGroup) {
                this.polygon = L.polygon([this.latlngs], inheritedOptions);
                this.groupService.addOLayersToGroup(this.polygon, map$$1, this.mapService, this.LeafletGroup, true, this.globalId);
            }
            else {
                map$$1.removeLayer(this.polygon);
                this.polygon = L.polygon([this.latlngs], inheritedOptions);
                this.polygon.addTo(map$$1);
            }
        }
    }
}
PolygonElement.decorators = [
    { type: Component, args: [{
                selector: 'polygon-element',
                template: `<div #ngel><ng-content></ng-content></div>`,
                styles: ['']
            },] },
];
/** @nocollapse */
PolygonElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: GuidService, },
    { type: HelperService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
PolygonElement.propDecorators = {
    "latlngs": [{ type: Input },],
    "Options": [{ type: Input },],
    "mouseover": [{ type: Input },],
    "onclick": [{ type: Input },],
    "ngEl": [{ type: ViewChild, args: ['ngel',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PolylineElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?} guidService
     * @param {?} helperService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.guidService = guidService;
        this.helperService = helperService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.latlngs = [[52.6, -1.1], [52.605, -1.1], [52.606, -1.105], [52.697, -1.109]];
        this.Options = new path(null);
        this.mouseover = undefined;
        this.onclick = undefined;
        this.polyline = null;
        this.originalObject = [...this.latlngs];
        this.globalId = this.guidService.newGuid();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianArrayToLeafletsLatLngSchema();
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            //polyline shouldn't have a fill
            this.Options.fill = false;
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformArrayCoordinates(this.LeafletElement.crs);
            this.polyline = L.polyline(this.latlngs, inheritedOptions);
            if (this.LeafletGroup) {
                this.groupService.addOLayersToGroup(this.polyline, map$$1, this.mapService, this.LeafletGroup, false, this.globalId);
            }
            else {
                this.polyline.addTo(map$$1);
            }
        }
        else {
            console.warn("This polyline-element will not be rendered \n the expected parent node of polyline-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.polyline, textInput);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        let /** @type {?} */ map$$1 = this.mapService.getMap();
        var /** @type {?} */ same = this.helperService.arrayCompare(this.originalObject, this.latlngs);
        if (!same) {
            this.originalObject = [...this.latlngs];
            //if the layer is part of a group
            this.Options.fill = false;
            let /** @type {?} */ inheritedOptions = new path(this.Options);
            if (this.LeafletGroup) {
                this.polyline = L.polyline(this.latlngs, inheritedOptions);
                this.groupService.addOLayersToGroup(this.polyline, map$$1, this.mapService, this.LeafletGroup, true, this.globalId);
            }
            else {
                map$$1.removeLayer(this.polyline);
                this.polyline = L.polyline(this.latlngs, inheritedOptions);
                this.polyline.addTo(map$$1);
            }
        }
    }
}
PolylineElement.decorators = [
    { type: Component, args: [{
                selector: 'polyline-element',
                template: `<div #ngel><ng-content></ng-content></div>`,
                styles: ['']
            },] },
];
/** @nocollapse */
PolylineElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: GuidService, },
    { type: HelperService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
PolylineElement.propDecorators = {
    "latlngs": [{ type: Input },],
    "Options": [{ type: Input },],
    "mouseover": [{ type: Input },],
    "onclick": [{ type: Input },],
    "ngEl": [{ type: ViewChild, args: ['ngel',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GeoJsonElement extends GeoJSONCoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?} popupService
     * @param {?} guidService
     * @param {?} helperService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.popupService = popupService;
        this.guidService = guidService;
        this.helperService = helperService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.originalObject = Object.assign({}, this.geojson);
        this.globalId = this.guidService.newGuid();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            //polyline shouldn't have a fill
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.geojson) {
                super.transformJSONCoordinates(this.geojson, this.LeafletElement.crs);
                let /** @type {?} */ gjson = L.geoJSON(this.geojson);
                if (this.LeafletGroup) {
                    this.groupService.addOLayersToGroup(gjson, map$$1, this.mapService, this.LeafletGroup, false, this.globalId);
                }
                else {
                    gjson.addTo(map$$1);
                }
            }
            else {
                console.warn("geojson object seems to be undefined");
            }
        }
        else {
            console.warn("This polyline-element will not be rendered \n the expected parent node of polyline-element should be either leaf-element or leaflet-group");
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        let /** @type {?} */ map$$1 = this.mapService.getMap();
    }
}
GeoJsonElement.decorators = [
    { type: Component, args: [{
                selector: 'geojson-element',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
GeoJsonElement.ctorParameters = () => [
    { type: MapService, },
    { type: PopupService, },
    { type: GuidService, },
    { type: HelperService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PopupElement extends CoordinateHandler {
    /**
     * @param {?} mapService
     * @param {?=} groupService
     * @param {?=} LeafletElement
     * @param {?=} LeafletGroup
     */
    constructor(mapService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        super();
        this.mapService = mapService;
        this.groupService = groupService;
        this.LeafletElement = LeafletElement$$1;
        this.LeafletGroup = LeafletGroup$$1;
        this.lat = 52.6;
        this.lon = -1.9;
        this.content = "nice popup";
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.assignCartesianPointToLeafletsLatLngSchema();
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            let /** @type {?} */ map$$1 = this.mapService.getMap();
            super.transformPointCoordinates(this.LeafletElement.crs);
            let /** @type {?} */ popup = L.popup({ autoClose: false, keepInView: true }).setLatLng([this.lat, this.lon]).setContent(/** @type {?} */ (this.content));
            if (this.LeafletGroup) {
                this.groupService.addOLayersToGroup(popup, map$$1, this.mapService, this.LeafletGroup);
            }
            else {
                popup.addTo(map$$1);
            }
        }
        else {
            console.warn("This popup-element will not be rendered \n the expected parent node of popup-element should be either leaf-element or leaflet-group");
        }
    }
}
PopupElement.decorators = [
    { type: Component, args: [{
                selector: 'popup-element',
                template: ``,
                styles: ['']
            },] },
];
/** @nocollapse */
PopupElement.ctorParameters = () => [
    { type: MapService, },
    { type: GroupService, decorators: [{ type: Optional },] },
    { type: LeafletElement, decorators: [{ type: Optional },] },
    { type: LeafletGroup, decorators: [{ type: Optional },] },
];
PopupElement.propDecorators = {
    "lat": [{ type: Input },],
    "lon": [{ type: Input },],
    "content": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ngxLeafletModule {
}
ngxLeafletModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    HttpModule
                ],
                declarations: [
                    LeafletElement,
                    AttributionControl,
                    ScaleControl,
                    ZoomControl,
                    WatermarkControl,
                    LayerElement,
                    ImageOverlayElement,
                    MarkerElement,
                    CircleElement,
                    CircleMarkerElement,
                    PolygonElement,
                    PolylineElement,
                    GeoJsonElement,
                    PopupElement,
                    LeafletGroup
                ],
                providers: [
                    PopupService,
                    GuidService,
                    HelperService
                ],
                exports: [
                    LeafletElement,
                    AttributionControl,
                    ScaleControl,
                    ZoomControl,
                    WatermarkControl,
                    LayerElement,
                    ImageOverlayElement,
                    MarkerElement,
                    CircleElement,
                    CircleMarkerElement,
                    PolygonElement,
                    PolylineElement,
                    GeoJsonElement,
                    PopupElement,
                    LeafletGroup
                ]
            },] },
];
/** @nocollapse */
ngxLeafletModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { LeafletElement, CoordinateHandler, GeoJSONCoordinateHandler, AttributionControl, ScaleControl, ZoomControl, WatermarkControl, LayerElement, ImageOverlayElement, MarkerElement, CircleElement, CircleMarkerElement, PolygonElement, PolylineElement, GeoJsonElement, PopupElement, LeafletGroup, MapService, GroupService, PopupService, GuidService, HelperService, attributionModel, path, scaleModel, zoomModel, ngxLeafletModule };
