import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { transform } from 'ol/proj';
import { View, Map, Feature, Overlay, MapBrowserEvent } from 'ol';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') divMap: ElementRef;
  map: Map;

  source: VectorSource;
  vector: VectorLayer;


  constructor() { }

  ngAfterViewInit(): void {
    const divHtml: HTMLElement = this.divMap.nativeElement;

    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');

    // View
    const view = new View({
      center,
      zoom: 10,
      minZoom: 0,
    });

    // Vector
    this.source = new VectorSource({
      url: '../../assets/xxx.json',
      format: new GeoJSON(),
      useSpatialIndex: false,
    });

    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(133, 200, 148, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
      })
    });

    //Tile Layers
    const simpleOsm: Layer = new TileLayer({ source: new OSM() });

    this.map = new Map({
      layers: [simpleOsm, this.vector],
      target: divHtml,
      view
    });

  }


}