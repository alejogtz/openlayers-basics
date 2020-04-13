import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map') containerMap: ElementRef;


  constructor(private mapFacade: MapService) { }

  ngAfterViewInit(): void {

    this.mapFacade.setMapTarjet( this.containerMap.nativeElement );

    this.mapFacade.buildMap();

    this.mapFacade.setVisibleBaseLayer(1);
  }


}