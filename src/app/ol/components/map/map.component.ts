import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MapService } from './map.service';
import Map from 'ol/Map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') containerMap: ElementRef;

  DEFAULT_BASE_LAYER = 1;

  constructor(private mapFacade: MapService) { }

  ngAfterViewInit(): void {

    this.mapFacade.setMapTarjet( this.containerMap.nativeElement );

    this.mapFacade.buildMap();

    this.mapFacade.setVisibleBaseLayer(this.DEFAULT_BASE_LAYER);
  }

  // Refactor
  public getMapService(): MapService {
    return this.mapFacade;
  }


}