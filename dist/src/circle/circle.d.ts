import { ElementRef } from '@angular/core';
import { LeafletElement } from '../map/map';
import { LeafletGroup } from '../group/group';
import { MapService } from '../services/map.service';
import { GroupService } from '../services/group.service';
import { PopupService } from '../services/popup.service';
import { CoordinateHandler } from '../helpers/coordinateHandler';
export declare class CircleElement extends CoordinateHandler {
    private mapService;
    private popupService;
    private groupService;
    private LeafletElement;
    private LeafletGroup;
    lat: number;
    lon: number;
    radius: number;
    mouseover: string | undefined;
    onclick: string | undefined;
    Options: any;
    ngEl: ElementRef;
    circle: any;
    constructor(mapService: MapService, popupService: PopupService, groupService?: GroupService, LeafletElement?: LeafletElement, LeafletGroup?: LeafletGroup);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
