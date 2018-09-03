import { Component, Input, Optional } from '@angular/core';
import { LeafletElement } from '../map/map';
import { MapService } from '../services/map.service';
import { CoordinateHandler } from '../helpers/coordinateHandler';
declare var L:any;


@Component({
  selector: 'image-overlay-element',
  template: ``,
  styles: ['']
})

export class ImageOverlayElement extends CoordinateHandler {
  @Input() bounds: any = [[-26.5, -25], [1021.5, 1023]];
  @Input() imagepath: string = '';
  @Input() name: string = '';
  @Input() opacity: number = 1;
  @Input() type: string = 'overlay'
  public latlngs: any;

  constructor(private mapService: MapService,
    @Optional() private LeafletElement?: LeafletElement) {
    super();
  }

  ngOnInit() {
    this.latlngs = this.bounds;
    
    if (this.LeafletElement) {
      let map = this.mapService.getMap();
      super.transformArrayCoordinates(this.LeafletElement.crs);

      let layer = null;

      layer = L.imageOverlay(this.imagepath, this.bounds).setOpacity(this.opacity);

      if (layer !== {}) {
        if (this.type === "overlay") {
          this.mapService.addOverlay(layer, this.name);
          layer.addTo(map);
        } else if (this.type === "basemap") {
          this.mapService.addBasemap(layer, this.name);
        }
      }
    }
  }
}
