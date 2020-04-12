import {
  Component, forwardRef,
  AfterContentInit, Input, Host, Optional
} from '@angular/core';
import { SourceComponent } from './source.component';
import { SourceXYZComponent } from './xyz.component';
import { AttributionLike } from 'ol/source/Source';
import { LayerTileComponent } from '../layer/layertile.component';
import { LoadFunction } from 'ol/Tile';
import OSM from 'ol/source/OSM';



@Component({
  selector: 'aol-source-osm',
  template: `<div class="aol-source-osm"></div>`,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceOsmComponent) }
  ]
})
export class SourceOsmComponent extends SourceXYZComponent implements AfterContentInit {
  instance: OSM;

  @Input() attributions: AttributionLike;
  @Input() cacheSize: number;
  @Input() crossOrigin: string;
  @Input() maxZoom: number;
  @Input() opaque: boolean;
  @Input() reprojectionErrorThreshold: number;
  @Input() tileLoadFunction: LoadFunction;
  @Input() url: string;
  @Input() wrapX: boolean;

  // constructor(@Host() @Optional() layer: LayerTileComponent, @Host() @Optional() raster?: SourceRasterComponent) {
  constructor(@Host() @Optional() layer: LayerTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    if (this.tileGridXYZ) {
      this.tileGrid = this.tileGridXYZ.instance;
    }
    this.instance = new OSM(this);
    this._register(this.instance);
  }
}
