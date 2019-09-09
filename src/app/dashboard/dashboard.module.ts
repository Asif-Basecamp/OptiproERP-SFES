import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { DateFormatPipe } from '../common/date-format.pipe';
import { SharedModule } from '../shared/shared.module';
import { AttachmentsComponent } from './attachments/attachments.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DetailsComponent } from './details/details.component';
import { ResourcesComponent } from './resources/resources.component';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { DashboardComponent } from './dashboard.component';
import { PrintingLabelModule } from '../printing-label/printing-label.module';

@NgModule({
  imports: [
    
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    LayoutModule,
    FlexLayoutModule,
    DialogsModule,
    TrnaslateLazyModule,
    FormsModule,
    GridModule,
    PrintingLabelModule,
    DropDownsModule
  ],
  declarations: [DashboardComponent, DetailsComponent, TimeEntryComponent,
    ResourcesComponent, AttachmentsComponent, DateFormatPipe],
  providers: [DateFormatPipe],
  exports: []
})
export class DashboardModule { }
