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

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    FlexLayoutModule
  ],
  declarations: [DashboardComponent, DetailsComponent, TimeEntryComponent, ResourcesComponent, AttachmentsComponent]
})
export class DashboardModule { }
