import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';

import { CalendarDateRange } from '../../../models/calendardaterange';
import { DateRangePickerComponent } from './daterangepicker.component';
import { DaterangepickerModule } from '../daterangepicker.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DateRangePickerComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;

  @Component({
    selector: 'rbn-host-component',
    template: '<rbn-daterangepicker></rbn-daterangepicker>'
  })
  class TestHostComponent {
    @ViewChild(DateRangePickerComponent, { static: true })
    public DateRangePickerComponent: DateRangePickerComponent;
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DaterangepickerModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ],
      declarations: [DateRangePickerComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should pass showTime to p-calendar', () => {
    testHostComponent.DateRangePickerComponent.showTime = true;
    testHostComponent.DateRangePickerComponent.ngOnInit();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.pShowTime).toBeTruthy();

    testHostComponent.DateRangePickerComponent.showTime = false;
    testHostComponent.DateRangePickerComponent.ngOnInit();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.pShowTime).toBeFalsy();
  });

  it('should pass fromDate to p-calendar', () => {
    testHostComponent.DateRangePickerComponent.fromDate = new Date(111);
    testHostComponent.DateRangePickerComponent.ngOnInit();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.pFromDate.valueOf()).toBe(111);
  });

  it('should pass toDate to p-calendar', () => {
    testHostComponent.DateRangePickerComponent.toDate = new Date(222);
    testHostComponent.DateRangePickerComponent.ngOnInit();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.pToDate.valueOf()).toBe(222);
  });

  it('should post dialog', () => {
    testHostComponent.DateRangePickerComponent.postDialog();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.pDisplay).toBeTruthy();
  });

  it('should hide dialog', () => {
    testHostComponent.DateRangePickerComponent.handleCancel();
    // testHostFixture.detectChanges();
    // expect(testHostFixture.nativeElement.querySelector('div').innerText).toEqual('TEST INPUT');
    expect(testHostComponent.DateRangePickerComponent.handleCancel()).toBeFalsy();
  });

  it('should emit date range', () => {
    let dateRange: CalendarDateRange;
    testHostComponent.DateRangePickerComponent.fromDate = new Date(333);
    testHostComponent.DateRangePickerComponent.toDate = new Date(444);
    testHostComponent.DateRangePickerComponent.ngOnInit();
    testHostComponent.DateRangePickerComponent.handleOk();
    testHostComponent.DateRangePickerComponent.dateRangeEmitter.subscribe((value) => {
      dateRange = value;
      expect(dateRange.from.valueOf()).toBe(333);
      expect(dateRange.to.valueOf()).toBe(444);
    });
  });

  it('should call formatDateRange', () => {
    const result = testHostComponent.DateRangePickerComponent.formatDateRange();
    expect(result).toBeTruthy();
  });

});
