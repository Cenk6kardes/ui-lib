import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, By } from '@angular/platform-browser';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

import moment from 'moment';

import { TimePickerComponent } from './timepicker.component';
import { RbnTimePickerModule } from '../rbn-time-picker-lib.module';
import { Calendar } from 'primeng/calendar';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnTimePickerModule
      ],
      declarations: [TimePickerComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatePipe
      ]
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
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    component.newTimeValues = [moment('2020-10-20').toDate(), moment('2020-10-21').toDate()];
    component.showDialog = false;
    component.quickButtons = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    component.showDialog = false;
    // fixture.detectChanges();
  });

  it('should call ngOnChanges when has input', () => {
    const arr = [moment('2019-01-01').toDate(), moment('2019-10-20').toDate()];
    const change = new SimpleChange(undefined, arr, false);
    const changeTimezoneFm = new SimpleChange(undefined, '10/11/2021 04:55:39 UTC', false);
    component.ngOnChanges({ newTimeValues: change, timezoneFm: changeTimezoneFm });
    const r1 = component.timeToReadableFormat(arr[0]);
    const r2 = component.timeToReadableFormat(arr[1]);
    expect(component.displayTime).toContain('01/01/2019 00:00:00  10/20/2019 00:00:00');
  });

  it('should have cancel button', () => {
    component.showDialog = true;
    fixture.detectChanges();
    spyOn(component, 'resetButtonClick');
    const el = fixture.debugElement.query(By.css('.modal-footer button'));
    el.nativeElement.click();
    fixture.detectChanges();
    expect(component.resetButtonClick).toHaveBeenCalled();

    component.showDialog = false;
    fixture.detectChanges();
  });

  it('should call resetButtonClick', () => {
    spyOn(component, 'setCurrentViewForCalendar');
    spyOn(component, 'onFocusableCellCalendar');
    spyOn(component.dateChanged, 'emit');
    component.startdateValue = moment('2020-01-01').toDate();
    component.enddateValue = moment('2020-01-01').toDate();
    component.resetButtonClick();
    expect(component.durationButtonClicked).toBeFalsy();
    expect(component.startdateValue.getMonth()).toEqual(moment().toDate().getMonth());
    expect(component.enddateValue.getMonth()).toEqual(moment().toDate().getMonth());
    expect(component.dateChanged.emit).toHaveBeenCalled();
  });

  it('should call function cancelButtonClick', () => {
    component.cancelButtonClick();
    expect(component.showDialog).toBeFalsy();
  });

  it('should have apply button', () => {
    component.showDialog = true;
    fixture.detectChanges();
    spyOn(component, 'submitButtonClick');
    const el = fixture.debugElement.queryAll(By.css('.modal-footer button'));

    el[2]?.nativeElement.click();
    fixture.detectChanges();
    expect(component.submitButtonClick).toHaveBeenCalled();

    component.showDialog = false;
    fixture.detectChanges();
  });

  it('should call function submitButtonClick', () => {
    component.submitButtonClick();
    expect(component.showDialog).toBeFalsy();
  });

  it('should call intervalData', () => {
    spyOn(component.dateChanged, 'emit');
    spyOn(component, 'setDisplayTime');
    component.startdateValue = undefined;
    component.enddateValue = undefined;
    component.isUTCTime = true;
    component.intervalData();
    expect(component.dateChanged.emit).toHaveBeenCalled();
  });

  it('should call function timeToReadableFormat when time=undefined', () => {
    component.translateResults = undefined;
    const rs = component.timeToReadableFormat(undefined);
    expect(rs).toEqual('');
  });

  it('should call onShowDialog', () => {
    spyOn(component, 'addAriaLabelForCalendarButton');
    // spyOn(component, 'disableFocusTrapCalendar');
    const startDate = new Date();
    const endDate = new Date();
    component.startdateValue = startDate;
    component.enddateValue = endDate;
    component.onShowDialog();
    expect(component.showDialog).toBeTrue();
    expect(component.showDialogError).toBeFalse();
    expect(component.realStartdateValue).toEqual(component.startdateValue);
    expect(component.realEnddateValue).toEqual(component.realEnddateValue);
  });

  it('should call onHideDialog', () => {
    spyOn(component, 'setCurrentViewForCalendar');
    component.onHideDialog();
    expect(component.selectedButtonIndex).toEqual(-1);
  });

  it('should call buttonDuration', () => {
    component.translateResults = {};
    spyOn(component, 'intervalData');
    component.initQuickButtons();
    component.quickButtons = component.defaultQuickButtons;
    component.buttonDuration(1);
    expect(component.selectedButtonIndex).toEqual(1);
    expect(component.intervalData).toHaveBeenCalled();
  });

  it('should call setMaxDateFrom with value endDate', () => {
    component.isSetMaxDateFrom = true;
    component.enddateValue = moment('2020-10-20').toDate();
    const result = component.setMaxDateFrom();
    expect(result).toEqual(component.enddateValue);
  });

  it('should call setMaxDateFrom with value default', () => {
    component.isSetMaxDateFrom = false;
    component.maxdateValue = moment('2020-10-20').toDate();
    const result = component.setMaxDateFrom();
    expect(result).toEqual(component.maxdateValue);
  });

  it('should call selectFromDate with startdateValue after end Date', () => {
    component.startdateValue = moment().toDate();
    component.enddateValue = moment().subtract(1, 'day').toDate();
    component.selectFromDate();
    expect(component.startdateValue).toEqual(component.enddateValue);
  });

  it('should call selectToDate with endDate after current Date', () => {
    const date = new Date();
    // add a day
    date.setDate(date.getDate() + 1);
    component.enddateValue = date;
    component.selectToDate();
    expect(component.enddateValue.toString()).toEqual(moment().toDate().toString());
  });

  it('should call ngOnChanges when has input value ""', () => {
    const arr = [moment('2019-01-01').toDate(), moment('2019-10-20').toDate()];
    const change = new SimpleChange(arr, undefined, false);
    const changeTimezoneFm = new SimpleChange(undefined, '10/11/2021 04:55:39 UTC', false);
    component.showDialog = false;
    component.ngOnChanges({ newTimeValues: change, timezoneFm: changeTimezoneFm });
    const r1 = component.timeToReadableFormat(arr[0]);
    const r2 = component.timeToReadableFormat(arr[1]);
    expect(component.displayTime).toEqual('');
  });

  it('should call ngOnChanges when has input isUTCTime = true', () => {
    const arr = [new Date('2019-01-01'), new Date('2019-10-20')];
    const change = new SimpleChange(undefined, arr, false);
    const changeTimezoneFm = new SimpleChange(undefined, '10/11/2021 04:55:39 UTC', false);
    component.isUTCTime = true;
    component.ngOnChanges({ newTimeValues: change, timezoneFm: changeTimezoneFm });
    const r1 = component.timeToReadableFormat(arr[0]);
    const r2 = component.timeToReadableFormat(arr[1]);
    expect(component.displayTime).toEqual('01/01/2019 00:00:00  10/20/2019 00:00:00');
  });

  it('should call isDisabled return true', () => {
    const isDisabled = component.isDisabled(moment('2019-10-20').toDate(), moment('2019-01-01').toDate());
    expect(isDisabled).toEqual(true);
  });

  it('should call selectFromDate with startdateValue greater moment', () => {
    component.startdateValue = moment().add(1, 'day').toDate();
    const today = moment().toDate();
    component.selectFromDate();
    expect(component.startdateValue.toDateString).toEqual(today.toDateString);
  });

  it('should call resetButtonClick with isUTCTime', () => {
    component.showDialog = true;
    component.isUTCTime = true;
    component.startdateValue = moment().toDate();
    fixture.detectChanges();
    component.resetButtonClick();
    component.showDialog = false;
    fixture.detectChanges();
    expect(component.startdateValue < moment().toDate()).toEqual(true);
  });

  it('should call buttonDuration with isUTCTime', () => {
    component.translateResults = {};
    component.isUTCTime = true;
    spyOn(component, 'intervalData');
    component.initQuickButtons();
    component.quickButtons = component.defaultQuickButtons;
    component.buttonDuration(1);
    expect(component.selectedButtonIndex).toEqual(1);
    expect(component.intervalData).toHaveBeenCalled();
  });

  it('should call function timeToReadableFormat and return time', () => {
    const date = moment('11/19/2021 04:44:44').toDate();
    component.timeOnly = true;
    const rs = component.timeToReadableFormat(date);
    expect(rs).toEqual('04:44:44');
  });

  it('should call function timeToReadableFormat and return time', () => {
    const date = moment('11/19/2021 04:44:44').toDate();
    component.showTime = false;
    const rs = component.timeToReadableFormat(date);
    expect(rs).toEqual('11/19/2021');
  });

  it('should call onShowDialog with isUTCTime', () => {
    const startDate = new Date();
    const endDate = new Date();
    component.startdateValue = startDate;
    component.enddateValue = endDate;
    component.isUTCTime = true;
    component.onShowDialog();
    expect(component.realStartdateValue).toEqual(component.startdateValue);
    expect(component.realEnddateValue).toEqual(component.realEnddateValue);
  });

  it('should prevent input of disallowed characters', () => {
    const event = { key: 'A', preventDefault: jasmine.createSpy('preventDefault') };
    component.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should update the selected date and reset error messages when input time is valid', () => {
    component.calendarElSingle = { validateTime: () => true } as unknown as Calendar;
    const timeValue = '12:30:00';
    const expectedDate = new Date();
    expectedDate.setHours(12);
    expectedDate.setMinutes(30);
    expectedDate.setSeconds(0);
    component.selectedDate = new Date();
    component.changeInputTime(timeValue);
    expect(component.timeInputConfig.isInvalidTime).toBeFalse();
    expect(component.timeInputConfig.errorMessage).toEqual('');
  });

  it('should set invalid time error message when input time is invalid', () => {
    const timeValue = '99:00:00';
    component.changeInputTime(timeValue);
    expect(component.timeInputConfig.isInvalidTime).toBeTrue();
    expect(component.timeInputConfig.errorMessage).toEqual(component.translateResults?.INVALID_TIME);
  });

  it('should update the time input value and reset error messages', () => {
    const event = {
      getHours: jasmine.createSpy('getHours').and.returnValue(10),
      getMinutes: jasmine.createSpy('getMinutes').and.returnValue(20),
      getSeconds: jasmine.createSpy('getSeconds').and.returnValue(30)
    };
    const expectedTimeInputValue = '10:20:30';
    component.updateInputValue(event);
    expect(component.timeInputConfig.timeInputValue).toEqual(expectedTimeInputValue);
  });

  it('should call onTimeSelect', () => {
    spyOn(component, 'updateInputValue');
    const event = {
      getHours: jasmine.createSpy('getHours').and.returnValue(10),
      getMinutes: jasmine.createSpy('getMinutes').and.returnValue(20),
      getSeconds: jasmine.createSpy('getSeconds').and.returnValue(30)
    };
    component.onTimeSelect(event);
    expect(component.updateInputValue).toHaveBeenCalled();
  });

  it('should call checkTimeCalendarsAreEqual', () => {
    component.useFuturePicker = true;
    component.showTime = false;
    const date = new Date();
    component.realStartdateValue = date;
    component.realEnddateValue = date;
    component.checkTimeCalendarsAreEqual();
    expect(component.realStartdateValue.getTime()).toEqual(date.setHours(0, 0, 0));
    expect(component.realEnddateValue.getTime()).toEqual(date.setHours(23, 59, 59));
  });
});
