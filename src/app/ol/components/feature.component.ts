import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import feature from 'ol/Feature';
import { SourceVectorComponent } from './sources';

@Component({
  selector: 'aol-feature',
  template: `<ng-content></ng-content>`
})
export class FeatureComponent implements OnInit, OnDestroy, OnChanges {
  public componentType = 'feature';
  public instance?: feature;

  @Input() id?: string|number|undefined;

  constructor(private host: SourceVectorComponent) {
  }

  ngOnInit() {
    this.instance = new feature();
    if (this.id !== undefined) {
      this.instance.setId(this.id);
    }
    this.host.instance.addFeature(this.instance);
  }

  ngOnDestroy() {
    this.host.instance.removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance) {
      this.instance.setId(this.id);
    }
  }
}