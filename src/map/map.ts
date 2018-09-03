import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../services/map.service';
import { CoordinateHandler } from '../helpers/coordinateHandler';
declare var L:any;

@Component({
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
    '.leaflet-bottom.leaflet-left {z-index: 1 !important;}'],
  providers: [MapService]
})

export class LeafletElement extends CoordinateHandler {
  @Input() lat: number = 52.6;
  @Input() lon: number = -1.1;
  @Input() zoom: number = 12;
  @Input() minZoom: number = 4;
  @Input() maxZoom: number = 19;
  @Input() layerControl: boolean = false;
  @Input() crs: any = L.CRS.EPSG3857;
  @Input() zoomControl: boolean;
  @Input() maxBounds: L.LatLngBounds = null;
  @ViewChild('map') mapElement: ElementRef;

  public layerControlObject = null;

  constructor(private mapService: MapService) {
    super();
  }

  ngOnInit() {
    super.assignCartesianPointToLeafletsLatLngSchema();

    if (typeof (this.crs) === "string") {
      var splitCrs = this.crs.split(".");
      if (splitCrs[0] === "L") {
        this.crs = L[splitCrs[1]][splitCrs[2]];
      } else {
        console.warn("something is not right, reverting to default EPSG3857");
        this.crs = L.CRS.EPSG3857;
      }
    }

    super.transformPointCoordinates(this.crs);

    let map = L.map(this.mapElement.nativeElement, {
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
    this.mapElement.nativeElement.myMapProperty = map;

    //set variables for childrent components
    this.mapService.setMap(map);
    this.mapService.setLayerControl(this.layerControl);
  }

  ngAfterViewInit() {
  }

  setLayerControl() {
    if (this.layerControl) {
      let map = this.mapService.getMap();
      if (this.layerControlObject !== null) {
        this.layerControlObject.getContainer().innerHTML = '';
      }
      this.layerControlObject = L.control.layers(this.mapService.getBasemaps(), this.mapService.getOverlays()).addTo(map);
    }
  }
}
