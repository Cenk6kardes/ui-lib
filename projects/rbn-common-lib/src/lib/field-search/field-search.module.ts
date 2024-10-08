import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { HttpLoaderFactory } from '../shared/http-loader';
import { SearchCriteriaModule } from './search-criteria.module';
import { FieldSearchComponent } from './field-search.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    SearchCriteriaModule,
    TooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  declarations: [FieldSearchComponent],
  exports: [FieldSearchComponent]
})
export class FieldSearchModule {
  constructor(public translate: TranslateService) { }
}
