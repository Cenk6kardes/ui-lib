import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderalertComponent } from './headeralert/headeralert.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
    HeaderalertComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    HeaderalertComponent
  ]
})
export class HeaderalertModule { }
