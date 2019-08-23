import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from './details/details.component';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { ResourcesComponent } from './resources/resources.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    FlexLayoutModule,
    DialogsModule,
    TrnaslateLazyModule,
    FormsModule,
    GridModule
  ],
  declarations: [DashboardComponent, DetailsComponent, TimeEntryComponent, ResourcesComponent, AttachmentsComponent]
})
export class DashboardModule { }
