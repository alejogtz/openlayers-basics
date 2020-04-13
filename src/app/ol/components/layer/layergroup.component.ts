import { Component, OnDestroy, OnInit, SkipSelf, Inject, Optional } from '@angular/core';
import layer from 'ol/layer/Layer';
import LayerGroup from 'ol/layer/Group';
import { LayerComponent } from './layer.component';
import { MapComponent } from '../map.component';

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