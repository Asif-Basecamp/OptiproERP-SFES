import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MenuModule } from '@progress/kendo-angular-menu';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    TrnaslateLazyModule,
    MenuModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ]
})
export class CustomLayoutModule { }
