import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule, Calendar } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';

import { TimePickerComponent } from './timepicker/timepicker.component';
import { HttpLoaderFactory } from '../shared/http-loader';
import { SingleTimePickerComponent } from './single-time-picker/single-time-picker.component';
import { RbnFocusPanelModule } from '../directives/focus-panel/focus-panel.module';
import { RbnFocusDialogModule } from '../directives/rbn-focus-dialog/rbn-focus-dialog.module';
import { FutureSingleDatePickerComponent } from './future-single-date-picker/future-single-date-picker.component';
import { FutureDatePickerComponent } from './future-date-picker/future-date-picker.component';

@NgModule({
  imports: [
    RbnFocusDialogModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    FormsModule,
    PanelModule,
    RbnFocusPanelModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    TimePickerComponent,
    SingleTimePickerComponent,
    FutureSingleDatePickerComponent,
    FutureDatePickerComponent
  ],
  exports: [
    TimePickerComponent,
    SingleTimePickerComponent,
    FutureDatePickerComponent,
    FutureSingleDatePickerComponent
  ],
  providers: [
    MessageService,
    DatePipe,
    Calendar
  ]
})
export class RbnTimePickerModule {
  constructor(public translate: TranslateService) {
    // set defaut language to english
    let defaultLang = 'en';
    if (localStorage.getItem('lang')) {
      defaultLang = localStorage.getItem('lang');
    }
    if (translate) {
      translate.addLangs([defaultLang]);
      translate.setDefaultLang(defaultLang);
    }
  }
}
