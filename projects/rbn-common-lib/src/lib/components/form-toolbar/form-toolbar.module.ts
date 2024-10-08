import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { FormToolbarComponent } from './form-toolbar/form-toolbar.component';

@NgModule({
  declarations: [FormToolbarComponent],
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [ FormToolbarComponent ]
})
export class FormToolbarModule { }
