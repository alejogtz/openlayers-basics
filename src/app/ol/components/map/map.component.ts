import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View, { FitOptions } from 'ol/View';

// Layers
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorImage from 'ol/layer/VectorImage';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';


//Sources
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import ImageWMS from 'ol/source/ImageWMS';


// Projections
import { transform } from 'ol/proj';

// Formats
import GeoJSON from 'ol/format/GeoJSON';

// Styles
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

// Others
import { createXYZ } from 'ol/tilegrid';
import { Pixel } from 'ol/pixel';
import VectorLayer from 'ol/layer/Vector';
import Geometry from 'ol/geom/Geometry';
import { MapBrowserEvent, Feature } from 'ol';
import Point from 'ol/geom/Point';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') divMap: ElementRef;

  map: Map;

  constructor() { }

  ngAfterViewInit(): void {
    const divHtml: HTMLElement = this.divMap.nativeElement;

    // EPSG is en lng and lat respectly
    // https://gis.stackexchange.com/questions/162825/what-is-the-type-of-epsg-of-longitude-latitude-not-point-co-ordinates
    // const center = transform([-96.72365, 17.06542], 'EPSG:4326', 'EPSG:3857');
    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');


    // View 
    const view = new View({
      center,
      zoom: 10,
      maxZoom: 20,
      minZoom: 0
    });

    // -------------------------------- Layers -----------------------------------------------------------------


    const simpleWMS = new ImageLayer({
      opacity: 0.6,
      source: new ImageWMS({
        url: 'http://187.189.192.102:8080/geoserver/wms',
        params: {
          LAYERS: 'topp:states',
          VERSION: '1.3.0',
          FORMAT: 'image/png',
          TILED: 'true',
          COLOR: '#ffffff'
        },
      }),
    });
    simpleWMS.set('name', 'USA layer from Geoserver WMS demo');


    const layerVms = new TileLayer({
      source: new TileWMS({
        url: 'http://187.189.192.102:8080/geoserver/GDB08011/wms',
        params: {
          LAYERS: 'GDB08011:p',
          VERSION: '1.1.1',
          FORMAT: 'image/png',
          TILED: 'true',
        },
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0,
        tileGrid: createXYZ({ extent: [-13884991, 2870341, -7455066, 6338219] })
        , projection: 'EPSG:900913'

      })
    });

    let simpleOsm: Layer = new TileLayer({
      source: new OSM({
        url: 'http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png'
      }),
    });

    let stamenLayer: Layer = new TileLayer({
      source: new Stamen({
        layer: 'toner'
      }),
    });

    // -------------------- Vector ---------------------------------------------------------------------------------

    const _style = new Style({
      fill: new Fill({
        color: '#00FFF3',
      })
    });

    const vectorLayer = new VectorLayer({
      source: new Vector({
        url: './assets/file2.json',
        format: new GeoJSON(),
        useSpatialIndex: false
      }),
      style: _style,
    });

    // ------------------- End Vector ------------------------------------------------------------------------------


    const basesLayers: LayerGroup = new LayerGroup({
      layers: [layerVms, simpleOsm, stamenLayer, simpleWMS, vectorLayer]
    });


    simpleOsm.setVisible(true);
    simpleWMS.setVisible(true);

    layerVms.setVisible(false);
    stamenLayer.setVisible(false);
    vectorLayer.setVisible(true);

    this.map = new Map({
      layers: basesLayers,
      target: divHtml,
      view
    });



    view.fit( [ -11733083.841774555, 3181920.6134553165, -11685692.884237746, 3233286.2964629545 ] , {maxZoom: 11})


    console.log(vectorLayer.getSource());

    //console.log( vectorLayer.getSource().getFeatures().length );

    // console.log( vectorLayer.getSource().getFeaturesCollection().getArray() );

  }

}
