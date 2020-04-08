import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View, { FitOptions } from 'ol/View';

// Layers
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorImage from 'ol/layer/VectorImage';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';


// Sources
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import ImageWMS from 'ol/source/ImageWMS';


// Projections
import { transform, transformExtent } from 'ol/proj';

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
import { Extent, createEmpty, extend } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Size } from 'ol/size';

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
      minZoom: 0,
      projection: '32614'
    });
    // -------------------------------- Sources ------------------------------------------------------------------

    const sourceImageWMS: ImageWMS =  new ImageWMS ({
      url: 'http://187.189.192.102:8080/geoserver/wms',
      params: {
        LAYERS: 'topp:states',
        VERSION: '1.3.0',
        FORMAT: 'image/png',
        TILED: 'true',
        COLOR: '#ffffff'
      }
    });

    const sourceTileWMS =  new TileWMS({
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
     });

     // ---- bases layers -----
    const sourceStamen = new Stamen({ layer: 'toner'  });

    // -----vector sources ----
    const sourceVector =  new VectorSource({
      url: 'http://187.189.192.102:8080/geoserver/GDB08011/ows?' +
      'service=WFS&' +
      'version=1.1.0&' +
      'request=GetFeature&' +
      'typename=GDB08011:p&' +
      'maxFeatures=1&' +
      "&CQL_FILTER=cve_cat_ori='1005006006'&" +
      'outputFormat=application/json',
      format: new GeoJSON({featureProjection: 'EPSG:32613' }),
      useSpatialIndex: false,
    });



    // -------------------------------- Layers -----------------------------------------------------------------
    const simpleWMS = new ImageLayer({opacity: 0.6, source: sourceImageWMS });
    simpleWMS.set('name', 'USA layer from Geoserver WMS demo');


    const layerVms = new TileLayer({ source: sourceTileWMS });

    const simpleOsm: Layer = new TileLayer({ source:
      new OSM({ url: 'http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png' }), });

    const stamenLayer: Layer = new TileLayer({source: sourceStamen, });

    // -------------------- Vector ---------------------------------------------------------------------------------

    const _style = new Style({
      fill: new Fill({
        color: '#00FFF3',
      }),
      stroke: new Stroke({
        color: '#00FFF3',
        width: 3
      }),
    });

    const vectorLayer = new VectorLayer({
      source: sourceVector,
      style: _style,
    
    });

    // ------------------- End Vector ------------------------------------------------------------------------------


    const basesLayers: LayerGroup = new LayerGroup({
      layers: [simpleOsm, layerVms, vectorLayer]
    });


    // maps
    simpleOsm.setVisible(true); //
    stamenLayer.setVisible(false);

    simpleWMS.setVisible(true); // countries top::usa

    layerVms.setVisible(true);
    vectorLayer.setVisible(true);

    this.map = new Map({
      layers: basesLayers,
      target: divHtml,
      view
    });


    const mapSize: Size = this.map.getSize();

    // tslint:disable-next-line: only-arrow-functions
    this.map.on('click' , function( event: MapBrowserEvent) {
      // console.log(vectorLayer.getSource().getFeaturesCollection().getArray()[0].getGeometry().getExtent() );

      const extent: Extent = vectorLayer.getSource().getFeaturesCollection().getArray()[0].getGeometry().getExtent();

      // Try to zoom to multiple extent

      const extentMultiple: Extent = createEmpty();


      sourceVector.getFeaturesCollection().forEach(
        (feature: Feature<Geometry>) =>  extend(extentMultiple, feature.getGeometry().getExtent()));


      // const extentOfAllFeatures = vectorLayer.getSource().getExtent();

      // console.log(this.map.getProperties());

      // console.log( view.getProjection() );

      console.log(vectorLayer);

      transformExtent(extentMultiple, 'EPSG:4326', 'EPSG:3857');

      // console.log( sourceVector.getFeaturesCollection().getArray()[0].getProperties() );

      view.fit( extentMultiple ,{ maxZoom: 21 , size: mapSize} );

    });

  }

}
