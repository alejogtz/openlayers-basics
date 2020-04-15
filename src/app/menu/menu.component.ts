import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../ol/components/map/map.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('mymap') myMap: MapComponent;

  constructor() { }

  ngOnInit(): void {
  }

  handleVisibleBaseLayer(index: number): void{
    this.myMap.getMapService().setVisibleBaseLayer(index);
  }

  handleCheckedOverlayLayers($event) {
    // if ($event.target.checked === true){
      let _value: string = $event.target.value;
      let index: number = _value === 'Vialidad' ? 0 : _value === 'Manzanas' ? 1 : 2;
      this.myMap.getMapService().toggleVisibleSUACLayer(index);
    // }
  }


  /**
   * 
   * @param cta_orig Corresponde al identificador del predio
   */
  handleClickEvent(cta_orig: string){
    this.myMap.getMapService().searchAndZoomToProperty(cta_orig);
  }

  handleClickMeasureButton(type: string): void {
    this.myMap.getMapService().addInteraction(type);
    console.log('In progress:', type);
  }

}
