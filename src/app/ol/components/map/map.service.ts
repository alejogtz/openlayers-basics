import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import BaseLayer from 'ol/layer/Base';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import GeoJSON from 'ol/format/GeoJSON';

import { HttpClient } from '@angular/common/http';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Extent } from 'ol/extent';

@Injectable()
export class MapService {

    private instance: Map;
    private view: View;

    private tileBaseLayers: LayerGroup;
    private tileLayersFromSuac: LayerGroup;

    // Searching Properties
    private propertyVectorLayer: VectorLayer;
    private propertyVectorSource: VectorSource;

    // Measure interaction
    private measureSource: VectorSource;
    private measureLayer: VectorLayer;


    // Constants
    MAX_ZOOM_FIT_VIEW = 18;




    constructor(private http: HttpClient) {
        this.instance = new Map({});
    }

    buildMap(): void {
        // View
        const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');

        this.view = new View({ center, zoom: 10, maxZoom: 20, minZoom: 8 });
        this.instance.setView(this.view);

        this.loadTileLayers();

        this.instance.addLayer(this.tileBaseLayers);
        this.instance.addLayer(this.tileLayersFromSuac);

        this.loadVectorLayers()
        this.instance.addLayer(this.propertyVectorLayer);
        //this.instance.addLayer(this.measureLayer);


    }


    private loadTileLayers(): void {
        // Tile Layers
        let osm_source = new OSM();
        let osm: Layer = new TileLayer({ source: osm_source });

        let osm_humanitarian_source = new OSM({ url: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' });
        let osm_humanitarian: Layer = new TileLayer({ source: osm_humanitarian_source, });

        let stamen_source = new XYZ({ url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg' });
        let stamen: Layer = new TileLayer({ source: stamen_source });

        this.tileBaseLayers = new LayerGroup({ layers: [osm, osm_humanitarian, stamen] });

        osm.setVisible(true);
        osm_humanitarian.setVisible(false);
        stamen.setVisible(false);

        // Tile Layers from SUAC
        let localities_source = new TileWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms',
            params: {
                LAYERS: 'GDB08:localidades', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        let blocks_source = new TileWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms',
            params: {
                LAYERS: 'GDB08:manzanas', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });


        let properties_source = new TileWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08011/wms',
            params: {
                LAYERS: 'GDB08011:p', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        let localities_layer = new TileLayer({ source: localities_source });
        let blocks_layer = new TileLayer({ source: blocks_source });
        let properties_layer = new TileLayer({ source: properties_source });

        this.tileLayersFromSuac = new LayerGroup({ layers: [localities_layer, blocks_layer, properties_layer] });



    }


    loadMeasureInteraction() {
        this.measureSource = new VectorSource();
    }

    private loadVectorLayers(): void {
        // Styling
        let fill: Fill = new Fill({ color: 'rgb(66, 255, 161)' });
        let stroke: Stroke = new Stroke({ color: '#ffcc33', width: 2 });

        // Vector
        this.propertyVectorSource = new VectorSource({ useSpatialIndex: false, format: new GeoJSON() });

        this.propertyVectorLayer = new VectorLayer({
            source: this.propertyVectorSource,
            style: new Style({ fill, stroke, })
        });

    }


    private loadInteraction(): void {
        this.measureSource = new VectorSource();

    }


    searchAndZoomToProperty(cta_orig_property: string): void {
        let url = 'http://187.189.192.102:8080/geoserver/GDB08011/ows?' +
            'service=WFS&' +
            'version=1.1.0&' +
            'request=GetFeature&' +
            'typename=GDB08011:p&' +
            'maxFeatures=1&' +
            "&CQL_FILTER=cve_cat_ori='" + cta_orig_property + "'&" + // ej. cta_orig_property: 1005006006
            'outputFormat=application/json&' +
            'srsname=EPSG:3857';

        this.propertyVectorSource.clear(true);


        this.http.get(url).subscribe(response => {
            // Handle Response
            new GeoJSON().readFeatures(response).forEach(
                (feature: Feature<Geometry>, index: number, features: Feature<Geometry>[]) => {
                    this.propertyVectorSource.addFeature(feature);

                    console.log(response);
                });

            // Zoom to property
            if (this.propertyVectorSource.getFeatures().length > 0) {
                console.log('Zoom');
                const extent: Extent = this.propertyVectorSource.
                    getFeaturesCollection().getArray()[0].getGeometry().getExtent();

                this.view.fit(extent, { maxZoom: this.MAX_ZOOM_FIT_VIEW });



            } else {
                alert('No se encontré algún Predio con ese Numero');
            }
        });


    }


    setMapTarjet(tarjet: HTMLElement) {
        if (tarjet instanceof HTMLDivElement) {
            this.instance.setTarget(tarjet);
        }
    }

    setVisibleBaseLayer(position: number): void {
        this.tileBaseLayers.getLayers().forEach(
            // tslint:disable-next-line: no-shadowed-variable
            (layer: BaseLayer, pos: number, p2: BaseLayer[]) => {
                layer.setVisible(position === pos);
            }
        );
    }

    toggleVisibleSUACLayer(position: number): void {
        let isVisible = this.tileLayersFromSuac.getLayers().getArray()[position].getVisible();

        this.tileLayersFromSuac.getLayers().getArray()[position].setVisible(!isVisible);
    }


}