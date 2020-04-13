import { Component, OnInit, Input, Optional, SimpleChanges, OnChanges } from '@angular/core';
import { StyleFunction } from 'ol/style/Style';
import { MapComponent } from '../map.component';
import * as layer from 'ol/layer';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import VectorTileRenderType from 'ol/layer/VectorTileRenderType';
import Feature from 'ol/Feature'
import style from 'ol/style/Style'

@Component({
  selector: 'aol-layer-vectortile',
  template: `<ng-content></ng-content>`
})
export class LayerVectorTileComponent extends LayerComponent implements OnInit, OnChanges {

  @Input() renderBuffer?: number;
  @Input() renderMode?: VectorTileRenderType|string;
  /* not marked as optional in the typings */
  @Input() renderOrder?: (feature1: Feature, feature2: Feature) => number;
  @Input() style?: (style | style[] | StyleFunction );
  @Input() updateWhileAnimating?: boolean;
  @Input() updateWhileInteracting?: boolean;
  @Input() visible?: boolean;

  constructor(map: MapComponent,
              @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.VectorTile instance with:', this);
    this.instance = new layer.VectorTile(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}