import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Extent } from 'ol/extent'; import { Size } from 'ol/size';
import { Coordinate } from 'ol/coordinate';
import {createXYZ} from 'ol/tilegrid';


@Component({
    selector: 'aol-tilegrid',
    template: ''
})
export class TileGridComponent implements OnInit, OnChanges {
    instance: TileGrid;

    @Input() extent: Extent;
    @Input() maxZoom: number;
    @Input() minZoom: number;
    @Input() tileSize: number | Size;
    @Input() origin?: Coordinate;
    @Input() resolutions: number[];

    ngOnInit() {
        if (!this.resolutions) {
            this.instance = createXYZ(this);
        } else {
            this.instance = new TileGrid(this);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.resolutions) {
            this.instance = createXYZ(this);
        } else {
            this.instance = new TileGrid(this);
        }
    }
}
