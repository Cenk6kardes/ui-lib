import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../shared/http-loader';

import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';

import { DynamicTabsComponent } from './dynamic-tabs/dynamic-tabs.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    DynamicTabsComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    TabMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    DynamicTabsComponent
  ]
})
export class DynamicTabsModule { }
