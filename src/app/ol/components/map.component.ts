import {
    Component, OnInit, ElementRef, Input, Output, EventEmitter, AfterViewInit,
    SimpleChanges, OnChanges
  } from '@angular/core';
  import {
     MapBrowserEvent, MapEvent
  } from 'ol';

  import Map from 'ol/Map';
  import Event from 'ol/render/Event'
//import ObjectEvent from 'ol/Object';
  import control from 'ol/control/Control';
  import interaction from 'ol/interaction/Interaction';
  import BaseEvent from 'ol/events/Event';

  @Component({
    selector: 'aol-map',
    template: `<div [style.width]="width" [style.height]="height"></div><ng-content></ng-content>`
  })

export class MapComponent implements OnInit, AfterViewInit, OnChanges{

    public instance: Map;
  public componentType: string = 'map';

  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() loadTilesWhileAnimating: boolean;
  @Input() loadTilesWhileInteracting: boolean;
  @Input() logo: string|boolean;
  @Input() renderer: 'canvas'|'webgl';
  //@Input() control?: Collection<Control> | Control[];
  @Input() pixelRatio?: number;
  //@Input()  interaction?: Collection<Interaction> | Interaction[];
  @Input()  keyboardEventTarget?: HTMLElement | Document | string;
  //@Input()  layers?: BaseLayer[] | Collection<BaseLayer> | LayerGroup;
  @Input()  maxTilesLoading?: number;
  @Input()  moveTolerance?: number;
  //@Input()  overlays?: Collection<Overlay> | Overlay[];
  @Input()  target?: HTMLElement | string;
  //@Input()  view?: View;


  @Output() onClick: EventEmitter<MapBrowserEvent>;
  @Output() onDblClick: EventEmitter<MapBrowserEvent>;
  @Output() onMoveEnd: EventEmitter<MapEvent>;
  @Output() onPointerDrag: EventEmitter<MapBrowserEvent>;
  @Output() onPointerMove: EventEmitter<MapBrowserEvent>;
  @Output() onPostCompose: EventEmitter<Event>;
  @Output() onPostRender: EventEmitter<MapEvent>;
  @Output() onPreCompose: EventEmitter<Event>;
  @Output() onPropertyChange: EventEmitter<BaseEvent>;
  @Output() onSingleClick: EventEmitter<MapBrowserEvent>;

  // we pass empty arrays to not get default controls/interactions because we have our own directives
  controls: control[] = [];
  interactions: interaction[] = [];

  constructor(private host: ElementRef) {
    this.onClick = new EventEmitter<MapBrowserEvent>();
    this.onDblClick = new EventEmitter<MapBrowserEvent>();
    this.onMoveEnd = new EventEmitter<MapEvent>();
    this.onPointerDrag = new EventEmitter<MapBrowserEvent>();
    this.onPointerMove = new EventEmitter<MapBrowserEvent>();
    this.onPostCompose = new EventEmitter<Event>();
    this.onPostRender = new EventEmitter<MapEvent>();
    this.onPreCompose = new EventEmitter<Event>();
    this.onPropertyChange = new EventEmitter<BaseEvent>();
    this.onSingleClick = new EventEmitter<MapBrowserEvent>();
  }

  ngOnInit() {
    // console.log('creating ol.Map instance with:', this);
    this.instance = new Map(this);
    this.instance.setTarget(this.host.nativeElement.firstElementChild);
    this.instance.on('click', (event: MapBrowserEvent) => this.onClick.emit(event));
    this.instance.on('dblclick', (event: MapBrowserEvent) => this.onDblClick.emit(event));
    this.instance.on('moveend', (event: MapEvent) => this.onMoveEnd.emit(event));
    this.instance.on('pointerdrag', (event: MapBrowserEvent) => this.onPointerDrag.emit(event));
    this.instance.on('pointermove', (event: MapBrowserEvent) => this.onPointerMove.emit(event));
    this.instance.on('postcompose', (event: Event) => this.onPostCompose.emit(event));
    this.instance.on('postrender', (event: MapEvent) => this.onPostRender.emit(event));
    this.instance.on('precompose', (event: Event) => this.onPreCompose.emit(event));
    this.instance.on('propertychange', (event: BaseEvent) => this.onPropertyChange.emit(event));
    this.instance.on('singleclick', (event: MapBrowserEvent) => this.onSingleClick.emit(event));
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
    // console.log('changes detected in aol-map, setting new properties: ', properties);
    this.instance.setProperties(properties, false);
  }

  ngAfterViewInit() {
    this.instance.updateSize();
  }

}