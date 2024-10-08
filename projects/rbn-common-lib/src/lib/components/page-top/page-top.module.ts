import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ProfileModule } from '../profile/profile.module';
import { HeaderlogoModule } from '../headerlogo/headerlogo.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { PageTopComponent } from './page-top/page-top.component';
import { SearchGlobalModule } from '../search-global/search-global.module';
import { RbnFocusPTooltipModule } from '../../directives/rbn-focus-ptooltip/rbn-focus-ptooltip.module';

@NgModule({
  declarations: [
    PageTopComponent
  ],
  imports: [
    CommonModule,
    ProfileModule,
    ButtonModule,
    NotificationsModule,
    HeaderlogoModule,
    SearchGlobalModule,
    TooltipModule,
    RbnFocusPTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    PageTopComponent
  ]
})
export class PageTopModule { }
