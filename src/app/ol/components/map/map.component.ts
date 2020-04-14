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

  constructor(private mapFacade: MapService) { }

  ngAfterViewInit(): void {

    this.mapFacade.setMapTarjet( this.containerMap.nativeElement );

    this.mapFacade.buildMap();

    this.mapFacade.setVisibleBaseLayer(1);

    this.mapFacade.searchAndZoomToProperty('1005006006');
  }


}