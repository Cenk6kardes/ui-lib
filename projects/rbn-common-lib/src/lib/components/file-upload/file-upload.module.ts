import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from '../message/message.module';
import { DragDropModule } from 'primeng/dragdrop';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';

@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    MessageModule,
    DragDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ButtonModule,
    ToastModule,
    ProgressBarModule,
    ConfirmDialogModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
