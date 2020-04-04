import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';

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
      zoom: 3,
      maxZoom: 20,
      minZoom: 0
    });

    // -------------------------------- Layers ----------------------------------

    const simpleWMS = new ImageLayer({
      opacity: 0.6,
      source: new ImageWMS({
        url: 'http://187.189.192.102:8080/geoserver/wms',
        params: {
          LAYERS: 'GDB08:asentamientos',
          VERSION: '1.3.0',
          FORMAT: 'image/png',
          TILED: 'true'
        },
      }),
      visible: true
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
      visible: false
    });

    let stamenLayer: Layer = new TileLayer({
      source: new Stamen({
        layer: 'terrain'
      }),
      visible: true
    });

    // ------------------------- End Layers ------------------------------

    const basesLayers: LayerGroup = new LayerGroup({
      layers: [simpleOsm, stamenLayer, simpleWMS]
    });


    // -------------------- Vector ---------------------------------------

    const _style = new Style({
      fill: new Fill({
        color: '#00FFF3',
      })
    });

    const vectorLayer = new VectorImage({
      source: new Vector({
        url: './assets/file2.json',
        format: new GeoJSON()
      }),
      style: _style,
      visible: true
    });

    // ------------------- End Vector ---------------------


    this.map = new Map({
      layers: basesLayers,
      target: divHtml,
      view
    });

    //this.map.addLayer(layerVms);

    // this.map.addLayer(vectorLayer);
  }

}
