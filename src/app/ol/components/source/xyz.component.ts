import {
    Component, forwardRef, AfterContentInit, OnChanges, Input,
    ContentChild, Optional, Host, SimpleChanges
} from '@angular/core';
import { SourceComponent } from './source.component';
import { Size } from 'ol/size';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import XYZ from 'ol/source/XYZ';
import { TileGridComponent } from '../tilegrid.component';
import { LayerTileComponent } from '../layer/layertile.component';

@Component({
    selector: 'aol-source-xyz',
    template: `<ng-content></ng-content>`,
    providers: [
        { provide: SourceComponent, useExisting: forwardRef(() => SourceXYZComponent) }
    ]
})
export class SourceXYZComponent extends SourceComponent
    implements AfterContentInit, OnChanges {
    instance: XYZ;
    @Input() cacheSize: number;
    @Input() crossOrigin: string;
    @Input() opaque: boolean;
    @Input() projection: string;
    @Input() reprojectionErrorThreshold: number;
    @Input() minZoom: number;
    @Input() maxZoom: number;
    @Input() tileGrid: TileGrid;
    @Input() tileLoadFunction?: LoadFunction;
    @Input() tilePixelRatio: number;
    @Input() tileSize: number | Size;
    @Input() tileUrlFunction: UrlFunction;
    @Input() url: string;
    @Input() urls: string[];
    @Input() wrapX: boolean;

    @ContentChild(TileGridComponent) tileGridXYZ: TileGridComponent;

    // constructor(@Optional() @Host() layer: LayerTileComponent, @Optional() @Host() raster?: SourceRasterComponent) {
    constructor(@Optional() @Host() layer: LayerTileComponent) {
        super(layer);
    }

    ngAfterContentInit() {
        if (this.tileGridXYZ) {
            this.tileGrid = this.tileGridXYZ.instance;
        }
        this.instance = new XYZ(this);
        this._register(this.instance);
    }

    ngOnChanges(changes: SimpleChanges) {
        let properties: { [index: string]: any } = {};

        if (!this.instance) {
            return;
        }
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                properties[key] = changes[key].currentValue;
            }
        }

        this.instance.setProperties(properties, false);
        if (changes.hasOwnProperty('url')) {
            this.instance = new XYZ(this);
            this._register(this.instance);
        }
    }
}