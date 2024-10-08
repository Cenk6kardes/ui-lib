import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { SkipToMainContentComponent } from './skip-to-main-content/skip-to-main-content.component';

@NgModule({
  declarations: [
    SkipToMainContentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SkipToMainContentComponent
  ]
})
export class SkipToMainContentModule { }
