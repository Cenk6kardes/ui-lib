import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

import { FutureDatePickerComponent } from './future-date-picker.component';

import { RbnTimePickerModule } from '../rbn-time-picker-lib.module';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';

describe('FutureDatePickerComponent', () => {
  let component: FutureDatePickerComponent;
  let fixture: ComponentFixture<FutureDatePickerComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
    translateSevice = undefined;
  });

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnTimePickerModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatePipe,
        RbnFocusCalendarDirective
      ],
      declarations: [ FutureDatePickerComponent ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (translateSevice) {
      translateSevice.addLangs(['en']);
      translateSevice.setDefaultLang('en');
      if (http) {
        http.expectOne('./assets/i18n/en.json').flush({
          CALENDAR: {}
        });
        http.expectOne('./assets/i18n/rbn_en.json').flush({
          CALENDAR: {}
        });
      }
    }
    fixture = TestBed.createComponent(FutureDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
