import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchGlobalComponent } from './search-global/search-global.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpLoaderFactory } from '../../shared/http-loader';

import {OverlayPanelModule} from 'primeng/overlaypanel';
import { RbnFocusOverlayPanelModule } from '../../directives/rbn-focus-overlaypanel/rbn-focus-overlaypanel.module';


@NgModule({
  declarations: [
    SearchGlobalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    RbnFocusOverlayPanelModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SearchGlobalComponent
  ]
})
export class SearchGlobalModule { }
