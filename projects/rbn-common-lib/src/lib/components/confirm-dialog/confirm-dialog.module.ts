import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RbnFocusDialogModule } from '../../directives/rbn-focus-dialog/rbn-focus-dialog.module';



@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    RbnFocusDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
