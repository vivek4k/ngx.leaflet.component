import { Component, Input, Optional } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LeafletElement } from '../map';
declare var L:any;

@Component({
    selector: 'watermark-element',
    template: ``,
    styles: ['']
})

export class WatermarkControl {
    @Input() url: string;
    @Input() imagewidth: number;
    @Input() imageheight: number;

    constructor(private mapService: MapService,
        @Optional() private LeafletElement?: LeafletElement)
    { }

    ngOnInit() {
        var self = this;
        if (this.LeafletElement) {
            let map = this.mapService.getMap();
            if (this.url) {
                L.Control['Watermark'] = <any>{};

                L.Control['Watermark'] = L.Control.extend({
                    onAdd: function (map) {
                        var basediv: any = L.DomUtil.create('div', 'watermark');

                        var howManyInX = Math.ceil(map.getSize().x / self.imagewidth);
                        var howManyInY = Math.ceil(map.getSize().y / self.imageheight);

                        var numberOfLogo = howManyInX * howManyInY;
                        console.log(numberOfLogo);
                        let i = 0;
                        for (i; i < numberOfLogo; i++) {
                            var img: any = L.DomUtil.create('img', 'watermark-elements', basediv);
                            img.src = self.url;
                            img.style.width = self.imagewidth + 'px';
                        }
                        return basediv;
                    },

                    onRemove: function (map) {
                    }
                });

                L.control['watermark'] = function (opts) {
                    return new L.Control['Watermark'](opts);
                }
            }

            L.control['watermark']({ position: "bottomleft" }).addTo(map);
        }
    }
}