import {
    Component, EventEmitter, Input, OnChanges, OnInit, Optional,
    SimpleChanges
  } from '@angular/core';
  import {Extent} from 'ol/extent';
  import layer from 'ol/layer/Layer';
  import ImageLayer from 'ol/layer/Image';
  import source from 'ol/source/Source';

  import { MapComponent } from '../map.component';
  import { LayerComponent } from './layer.component';
  import { LayerGroupComponent } from './layergroup.component';
  
  @Component({
    selector: 'aol-layer-image',
    template: `<ng-content></ng-content>`
  })
  export class LayerImageComponent extends LayerComponent implements OnInit, OnChanges {
    public source: ImageLayer;
  
    @Input() opacity?: number;
    @Input() visible?: boolean;
    @Input() extent?: Extent;
    @Input() minResolution?: number;
    @Input() maxResolution?: number;
    @Input() zIndex?: number;
  
    constructor(map: MapComponent,
                @Optional() group?: LayerGroupComponent) {
      super(group || map);
    }
  
    ngOnInit() {
        //AQUI IBA UN THIS
      this.instance = new ImageLayer({});
      super.ngOnInit();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      super.ngOnChanges(changes);
    }
  }