import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') containerMap: ElementRef;


  constructor() { }

  ngAfterViewInit(): void {

    let mapFacade: MapService = new MapService();

    mapFacade.setMapTarjet( this.containerMap.nativeElement );

    mapFacade.buildMap();

    mapFacade.setVisibleBaseLayer(1);
  }


}