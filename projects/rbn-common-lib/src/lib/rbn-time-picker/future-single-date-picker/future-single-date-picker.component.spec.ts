import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FutureSingleDatePickerComponent } from './future-single-date-picker.component';

import { RbnTimePickerModule } from '../rbn-time-picker-lib.module';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';

describe('FutureSingleDatePickerComponent', () => {
  let component: FutureSingleDatePickerComponent;
  let fixture: ComponentFixture<FutureSingleDatePickerComponent>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnTimePickerModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatePipe,
        RbnFocusCalendarDirective
      ],
      declarations: [ FutureSingleDatePickerComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FutureSingleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
