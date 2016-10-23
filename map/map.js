"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var map_service_1 = require('../services/map.service');
var Lealflet = require('leaflet');
var LeafletElement = (function () {
    function LeafletElement(mapService) {
        this.mapService = mapService;
        this.lat = 52.6;
        this.lon = -1.1;
        this.zoom = 12;
        this.minZoom = 4;
        this.maxZoom = 19;
    }
    LeafletElement.prototype.ngOnInit = function () {
        var map = L.map("map", {
            zoomControl: false,
            center: L.latLng(this.lat, this.lon),
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            layers: []
        });
        this.mapService.setMap(map);
        L.control.zoom({ position: "topright" }).addTo(map);
        L.control.scale().addTo(map);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LeafletElement.prototype, "lat", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LeafletElement.prototype, "lon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LeafletElement.prototype, "zoom", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LeafletElement.prototype, "minZoom", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LeafletElement.prototype, "maxZoom", void 0);
    LeafletElement = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'leaf-element',
            templateUrl: 'map.html',
            styleUrls: ['map.css'],
            providers: [map_service_1.MapService]
        }), 
        __metadata('design:paramtypes', [map_service_1.MapService])
    ], LeafletElement);
    return LeafletElement;
}());
exports.LeafletElement = LeafletElement;
//# sourceMappingURL=map.js.map