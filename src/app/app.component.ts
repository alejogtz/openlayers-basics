import { Component } from '@angular/core';
import { PdfMakeWrapper, Img } from 'pdfmake-wrapper';
import { add } from 'ol/coordinate';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'v3angular-ol';
  
  generarPDF(){
    console.log("Si entra al metodo");

    // tomar captura de pantalla actual 
    main();
  }
}

async function main() {
    const pdf = new PdfMakeWrapper();
    pdf.add('Texto para agregar al pdf');
    pdf.add('Mas texto para agregar');
    
    
    
    pdf.images({
      picture1: await new 
      Img('../../images/captura1.png').end
    });

    pdf.create().open();
}
