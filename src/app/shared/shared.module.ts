import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayPdfComponent } from '../printing-label/display-pdf/display-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [DisplayPdfComponent],
  imports: [
    CommonModule,
    PdfViewerModule
  ],
  entryComponents: [DisplayPdfComponent],
  exports: [DisplayPdfComponent]
})
export class SharedModule { }
