import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './ol/components/map/map.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MapService } from './ol/components/map/map.service';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';

import { PdfMakeWrapper } from 'pdfmake-wrapper';

import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
 
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsComponent } from './google-maps/google-maps.component';


// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,MenuComponent, GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChg0ncJgZdqvTgkWiLTpaoT4WDx6w2b_Q',
      libraries: ['places']
    })
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
