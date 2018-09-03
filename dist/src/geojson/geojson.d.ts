import { LeafletElement } from '../map/map';
import { LeafletGroup } from '../group/group';
import { MapService } from '../services/map.service';
import { GroupService } from '../services/group.service';
import { PopupService } from '../services/popup.service';
import { GuidService } from '../services/globalId.service';
import { HelperService } from '../services/helper.service';
import { GeoJSONCoordinateHandler } from '../helpers/geoJsonReader';
export declare class GeoJsonElement extends GeoJSONCoordinateHandler {
    private mapService;
    private popupService;
    private guidService;
    private helperService;
    private groupService;
    private LeafletElement;
    private LeafletGroup;
    originalObject: any;
    globalId: string;
    constructor(mapService: MapService, popupService: PopupService, guidService: GuidService, helperService: HelperService, groupService?: GroupService, LeafletElement?: LeafletElement, LeafletGroup?: LeafletGroup);
    ngOnInit(): void;
    ngDoCheck(): void;
}
