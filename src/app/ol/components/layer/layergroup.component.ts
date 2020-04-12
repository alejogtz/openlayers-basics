import { Component, OnInit, OnDestroy, SkipSelf, Optional } from '@angular/core';
import { LayerComponent } from './layer.component';
import { MapComponent } from '../map.component';
import LayerGroup from 'ol/layer/Group';

@Component({
    selector: 'aol-layer-group',
    template: `<ng-content></ng-content>`
})
export class LayerGroupComponent extends LayerComponent implements OnInit, OnDestroy {
    public instance: LayerGroup;

    constructor(map: MapComponent,
        @SkipSelf() @Optional() group?: LayerGroupComponent) {
        super(group || map);
    }

    ngOnInit() {
        // console.log(`creating ol.layer.Group instance with:`, this);
        this.instance = new LayerGroup(this);
        super.ngOnInit();
    }
}
