import {
    Component, OnInit, OnDestroy,
    OnChanges, Input, Optional, SimpleChanges
} from '@angular/core';
import { LayerComponent } from './layer.component';
import { Tile } from 'ol/layer';
import { MapComponent } from '../map.component'; 
import { LayerGroupComponent } from './layergroup.component';

@Component({
    selector: 'aol-layer-tile',
    template: `<ng-content></ng-content>`
})
export class LayerTileComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
    public source: Tile;

    @Input() preload: number;
    @Input() useInterimTilesOnError: boolean;

    constructor(map: MapComponent,
        @Optional() group?: LayerGroupComponent) {
        super(group || map);
    }

    ngOnInit() {
        // console.log('creating ol.layer.Tile instance with:', this);
        this.instance = new Tile(this);
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }
}
