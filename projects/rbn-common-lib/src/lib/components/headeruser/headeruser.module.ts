import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PasswordModule } from 'primeng/password';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { NotificationsModule } from '../notifications/notifications.module';
import { HeaderuserComponent } from './headeruser/headeruser.component';



@NgModule({
  declarations: [
    HeaderuserComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    DialogModule,
    SelectButtonModule,
    NotificationsModule,
    FormsModule,
    ButtonModule,
    PasswordModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    HeaderuserComponent
  ]
})
export class HeaderuserModule { }
