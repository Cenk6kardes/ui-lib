import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { ButtonModule } from 'primeng/button';
import { PanelMessagesComponent } from './panel-messages/panel-messages.component';



@NgModule({
  declarations: [
    PanelMessagesComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    PanelMessagesComponent
  ]
})
export class PanelMessagesModule { }
