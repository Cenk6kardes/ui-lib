import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { PageHeaderComponent } from './page-header/page-header.component';


@NgModule({
  declarations: [
    PageHeaderComponent
  ],
  imports: [
    TooltipModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    OverlayPanelModule,
    ListboxModule,
    DropdownModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    PageHeaderComponent
  ]
})
export class PageHeaderModule { }
