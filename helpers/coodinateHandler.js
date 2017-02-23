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
var core_1 = require("@angular/core");
var CoordinateHandler = (function () {
    function CoordinateHandler() {
    }
    CoordinateHandler.prototype.copyCoordinates = function () {
        if (this.x !== undefined) {
            this.lon = this.x;
        }
        if (this.y !== undefined) {
            this.lat = this.y;
        }
    };
    CoordinateHandler.prototype.transformCoordinates = function (crs) {
        if (crs.code && crs.code !== "EPSG:3857") {
            return crs.unproject({ y: this.lat, x: this.lon });
        }
        else {
            return { lat: this.lat, lon: this.lon };
        }
    };
    return CoordinateHandler;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CoordinateHandler.prototype, "lat", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CoordinateHandler.prototype, "lon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CoordinateHandler.prototype, "x", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CoordinateHandler.prototype, "y", void 0);
exports.CoordinateHandler = CoordinateHandler;
//# sourceMappingURL=coodinateHandler.js.map