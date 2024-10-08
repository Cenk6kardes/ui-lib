import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarItemsComponent } from './sidebar/sidebar-items/sidebar-items.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { ToastModule } from 'primeng/toast';
import { RbnFocusPTooltipModule } from '../../directives/rbn-focus-ptooltip/rbn-focus-ptooltip.module';


@NgModule({
  declarations: [
    SidebarItemsComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    DragDropModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    RbnFocusPTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SidebarItemsComponent,
    SidebarComponent
  ]
})
export class SidebarModule { }
