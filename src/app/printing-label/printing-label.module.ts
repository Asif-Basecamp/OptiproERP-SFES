import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { DisplayPdfComponent } from './display-pdf/display-pdf.component';
import { PrintingLabelRoutingModule } from './printing-label-routing.module';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PdfpipePipe } from '../common/pdfpipe.pipe';

@NgModule({
  declarations: [PdfpipePipe, DisplayPdfComponent],
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    DialogsModule,
    PrintingLabelRoutingModule,
    TrnaslateLazyModule,
    FormsModule,
    DropDownsModule,
    PerfectScrollbarModule,
    PdfViewerModule
  ],
  providers: [PdfpipePipe],
  entryComponents: [ DisplayPdfComponent],
  exports: [PdfpipePipe, DisplayPdfComponent]
})
export class PrintingLabelModule { }
 