(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Observable'), require('@angular/http'), require('rxjs/add/operator/map'), require('rxjs/add/operator/catch'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Observable', '@angular/http', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxLeafletComponents = {}),global.ng.core,global.Rx,global.ng.http,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ng.common));
}(this, (function (exports,core,Observable,http,map,_catch,common) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MapService = (function () {
    function MapService() {
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
    MapService.prototype.setMap = /**
     * @param {?} map
     * @return {?}
     */
    function (map$$1) {
        this.map = map$$1;
    };
    /**
     * @return {?}
     */
    MapService.prototype.getMap = /**
     * @return {?}
     */
    function () {
        return this.map;
    };
    /**
     * @param {?} state
     * @return {?}
     */
    MapService.prototype.setLayerControl = /**
     * @param {?} state
     * @return {?}
     */
    function (state) {
        this.layerControlflag = state;
    };
    /**
     * @return {?}
     */
    MapService.prototype.getLayerControl = /**
     * @return {?}
     */
    function () {
        return this.layerControlflag;
    };
    /**
     * @param {?} basemap
     * @param {?} name
     * @return {?}
     */
    MapService.prototype.addBasemap = /**
     * @param {?} basemap
     * @param {?} name
     * @return {?}
     */
    function (basemap, name) {
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
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MapService.prototype.getUniqueName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ nameindex = 0;
        var /** @type {?} */ newName = name;
        if (name.indexOf('(') !== -1) {
            nameindex = parseInt(name.split('(')[1].split(')')[0]);
            nameindex += 1;
            newName = name.split('(')[0];
        }
        else {
            nameindex = 1;
        }
        return name = newName + '(' + nameindex + ')';
    };
    /**
     * @param {?} overlay
     * @param {?} name
     * @param {?=} gId
     * @return {?}
     */
    MapService.prototype.addOverlay = /**
     * @param {?} overlay
     * @param {?} name
     * @param {?=} gId
     * @return {?}
     */
    function (overlay, name, gId) {
        if (this.groupIdentifiers.indexOf(gId) !== -1) {
            var /** @type {?} */ index = this.groupIdentifiers.indexOf(gId);
            var /** @type {?} */ existing_name = this.groupNames[index];
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
    };
    /**
     * @return {?}
     */
    MapService.prototype.getBasemaps = /**
     * @return {?}
     */
    function () {
        return this.basemaps;
    };
    /**
     * @return {?}
     */
    MapService.prototype.getOverlays = /**
     * @return {?}
     */
    function () {
        return this.overlays;
    };
    /**
     * @return {?}
     */
    MapService.prototype.getObservableOverlays = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return Observable.Observable.create(function (observer) {
            observer.next(_this.overlays);
            observer.complete();
        });
    };
    /**
     * @return {?}
     */
    MapService.prototype.getObservableBasemaps = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return Observable.Observable.create(function (observer) {
            observer.next(_this.basemaps);
            observer.complete();
        });
    };
    /**
     * @param {?} remove
     * @param {?} add
     * @return {?}
     */
    MapService.prototype.refreshOverlays = /**
     * @param {?} remove
     * @param {?} add
     * @return {?}
     */
    function (remove, add) {
        var /** @type {?} */ overlays = this.getOverlays();
        for (var /** @type {?} */ key in overlays) {
            if (overlays[key] instanceof Array) {
                overlays[key].forEach(function (element, index, arr) {
                    if (element._leaflet_id == remove._leaflet_id) {
                        arr[index] = add;
                    }
                });
            }
        }
    };
    /**
     * @return {?}
     */
    MapService.prototype.increaseNumber = /**
     * @return {?}
     */
    function () {
        this.layersInControlNumber += 1;
    };
    /**
     * @return {?}
     */
    MapService.prototype.getLayerNumber = /**
     * @return {?}
     */
    function () {
        return this.layersInControlNumber;
    };
    /**
     * @return {?}
     */
    MapService.prototype.addControl = /**
     * @return {?}
     */
    function () {
        if (this.layerControlflag) {
            var /** @type {?} */ map$$1 = this.getMap();
            if (Object.keys(this.layerControlObject).length !== 0) {
                this.layerControlObject.getContainer().innerHTML = '';
                map$$1.removeControl(this.layerControlObject);
            }
            this.layerControlObject = L.control.layers(this.getBasemaps(), this.getOverlays()).addTo(map$$1);
        }
    };
    MapService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    MapService.ctorParameters = function () { return []; };
    return MapService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CoordinateHandler = (function () {
    function CoordinateHandler() {
    }
    /**
     * @return {?}
     */
    CoordinateHandler.prototype.assignCartesianPointToLeafletsLatLngSchema = /**
     * @return {?}
     */
    function () {
        if (this.x !== undefined) {
            this.lon = this.x;
        }
        if (this.y !== undefined) {
            this.lat = this.y;
        }
    };
    /**
     * @param {?=} arr
     * @return {?}
     */
    CoordinateHandler.prototype.assignCartesianArrayToLeafletsLatLngSchema = /**
     * @param {?=} arr
     * @return {?}
     */
    function (arr) {
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
    };
    /**
     * @param {?} crs
     * @return {?}
     */
    CoordinateHandler.prototype.transformPointCoordinates = /**
     * @param {?} crs
     * @return {?}
     */
    function (crs) {
        /**
                 * this is because leaflet default CRS is 3857 (so it can render wms properly)
                 * but uses 4326 everywhere else so if CRS is 3857 don't reproject coordinates
                 * also proj4 by default unprojects (inverse) to wgs84 (4326) which is handy but
                 * doesnt match leaflet's default projection. Generally I don't really agree on
                 * how leaflet doesn't handle projections on a global state
                 */
        if (crs.code && crs.code !== "EPSG:3857") {
            var /** @type {?} */ newlatlng = crs.unproject({ y: this.lat, x: this.lon });
            this.setNewLatLng(newlatlng);
        }
        else {
            var /** @type {?} */ newlatlng = { lat: this.lat, lng: this.lon };
            this.setNewLatLng(newlatlng);
        }
    };
    /**
     * @param {?} newlatlng
     * @return {?}
     */
    CoordinateHandler.prototype.setNewLatLng = /**
     * @param {?} newlatlng
     * @return {?}
     */
    function (newlatlng) {
        this.lat = newlatlng.lat;
        this.lon = newlatlng.lng;
    };
    /**
     * @param {?} crs
     * @param {?=} arr
     * @return {?}
     */
    CoordinateHandler.prototype.transformArrayCoordinates = /**
     * @param {?} crs
     * @param {?=} arr
     * @return {?}
     */
    function (crs, arr) {
        if (!arr) {
            arr = this.latlngs;
        }
        for (var /** @type {?} */ i = 0; i < arr.length; i++) {
            if (typeof (arr[0]) !== "number") {
                arr[i] = this.transformArrayCoordinates(crs, arr[i]);
            }
            else {
                if (crs.code && crs.code !== "EPSG:3857") {
                    var /** @type {?} */ trasformed = crs.unproject({ x: arr[0], y: arr[1] });
                    arr = { lat: trasformed.lat, lng: trasformed.lng };
                }
                else {
                    arr = { lat: arr[0], lng: arr[1] };
                }
            }
        }
        return arr;
    };
    CoordinateHandler.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "x": [{ type: core.Input },],
        "y": [{ type: core.Input },],
        "latlngs": [{ type: core.Input },],
        "xys": [{ type: core.Input },],
    };
    return CoordinateHandler;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LeafletElement = (function (_super) {
    __extends(LeafletElement, _super);
    function LeafletElement(mapService) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.lat = 52.6;
        _this.lon = -1.1;
        _this.zoom = 12;
        _this.minZoom = 4;
        _this.maxZoom = 19;
        _this.layerControl = false;
        _this.crs = L.CRS.EPSG3857;
        _this.maxBounds = null;
        _this.layerControlObject = null;
        return _this;
    }
    /**
     * @return {?}
     */
    LeafletElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianPointToLeafletsLatLngSchema.call(this);
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
        _super.prototype.transformPointCoordinates.call(this, this.crs);
        var /** @type {?} */ map$$1 = L.map(this.mapElement.nativeElement, {
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
    };
    /**
     * @return {?}
     */
    LeafletElement.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    LeafletElement.prototype.setLayerControl = /**
     * @return {?}
     */
    function () {
        if (this.layerControl) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.layerControlObject !== null) {
                this.layerControlObject.getContainer().innerHTML = '';
            }
            this.layerControlObject = L.control.layers(this.mapService.getBasemaps(), this.mapService.getOverlays()).addTo(map$$1);
        }
    };
    LeafletElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'leaf-element',
                    template: "\n  <div class=\"page-background map-container\" layout-padding>\n\t  <div #map></div>\n  </div>",
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
    LeafletElement.ctorParameters = function () { return [
        { type: MapService, },
    ]; };
    LeafletElement.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "zoom": [{ type: core.Input },],
        "minZoom": [{ type: core.Input },],
        "maxZoom": [{ type: core.Input },],
        "layerControl": [{ type: core.Input },],
        "crs": [{ type: core.Input },],
        "zoomControl": [{ type: core.Input },],
        "maxBounds": [{ type: core.Input },],
        "mapElement": [{ type: core.ViewChild, args: ['map',] },],
    };
    return LeafletElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GeoJSONCoordinateHandler = (function () {
    function GeoJSONCoordinateHandler() {
        this.geojson = {};
    }
    /**
     * @param {?} geoJSON
     * @param {?} crs
     * @return {?}
     */
    GeoJSONCoordinateHandler.prototype.transformJSONCoordinates = /**
     * @param {?} geoJSON
     * @param {?} crs
     * @return {?}
     */
    function (geoJSON, crs) {
        var _this = this;
        /**
                 * 7.  GeoJSON Types Are Not Extensible
                 * Implementations MUST NOT extend the fixed set of GeoJSON types:
                 * FeatureCollection, Feature, Point, LineString, MultiPoint, Polygon,
                 * MultiLineString, MultiPolygon, and GeometryCollection.
                 */
        if (geoJSON.type === "FeatureCollection") {
            var /** @type {?} */ featureCollection = geoJSON;
            featureCollection.features.forEach(function (feature) {
                _this.transformJSONCoordinates(feature, crs);
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
            lineString.coordinates.forEach(function (point) {
                _this.transformPointCoordinates(point, crs);
            });
        }
        if (geoJSON.type === "MultiPoint") {
            var /** @type {?} */ multiPoint = geoJSON;
            multiPoint.coordinates.forEach(function (point) {
                _this.transformPointCoordinates(point, crs);
            });
        }
        if (geoJSON.type === "Polygon") {
            var /** @type {?} */ polygon = geoJSON;
            polygon.coordinates.forEach(function (polygonElement) {
                polygonElement.forEach(function (point) {
                    _this.transformPointCoordinates(point, crs);
                });
            });
        }
        if (geoJSON.type === "MultiLineString") {
            var /** @type {?} */ multiLineString = geoJSON;
            multiLineString.coordinates.forEach(function (lineString) {
                lineString.forEach(function (point) {
                    _this.transformPointCoordinates(point, crs);
                });
            });
        }
        if (geoJSON.type === "MultiPolygon") {
            var /** @type {?} */ multiPolygon = geoJSON;
            multiPolygon.coordinates.forEach(function (polygon) {
                polygon.forEach(function (polygonElement) {
                    polygonElement.forEach(function (point) {
                        _this.transformPointCoordinates(point, crs);
                    });
                });
            });
        }
        if (geoJSON.type === "GeometryCollection") {
            var /** @type {?} */ geometryCollection = geoJSON;
            geometryCollection.geometries.forEach(function (geometry) {
                _this.transformJSONCoordinates(geometry, crs);
            });
        }
    };
    /**
     * @param {?} point
     * @param {?} crs
     * @return {?}
     */
    GeoJSONCoordinateHandler.prototype.transformPointCoordinates = /**
     * @param {?} point
     * @param {?} crs
     * @return {?}
     */
    function (point, crs) {
        /**
                 * this is because leaflet default CRS is 3857 (so it can render wms properly)
                 * but uses 4326 everywhere else so if CRS is 3857 don't reproject coordinates
                 * also proj4 by default unprojects (inverse) to wgs84 (4326) which is handy but
                 * doesnt match leaflet's default projection. Generally I don't really agree on
                 * how leaflet doesn't handle projections on a global state
                 */
        if (crs.code && crs.code !== "EPSG:3857") {
            var /** @type {?} */ newlatlng = crs.unproject({ x: point[0], y: point[1] });
            point[1] = newlatlng.lat;
            point[0] = newlatlng.lng;
            return point;
        }
        else {
            return point;
        }
    };
    GeoJSONCoordinateHandler.propDecorators = {
        "geojson": [{ type: core.Input },],
    };
    return GeoJSONCoordinateHandler;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var attributionModel = (function () {
    function attributionModel(options) {
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
    return attributionModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AttributionControl = (function () {
    function AttributionControl(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new attributionModel(null);
    }
    /**
     * @return {?}
     */
    AttributionControl.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.LeafletElement) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.attribution(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This attribution-control will not be rendered \n the expected parent node of attribution-control should be either leaf-element or layer-element");
        }
    };
    AttributionControl.decorators = [
        { type: core.Component, args: [{
                    selector: 'attribution-control',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    AttributionControl.ctorParameters = function () { return [
        { type: MapService, },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
    ]; };
    AttributionControl.propDecorators = {
        "Options": [{ type: core.Input },],
    };
    return AttributionControl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var scaleModel = (function () {
    function scaleModel(options) {
        this.maxWidth = 100;
        this.metric = true;
        this.imperial = true;
        this.updateWhenIdle = true;
        this.position = "bottomleft";
        var /** @type {?} */ source = options;
        var /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
    return scaleModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ScaleControl = (function () {
    function ScaleControl(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new scaleModel(null);
    }
    /**
     * @return {?}
     */
    ScaleControl.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.LeafletElement) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.scale(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This scale-control will not be rendered \n the expected parent node of scale-control should be leaf-element");
        }
    };
    ScaleControl.decorators = [
        { type: core.Component, args: [{
                    selector: 'scale-control',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    ScaleControl.ctorParameters = function () { return [
        { type: MapService, },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
    ]; };
    ScaleControl.propDecorators = {
        "Options": [{ type: core.Input },],
    };
    return ScaleControl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var zoomModel = (function () {
    function zoomModel(options) {
        this.zoomInText = "+";
        this.zoomInTitle = "Zoom in";
        this.zoomOutText = "-";
        this.zoomOutTitle = "Zoom out";
        this.position = "topright";
        var /** @type {?} */ source = options;
        var /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
    return zoomModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ZoomControl = (function () {
    function ZoomControl(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
        this.Options = new zoomModel(null);
    }
    /**
     * @return {?}
     */
    ZoomControl.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.LeafletElement) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            L.control.zoom(this.Options).addTo(map$$1);
        }
        else {
            console.warn("This zoom-control will not be rendered \n the expected parent node of zoom-control should be leaf-element");
        }
    };
    ZoomControl.decorators = [
        { type: core.Component, args: [{
                    selector: 'zoom-control',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    ZoomControl.ctorParameters = function () { return [
        { type: MapService, },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
    ]; };
    ZoomControl.propDecorators = {
        "Options": [{ type: core.Input },],
    };
    return ZoomControl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WatermarkControl = (function () {
    function WatermarkControl(mapService, LeafletElement$$1) {
        this.mapService = mapService;
        this.LeafletElement = LeafletElement$$1;
    }
    /**
     * @return {?}
     */
    WatermarkControl.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ self = this;
        if (this.LeafletElement) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.url) {
                L.Control['Watermark'] = /** @type {?} */ ({});
                L.Control['Watermark'] = L.Control.extend({
                    onAdd: function (map$$1) {
                        var /** @type {?} */ basediv = L.DomUtil.create('div', 'watermark');
                        var /** @type {?} */ howManyInX = Math.ceil(map$$1.getSize().x / self.imagewidth);
                        var /** @type {?} */ howManyInY = Math.ceil(map$$1.getSize().y / self.imageheight);
                        var /** @type {?} */ numberOfLogo = howManyInX * howManyInY;
                        console.log(numberOfLogo);
                        var /** @type {?} */ i = 0;
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
    };
    WatermarkControl.decorators = [
        { type: core.Component, args: [{
                    selector: 'watermark-element',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    WatermarkControl.ctorParameters = function () { return [
        { type: MapService, },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
    ]; };
    WatermarkControl.propDecorators = {
        "url": [{ type: core.Input },],
        "imagewidth": [{ type: core.Input },],
        "imageheight": [{ type: core.Input },],
    };
    return WatermarkControl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LayerElement = (function () {
    function LayerElement(mapService) {
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
    LayerElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.mapService.increaseNumber();
        var /** @type {?} */ map$$1 = this.mapService.getMap();
        var /** @type {?} */ layer = null;
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
    };
    LayerElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'layer-element',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    LayerElement.ctorParameters = function () { return [
        { type: MapService, },
    ]; };
    LayerElement.propDecorators = {
        "slippyLayer": [{ type: core.Input },],
        "wmsLayer": [{ type: core.Input },],
        "name": [{ type: core.Input },],
        "opacity": [{ type: core.Input },],
        "type": [{ type: core.Input },],
        "attribution": [{ type: core.Input },],
    };
    return LayerElement;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ImageOverlayElement = (function (_super) {
    __extends(ImageOverlayElement, _super);
    function ImageOverlayElement(mapService, LeafletElement$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.LeafletElement = LeafletElement$$1;
        _this.bounds = [[-26.5, -25], [1021.5, 1023]];
        _this.imagepath = '';
        _this.name = '';
        _this.opacity = 1;
        _this.type = 'overlay';
        return _this;
    }
    /**
     * @return {?}
     */
    ImageOverlayElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.latlngs = this.bounds;
        if (this.LeafletElement) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            _super.prototype.transformArrayCoordinates.call(this, this.LeafletElement.crs);
            var /** @type {?} */ layer = null;
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
    };
    ImageOverlayElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'image-overlay-element',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    ImageOverlayElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
    ]; };
    ImageOverlayElement.propDecorators = {
        "bounds": [{ type: core.Input },],
        "imagepath": [{ type: core.Input },],
        "name": [{ type: core.Input },],
        "opacity": [{ type: core.Input },],
        "type": [{ type: core.Input },],
    };
    return ImageOverlayElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GuidService = (function () {
    function GuidService() {
    }
    /**
     * @return {?}
     */
    GuidService.prototype.newGuid = /**
     * @return {?}
     */
    function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var /** @type {?} */ r = Math.random() * 16 | 0, /** @type {?} */ v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    GuidService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    GuidService.ctorParameters = function () { return []; };
    return GuidService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GroupService = (function () {
    function GroupService(guidService) {
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
    GroupService.prototype.addOLayersToGroup = /**
     * @param {?} overlay
     * @param {?} map
     * @param {?} mapService
     * @param {?} group
     * @param {?=} replace
     * @param {?=} gId
     * @return {?}
     */
    function (overlay, map$$1, mapService, group, replace, gId) {
        if (replace === void 0) { replace = false; }
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
    };
    /**
     * @return {?}
     */
    GroupService.prototype.getObservableGroup = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return Observable.Observable.create(function (observer) {
            var /** @type {?} */ group = _this.getGroup();
            observer.next(group);
            observer.complete();
        });
    };
    /**
     * @return {?}
     */
    GroupService.prototype.getGroup = /**
     * @return {?}
     */
    function () {
        return this.group;
    };
    /**
     * @return {?}
     */
    GroupService.prototype.getLayerGroup = /**
     * @return {?}
     */
    function () {
        return this.layerGroup;
    };
    /**
     * @return {?}
     */
    GroupService.prototype.getLayerNumber = /**
     * @return {?}
     */
    function () {
        return this.layerGroupNumber;
    };
    GroupService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    GroupService.ctorParameters = function () { return [
        { type: GuidService, },
    ]; };
    return GroupService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PopupService = (function () {
    function PopupService() {
    }
    /**
     * @param {?} mouseover
     * @param {?} onclick
     * @param {?} element
     * @param {?} text
     * @return {?}
     */
    PopupService.prototype.enablePopup = /**
     * @param {?} mouseover
     * @param {?} onclick
     * @param {?} element
     * @param {?} text
     * @return {?}
     */
    function (mouseover, onclick, element, text) {
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
    };
    PopupService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    PopupService.ctorParameters = function () { return []; };
    return PopupService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LeafletGroup = (function () {
    function LeafletGroup(mapService, groupService, guidService) {
        this.mapService = mapService;
        this.groupService = groupService;
        this.guidService = guidService;
        this.name = '';
        this.globalId = this.guidService.newGuid();
    }
    /**
     * @return {?}
     */
    LeafletGroup.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    LeafletGroup.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
    };
    LeafletGroup.decorators = [
        { type: core.Component, args: [{
                    selector: 'leaflet-group',
                    template: "",
                    styles: [''],
                    providers: [GroupService]
                },] },
    ];
    /** @nocollapse */
    LeafletGroup.ctorParameters = function () { return [
        { type: MapService, },
        { type: GroupService, },
        { type: GuidService, },
    ]; };
    LeafletGroup.propDecorators = {
        "name": [{ type: core.Input },],
    };
    return LeafletGroup;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MarkerElement = (function (_super) {
    __extends(MarkerElement, _super);
    function MarkerElement(mapService, popupService, http$$1, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.http = http$$1;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.lat = 52.6;
        _this.lon = -1.1;
        _this.mouseover = undefined;
        _this.onclick = undefined;
        _this.iconUrl = "";
        _this.marker = null;
        return _this;
    }
    /**
     * @return {?}
     */
    MarkerElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianPointToLeafletsLatLngSchema.call(this);
        var /** @type {?} */ model = this;
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ map_1 = this.mapService.getMap();
            _super.prototype.transformPointCoordinates.call(this, this.LeafletElement.crs);
            if (this.iconUrl === "") {
                this.marker = L.marker([this.lat, this.lon]);
                this.createMarkerlayer(this.marker, map_1);
            }
            else {
                this.imageExists(this.iconUrl, function (exists) {
                    model.getImage().subscribe(function (image) {
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
                            model.createMarkerlayer(model.marker, map_1);
                        };
                        reader.readAsDataURL(image.blob());
                    }, function (err) {
                        console.log(err);
                    });
                });
            }
        }
        else {
            console.warn("This marker-element will not be rendered \n the expected parent node of marker-element should be either leaf-element or leaflet-group");
        }
    };
    /**
     * @param {?} marker
     * @param {?} map
     * @return {?}
     */
    MarkerElement.prototype.createMarkerlayer = /**
     * @param {?} marker
     * @param {?} map
     * @return {?}
     */
    function (marker, map$$1) {
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
    };
    /**
     * @param {?} url
     * @param {?} callback
     * @return {?}
     */
    MarkerElement.prototype.imageExists = /**
     * @param {?} url
     * @param {?} callback
     * @return {?}
     */
    function (url, callback) {
        var /** @type {?} */ img = new Image();
        img.onload = function () { callback(true); };
        img.onerror = function () { callback(false); };
        img.src = url;
    };
    /**
     * @return {?}
     */
    MarkerElement.prototype.getImage = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ headers = new http.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var /** @type {?} */ options = new http.RequestOptions({
            responseType: http.ResponseContentType.Blob,
            headers: headers
        });
        return this.http.get(this.iconUrl, options)
            .map(function (res) { return res; })
            .catch(function (error) { return Observable.Observable.throw('Server error'); });
    };
    MarkerElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'marker-element',
                    template: "<div #ngel><ng-content></ng-content></div>",
                    styles: [''],
                    providers: [PopupService]
                },] },
    ];
    /** @nocollapse */
    MarkerElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: http.Http, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    MarkerElement.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "mouseover": [{ type: core.Input },],
        "onclick": [{ type: core.Input },],
        "iconUrl": [{ type: core.Input },],
        "ngEl": [{ type: core.ViewChild, args: ['ngel',] },],
    };
    return MarkerElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var path = (function () {
    function path(pathInfo) {
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
        var /** @type {?} */ source = pathInfo;
        var /** @type {?} */ copy = this;
        if (source !== null) {
            for (var /** @type {?} */ key in source) {
                if (source[key] !== undefined) {
                    copy[key] = source[key];
                }
            }
        }
    }
    return path;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CircleElement = (function (_super) {
    __extends(CircleElement, _super);
    function CircleElement(mapService, popupService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.lat = 52.6;
        _this.lon = -1.1;
        _this.radius = 20;
        _this.mouseover = undefined;
        _this.onclick = undefined;
        _this.Options = new path(null);
        _this.circle = null;
        return _this;
    }
    /**
     * @return {?}
     */
    CircleElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianPointToLeafletsLatLngSchema.call(this);
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ inheritedOptions = new path(this.Options);
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            _super.prototype.transformPointCoordinates.call(this, this.LeafletElement.crs);
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
    };
    /**
     * @return {?}
     */
    CircleElement.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
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
    };
    CircleElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'circle-element',
                    template: "<div #ngel><ng-content></ng-content></div>",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    CircleElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    CircleElement.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "radius": [{ type: core.Input },],
        "mouseover": [{ type: core.Input },],
        "onclick": [{ type: core.Input },],
        "Options": [{ type: core.Input },],
        "ngEl": [{ type: core.ViewChild, args: ['ngel',] },],
    };
    return CircleElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CircleMarkerElement = (function (_super) {
    __extends(CircleMarkerElement, _super);
    function CircleMarkerElement(mapService, popupService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.lat = 52.6;
        _this.lon = -1.1;
        _this.mouseover = undefined;
        _this.onclick = undefined;
        _this.Options = new path(null);
        _this.circle = null;
        return _this;
    }
    /**
     * @return {?}
     */
    CircleMarkerElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianPointToLeafletsLatLngSchema.call(this);
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ inheritedOptions = new path(this.Options);
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            var /** @type {?} */ elementPosition = _super.prototype.transformPointCoordinates.call(this, this.LeafletElement.crs);
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
    };
    /**
     * @return {?}
     */
    CircleMarkerElement.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.circle, textInput);
        }
    };
    CircleMarkerElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'circle-marker-element',
                    template: "<div #ngel><ng-content></ng-content></div>",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    CircleMarkerElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    CircleMarkerElement.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "mouseover": [{ type: core.Input },],
        "onclick": [{ type: core.Input },],
        "Options": [{ type: core.Input },],
        "ngEl": [{ type: core.ViewChild, args: ['ngel',] },],
    };
    return CircleMarkerElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var HelperService = (function () {
    function HelperService() {
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    HelperService.prototype.arrayCompare = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
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
    };
    HelperService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    HelperService.ctorParameters = function () { return []; };
    return HelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PolygonElement = (function (_super) {
    __extends(PolygonElement, _super);
    function PolygonElement(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.guidService = guidService;
        _this.helperService = helperService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.latlngs = [[[52.65, -1.2], [52.645, -1.15], [52.696, -1.155], [52.697, -1.189]],
            [[52.66, -1.19], [52.665, -1.16], [52.686, -1.161], [52.687, -1.179]]];
        _this.Options = new path(null);
        _this.mouseover = undefined;
        _this.onclick = undefined;
        _this.polygon = null;
        _this.originalObject = _this.latlngs.slice();
        _this.globalId = _this.guidService.newGuid();
        return _this;
    }
    /**
     * @return {?}
     */
    PolygonElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianArrayToLeafletsLatLngSchema.call(this);
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ inheritedOptions = new path(this.Options);
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            _super.prototype.transformArrayCoordinates.call(this, this.LeafletElement.crs);
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
    };
    /**
     * @return {?}
     */
    PolygonElement.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.polygon, textInput);
        }
    };
    /**
     * @return {?}
     */
    PolygonElement.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ map$$1 = this.mapService.getMap();
        var /** @type {?} */ same = this.helperService.arrayCompare(this.originalObject, this.latlngs);
        if (!same) {
            this.originalObject = this.latlngs.slice();
            //if the layer is part of a group
            var /** @type {?} */ inheritedOptions = new path(this.Options);
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
    };
    PolygonElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'polygon-element',
                    template: "<div #ngel><ng-content></ng-content></div>",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    PolygonElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: GuidService, },
        { type: HelperService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    PolygonElement.propDecorators = {
        "latlngs": [{ type: core.Input },],
        "Options": [{ type: core.Input },],
        "mouseover": [{ type: core.Input },],
        "onclick": [{ type: core.Input },],
        "ngEl": [{ type: core.ViewChild, args: ['ngel',] },],
    };
    return PolygonElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PolylineElement = (function (_super) {
    __extends(PolylineElement, _super);
    function PolylineElement(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.guidService = guidService;
        _this.helperService = helperService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.latlngs = [[52.6, -1.1], [52.605, -1.1], [52.606, -1.105], [52.697, -1.109]];
        _this.Options = new path(null);
        _this.mouseover = undefined;
        _this.onclick = undefined;
        _this.polyline = null;
        _this.originalObject = _this.latlngs.slice();
        _this.globalId = _this.guidService.newGuid();
        return _this;
    }
    /**
     * @return {?}
     */
    PolylineElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianArrayToLeafletsLatLngSchema.call(this);
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            //polyline shouldn't have a fill
            this.Options.fill = false;
            var /** @type {?} */ inheritedOptions = new path(this.Options);
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            _super.prototype.transformArrayCoordinates.call(this, this.LeafletElement.crs);
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
    };
    /**
     * @return {?}
     */
    PolylineElement.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ textInput = undefined;
        if (this.ngEl.nativeElement.childNodes.length > 0) {
            var /** @type {?} */ textNode = this.ngEl.nativeElement.childNodes[0];
            textInput = textNode.nodeValue;
        }
        //add popup methods on element only if any of the tests are not undefined
        if (this.mouseover !== undefined || this.onclick !== undefined || textInput !== undefined) {
            this.popupService.enablePopup(this.mouseover, this.onclick, this.polyline, textInput);
        }
    };
    /**
     * @return {?}
     */
    PolylineElement.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ map$$1 = this.mapService.getMap();
        var /** @type {?} */ same = this.helperService.arrayCompare(this.originalObject, this.latlngs);
        if (!same) {
            this.originalObject = this.latlngs.slice();
            //if the layer is part of a group
            this.Options.fill = false;
            var /** @type {?} */ inheritedOptions = new path(this.Options);
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
    };
    PolylineElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'polyline-element',
                    template: "<div #ngel><ng-content></ng-content></div>",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    PolylineElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: GuidService, },
        { type: HelperService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    PolylineElement.propDecorators = {
        "latlngs": [{ type: core.Input },],
        "Options": [{ type: core.Input },],
        "mouseover": [{ type: core.Input },],
        "onclick": [{ type: core.Input },],
        "ngEl": [{ type: core.ViewChild, args: ['ngel',] },],
    };
    return PolylineElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GeoJsonElement = (function (_super) {
    __extends(GeoJsonElement, _super);
    function GeoJsonElement(mapService, popupService, guidService, helperService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.popupService = popupService;
        _this.guidService = guidService;
        _this.helperService = helperService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.originalObject = Object.assign({}, _this.geojson);
        _this.globalId = _this.guidService.newGuid();
        return _this;
    }
    /**
     * @return {?}
     */
    GeoJsonElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            //polyline shouldn't have a fill
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            if (this.geojson) {
                _super.prototype.transformJSONCoordinates.call(this, this.geojson, this.LeafletElement.crs);
                var /** @type {?} */ gjson = L.geoJSON(this.geojson);
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
    };
    /**
     * @return {?}
     */
    GeoJsonElement.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ map$$1 = this.mapService.getMap();
    };
    GeoJsonElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'geojson-element',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    GeoJsonElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: PopupService, },
        { type: GuidService, },
        { type: HelperService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    return GeoJsonElement;
}(GeoJSONCoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PopupElement = (function (_super) {
    __extends(PopupElement, _super);
    function PopupElement(mapService, groupService, LeafletElement$$1, LeafletGroup$$1) {
        var _this = _super.call(this) || this;
        _this.mapService = mapService;
        _this.groupService = groupService;
        _this.LeafletElement = LeafletElement$$1;
        _this.LeafletGroup = LeafletGroup$$1;
        _this.lat = 52.6;
        _this.lon = -1.9;
        _this.content = "nice popup";
        return _this;
    }
    /**
     * @return {?}
     */
    PopupElement.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.assignCartesianPointToLeafletsLatLngSchema.call(this);
        //check if any of the two optional injections exist
        if (this.LeafletElement || this.LeafletGroup) {
            var /** @type {?} */ map$$1 = this.mapService.getMap();
            _super.prototype.transformPointCoordinates.call(this, this.LeafletElement.crs);
            var /** @type {?} */ popup = L.popup({ autoClose: false, keepInView: true }).setLatLng([this.lat, this.lon]).setContent(/** @type {?} */ (this.content));
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
    };
    PopupElement.decorators = [
        { type: core.Component, args: [{
                    selector: 'popup-element',
                    template: "",
                    styles: ['']
                },] },
    ];
    /** @nocollapse */
    PopupElement.ctorParameters = function () { return [
        { type: MapService, },
        { type: GroupService, decorators: [{ type: core.Optional },] },
        { type: LeafletElement, decorators: [{ type: core.Optional },] },
        { type: LeafletGroup, decorators: [{ type: core.Optional },] },
    ]; };
    PopupElement.propDecorators = {
        "lat": [{ type: core.Input },],
        "lon": [{ type: core.Input },],
        "content": [{ type: core.Input },],
    };
    return PopupElement;
}(CoordinateHandler));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ngxLeafletModule = (function () {
    function ngxLeafletModule() {
    }
    ngxLeafletModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        http.HttpModule
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
    ngxLeafletModule.ctorParameters = function () { return []; };
    return ngxLeafletModule;
}());

exports.LeafletElement = LeafletElement;
exports.CoordinateHandler = CoordinateHandler;
exports.GeoJSONCoordinateHandler = GeoJSONCoordinateHandler;
exports.AttributionControl = AttributionControl;
exports.ScaleControl = ScaleControl;
exports.ZoomControl = ZoomControl;
exports.WatermarkControl = WatermarkControl;
exports.LayerElement = LayerElement;
exports.ImageOverlayElement = ImageOverlayElement;
exports.MarkerElement = MarkerElement;
exports.CircleElement = CircleElement;
exports.CircleMarkerElement = CircleMarkerElement;
exports.PolygonElement = PolygonElement;
exports.PolylineElement = PolylineElement;
exports.GeoJsonElement = GeoJsonElement;
exports.PopupElement = PopupElement;
exports.LeafletGroup = LeafletGroup;
exports.MapService = MapService;
exports.GroupService = GroupService;
exports.PopupService = PopupService;
exports.GuidService = GuidService;
exports.HelperService = HelperService;
exports.attributionModel = attributionModel;
exports.path = path;
exports.scaleModel = scaleModel;
exports.zoomModel = zoomModel;
exports.ngxLeafletModule = ngxLeafletModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
