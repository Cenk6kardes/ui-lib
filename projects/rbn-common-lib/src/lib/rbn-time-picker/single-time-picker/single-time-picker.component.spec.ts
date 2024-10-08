import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import moment from 'moment';

import { RbnTimePickerModule } from '../rbn-time-picker-lib.module';
import { MomentUnit } from '../timepicker/timepicker.component';
import { SingleTimePickerComponent } from './single-time-picker.component';

describe('SingleTimePickerComponent', () => {
  let component: SingleTimePickerComponent;
  let fixture: ComponentFixture<SingleTimePickerComponent>;
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
        DatePipe
      ],
      declarations: [SingleTimePickerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTimePickerComponent);
    component = fixture.componentInstance;
    component.defaultQuickButtons = [
      {
        id: 1,
        text: 'NEXT_15_MINUTE',
        time: 15,
        unit: MomentUnit.Minutes,
        isSelected: false
      }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'setDisplayTime');
    component.newTimeValues = [moment().subtract(2, 'days').toDate(), moment().add(6, 'days').toDate()];
    component.ngOnInit();
    expect(component.setDisplayTime).toHaveBeenCalled();
  });

  it('should call ngOnChanges when has input', () => {
    spyOn(component, 'setDisplayTime');
    const singleCalendarConfig = {
      label: 'label',
      selectedDate: moment().subtract(3, 'days').toDate()
    };
    const change = new SimpleChange(undefined, singleCalendarConfig, false);
    component.singleCalendarConfig = {
      label: 'label',
      selectedDate: moment().subtract(3, 'days').toDate()
    };
    component.ngOnChanges({ singleCalendarConfig: change });
    expect(component.setDisplayTime).toHaveBeenCalled();
  });

  it('should call setDisplayTime', () => {
    const selectedDate = new Date(2019, 0, 0);
    component.selectedDate = selectedDate;
    component.setDisplayTime();
    expect(component.displayTime).toEqual(moment(selectedDate).format('MM/DD/YYYY HH:mm:ss')
    );
  });

  it('should call intervalData', () => {
    spyOn(component.dateChanged, 'emit');
    spyOn(component, 'setDisplayTime');
    component.intervalData();
    expect(component.clickSubmitButton).toBeTruthy();
    expect(component.dateChanged.emit).toHaveBeenCalled();
    expect(component.durationButtonClicked).toBeFalsy();
    expect(component.setDisplayTime).toHaveBeenCalled();
  });

  it('should call resetButtonClick', () => {
    spyOn(component.dateChanged, 'emit');
    spyOn(component, 'setCurrentViewForCalendar');
    spyOn(component, 'onFocusableCellCalendar');
    component.selectedDate = moment('2020-01-01').toDate();
    component.resetButtonClick();
    expect(component.durationButtonClicked).toBeFalsy();
    expect(component.selectedDate.getMonth()).toEqual(moment().toDate().getMonth());
    expect(component.oldSelectedDate).toEqual(component.selectedDate.getTime());
    expect(component.dateChanged.emit).toHaveBeenCalled();
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

  it('should call onShowDialog', () => {
    spyOn(component, 'addAriaLabelForCalendarButton');
    const selectedDate = new Date(2019, 0, 0);
    component.selectedDate = selectedDate;
    component.onShowDialog();
    expect(component.showDialog).toBeTrue();
    expect(component.showDialogError).toBeFalse();
    expect(component.oldSelectedDate).toEqual(selectedDate.getTime());
  });

  it('should call onHideDialog', () => {
    spyOn(component, 'setCurrentViewForCalendar');
    component.oldSelectedDate = moment('2019-01-01').toDate().getTime();
    component.clickSubmitButton = false;
    component.onHideDialog();
    expect(component.selectedDate).toEqual(moment(component.oldSelectedDate).toDate());
  });

  it('should call ngOnChanges with selectedDate null', () => {
    spyOn(component, 'setDisplayTime');
    const singleCalendarConfig = {
      label: 'label',
      selectedDate: moment().toDate()
    };
    const change = new SimpleChange(undefined, singleCalendarConfig, false);
    component.singleCalendarConfig = {
      label: 'label',
      selectedDate: null
    };
    component.ngOnChanges({ singleCalendarConfig: change });
    expect(component.setDisplayTime).toHaveBeenCalled();
  });
});
