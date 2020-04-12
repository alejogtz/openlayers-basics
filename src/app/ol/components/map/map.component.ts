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
import Icon from 'ol/style/Icon';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import OverlayPositioning from 'ol/OverlayPositioning';
import { ListenerFunction, EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import BaseEvent from 'ol/events/Event';
import GeometryType from 'ol/geom/GeometryType';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') divMap: ElementRef;
  @ViewChild('image') imageContainer: ElementRef;
  @ViewChild('type') selectElement: ElementRef;
  map: Map;

  // tslint:disable-next-line: member-ordering
  sketch: Feature;
  helpTooltipElement: HTMLElement;
  helpTooltip: Overlay;
  measureTooltipElement: HTMLElement;
  measureTooltip: Overlay;
  continuePolygonMsg: string;
  continueLineMsg: string;


  typeSelect: HTMLSelectElement;
  imgHtml: HTMLImageElement;
  draw: Draw;



  source: VectorSource;
  vector: VectorLayer;


  constructor() { }

  ngAfterViewInit(): void {
    const divHtml: HTMLElement = this.divMap.nativeElement;
    this.imgHtml = this.imageContainer.nativeElement;
    this.typeSelect = this.selectElement.nativeElement;

    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');
    // View
    const view = new View({
      center,
      zoom: 10,
      minZoom: 0,
    });

    const simpleOsm: Layer = new TileLayer({ source: new OSM() });

    this.map = new Map({
      layers: [simpleOsm,],
      target: divHtml,
      view
    });


    // Load first interaction
    this.loadInteraction();



  }


  // tslint:disable-next-line: align
  loadInteraction(): void {
    this.continuePolygonMsg = 'Click to continue drawing the polygon';
    this.continueLineMsg = 'Click to continue drawing the line';

    this.source = new VectorSource();

    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
      })
    });

    this.createMeasureTooltip();
    this.createHelpTooltip();


    this.addEventOnToMap();


    this.map.getViewport().addEventListener('mouseout', () => {
      this.helpTooltipElement.classList.add('hidden');
    });

    this.typeSelect.onchange = () => {
      this.map.removeInteraction(this.draw);
      this.addInteraction();
    };

    this.addInteraction();

  }


  addInteraction(): void {
    const type: GeometryType = (this.typeSelect.value === 'area' ? GeometryType.POLYGON : GeometryType.LINE_STRING);

    this.draw = new Draw({
      source: this.source,
      type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
      })
    });
    this.map.addInteraction(this.draw);


    let listener: EventsKey;
    this.draw.on('drawstart',
      (evt: DrawEvent) => {
        // set sketch
        this.sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        // let tooltipCoord = evt.target();

        // console.log (evt.target.);

        listener = this.sketch.getGeometry().on('change', (evt: BaseEvent) => {
          let geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = this.formatArea(geom);

            console.log(output);

            // tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = this.formatLength(geom);

            console.log(output);

            // tooltipCoord = geom.getLastCoordinate();
          }
          // this.measureTooltipElement.innerHTML = output;
          //this.measureTooltip.setPosition(tooltipCoord);
        });
      });

    this.draw.on('drawend',
      () => {
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        this.measureTooltip.setOffset([0, -7]);
        // unset sketch
        this.sketch = null;
        // unset tooltip so that a new one can be created
        this.measureTooltipElement = null;
        this.createMeasureTooltip();
        unByKey(listener);
      });

  }



  addEventOnToMap(): void {

    this.map.on('pointermove',
      (evt: MapBrowserEvent) => {

        if (evt.dragging) {
          return;
        }
        let helpMsg = 'Click to start drawing';

        if (this.sketch) {
          const geom: Geometry = this.sketch.getGeometry();
          if (geom instanceof Polygon) {
            helpMsg = this.continuePolygonMsg;
          } else if (geom instanceof LineString) {
            helpMsg = this.continueLineMsg;
          }
        }


        // console.log(helpMsg);
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);
        this.helpTooltipElement.classList.remove('hidden');

      }
    );

  }

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  formatLength(line: LineString): string {
    let length: number = line.getLength();
    let output: string;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  }


  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  formatArea(polygon: Polygon): string {
    let area: number = polygon.getArea();
    let output: string;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  }

  /**
   * Creates a new help tooltip
   */
  createHelpTooltip(): void {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }

    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'ol-tooltip hidden';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: OverlayPositioning.CENTER_LEFT
    });
    this.map.addOverlay(this.helpTooltip);
  }


  /**
   * Creates a new measure tooltip
   */
  createMeasureTooltip(): void {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: OverlayPositioning.BOTTOM_CENTER
    });
    this.map.addOverlay(this.measureTooltip);
  }


}