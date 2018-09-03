import { Component, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { GroupService } from '../services/group.service';
import { GuidService } from '../services/globalId.service';
declare var L:any;


@Component({
    selector: 'leaflet-group',
    template: ``,
    styles: [''],
    providers: [GroupService]    
})

export class LeafletGroup {
    @Input() name: string = '';
    public globalId: string = this.guidService.newGuid();

    constructor(
        private mapService: MapService,
        private groupService: GroupService,
        private guidService: GuidService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }


}
