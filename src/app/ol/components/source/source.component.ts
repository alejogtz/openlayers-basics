import { OnDestroy, Input } from '@angular/core';
import Source, { AttributionLike } from 'ol/source/Source';
import { LayerComponent } from '../layer/layer.component';

export class SourceComponent implements OnDestroy {
    public instance: Source;
    public componentType: string = 'source';

    @Input() attributions: AttributionLike;

    // constructor(protected host: LayerComponent, protected raster?: SourceRasterComponent) {
    constructor(protected host: LayerComponent) {
    }

    ngOnDestroy() {
        if (this.host) {
            this.host.instance.setSource(null);
        }

    }

    protected _register(source: Source) {
        if (this.host) {
            this.host.instance.setSource(source);
        }
    }
}
