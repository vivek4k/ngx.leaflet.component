import { Component, Input, Optional } from '@angular/core';
import { LeafletElement } from '../map/map';
import { LeafletGroup } from '../group/group';
import { MapService } from '../services/map.service';
import { GroupService } from '../services/group.service';
import { CoordinateHandler } from '../helpers/coordinateHandler';
declare var L:any;


@Component({
  selector: 'popup-element',
  template: ``,
  styles: ['']
})

export class PopupElement extends CoordinateHandler {
  @Input() lat: number = 52.6;
  @Input() lon: number = -1.9;
  @Input() content: string = "nice popup";

  constructor(
    private mapService: MapService,
    @Optional() private groupService?: GroupService,        
    @Optional() private LeafletElement?: LeafletElement,
    @Optional() private LeafletGroup?: LeafletGroup) {
    super();
  }

  ngOnInit() {
    super.assignCartesianPointToLeafletsLatLngSchema();
    //check if any of the two optional injections exist
    if (this.LeafletElement || this.LeafletGroup) {

      let map = this.mapService.getMap();

      super.transformPointCoordinates(this.LeafletElement.crs);

      let popup = L.popup({ autoClose: false, keepInView: true }).setLatLng([this.lat, this.lon]).setContent(<any>this.content);

      if (this.LeafletGroup) {
        this.groupService.addOLayersToGroup(popup, map, this.mapService, this.LeafletGroup);
      } else {
        popup.addTo(map);
      }
    } else {
      console.warn("This popup-element will not be rendered \n the expected parent node of popup-element should be either leaf-element or leaflet-group");
    }
  }
}
