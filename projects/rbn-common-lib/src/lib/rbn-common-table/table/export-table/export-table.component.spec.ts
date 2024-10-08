import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';

import { HttpLoaderFactory } from '../../../shared/http-loader';
import { ExportTableComponent } from './../export-table/export-table.component';
import { DatePipe } from '@angular/common';
const data = [
  {
    vin: 'a1653d4d',
    brand: 'Volkswagen',
    year: new Date(2018, 0, 0).toString(),
    color: 'White',
    issues: new Date(2018, 0, 0).toString()
  },
  {
    vin: 'ddeb9b10',
    brand: 'Mercedes',
    year: new Date(2018, 0, 0).toString(),
    color: 'Green', issues: new Date(2018, 0, 0).toString()
  },
  {
    vin: 'd8ebe413',
    brand: 'Jaguar',
    year: new Date(2018, 0, 0).toString(),
    color: 'Silver',
    issues: new Date(2018, 0, 0).toString()
  },
  {
    vin: 'aab227b7',
    brand: 'Audi',
    year: new Date(2018, 0, 0).toString(),
    color: 'Black',
    issues: new Date(2018, 0, 0).toString()
  },
  {
    vin: '631f7412',
    brand: 'Volvo',
    year: new Date(2018, 0, 0).toString(),
    color: 'Red',
    issues: new Date(2018, 0, 0).toString()
  },
  {
    vin: '7d2d22b0',
    brand: 'Volkswagen',
    year: new Date(2018, 0, 0).toString(),
    color: 'Maroon',
    issues: new Date(2018, 0, 0).toString()
  }
];

describe('ExportTableComponent', () => {
  let component: ExportTableComponent;
  let fixture: ComponentFixture<ExportTableComponent>;
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
    window.sessionStorage.clear();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PaginatorModule,
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ExportTableComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: DatePipe }
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (translateSevice) {
      translateSevice.setDefaultLang('en');
      if (http) {
        http.expectOne('./assets/i18n/en.json').flush({
          'COMMON': {
            'YES': 'Yes',
            'NO': 'No',
            'APPLY': 'Apply',
            'SHOW_COLUMN': 'Show column',
            'CLOSE': 'Close',
            'SHOW_HIDE_FILTER_ROW': 'Show/Hide Filter Row',
            'SHOWHIDECOLUMNS': 'Show/Hide Columns',
            'ALL': 'All',
            'SELECT_ACTION': 'Select Action',
            'NO_RECORDS': 'No records found',
            'SHOWING': 'Showing',
            'OF': 'of',
            'RECORDS': 'records',
            'RECORD': 'record',
            'RESET': 'Reset',
            'ADD': 'Add',
            'REMOVE': 'Remove',
            'REFRESH': 'Refresh Table',
            'CANCEL': 'Cancel',
            'SHOWING_RECORDS': 'Showing {0} of {1} records',
            'SHOWING_RECORD': 'Showing {0} of {1} record',
            'SUCCESS': 'Success',
            'ERROR': 'Error',
            'SAVE': 'Save',
            'UPLOAD': 'Upload',
            'NO_FILE_SELECT': 'No file selected',
            'CHOOSE': 'Choose',
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'SELECTED_ALL_ROWS': 'Select all {0} rows',
            'DESELECT_ALL_ROWS': 'Deselect all {0} rows',
            'EXPORT_CSV': 'Export Table (.csv)',
            'EXPORT_PDF': 'Export Table (.pdf)',
            'EXPORT_CSV_AVAILABLE_RECORDS': 'Number of records available for download are ',
            'EXPORT_CSV_MAX_RECORDS': 'Please provide a input less than or equal to records available for download.',
            'FILENAME': 'Filename',
            'DELIMITER': 'Delimiter',
            'PAGE': 'Page',
            'CONTENT_OPTION': 'Content Option',
            'LIMIT_RECORDS': 'Limit Records'
          },
          'TABLE': {
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'SELECTED_ALL_ROWS': 'Select all {0} rows',
            'DESELECT_ALL_ROWS': 'Deselect all {0} rows'
          }
        });
        http.expectOne('./assets/i18n/rbn_en.json').flush({
          'COMMON': {
            'YES': 'Yes',
            'NO': 'No',
            'APPLY': 'Apply',
            'SHOW_COLUMN': 'Show column',
            'CLOSE': 'Close',
            'SHOW_HIDE_FILTER_ROW': 'Show/Hide Filter Row',
            'SHOWHIDECOLUMNS': 'Show/Hide Columns',
            'ALL': 'All',
            'SELECT_ACTION': 'Select Action',
            'NO_RECORDS': 'No records found',
            'SHOWING': 'Showing',
            'OF': 'of',
            'RECORDS': 'records',
            'RECORD': 'record',
            'RESET': 'Reset',
            'ADD': 'Add',
            'REMOVE': 'Remove',
            'REFRESH': 'Refresh Table',
            'CANCEL': 'Cancel',
            'SHOWING_RECORDS': 'Showing {0} of {1} records',
            'SHOWING_RECORD': 'Showing {0} of {1} record',
            'SUCCESS': 'Success',
            'ERROR': 'Error',
            'SAVE': 'Save',
            'UPLOAD': 'Upload',
            'NO_FILE_SELECT': 'No file selected',
            'CHOOSE': 'Choose',
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'SELECTED_ALL_ROWS': 'Select all {0} rows',
            'DESELECT_ALL_ROWS': 'Deselect all {0} rows',
            'EXPORT_CSV': 'Export Table (.csv)',
            'EXPORT_PDF': 'Export Table (.pdf)',
            'EXPORT_CSV_AVAILABLE_RECORDS': 'Number of records available for download are ',
            'EXPORT_CSV_MAX_RECORDS': 'Please provide a input less than or equal to records available for download.',
            'FILENAME': 'Filename',
            'DELIMITER': 'Delimiter',
            'PAGE': 'Page',
            'CONTENT_OPTION': 'Content Option',
            'LIMIT_RECORDS': 'Limit Records'
          },
          'TABLE': {
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'SELECTED_ALL_ROWS': 'Select all {0} rows',
            'DESELECT_ALL_ROWS': 'Deselect all {0} rows'
          }
        });
      }
    }
    fixture = TestBed.createComponent(ExportTableComponent);
    component = fixture.componentInstance;
    component.tableHeader = [{
      colDisable: false,
      colsEnable: true,
      data: [],
      field: 'checkbox',
      header: '',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    },
    {
      colDisable: false,
      colsEnable: true,
      data: [],
      field: 'brand',
      header: 'Brand',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    },
    {
      colDisable: false,
      colsEnable: true,
      exportCol: false,
      data: [],
      field: 'year',
      header: 'Year',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialogue pop up after clicking 3 dot menu', () => {
    component.tableData = data;
    component.ngOnInit();
    expect(component.showDialog).toBeTrue();
  });

  it('should allow user to add input and then click on submit button to export csv', () => {
    spyOn(component, 'saveToCSVByData');
    component.exportTableData();
    expect(component.saveToCSVByData).toHaveBeenCalled();
  });

  it('should allow user to add input and then click on submit button to export saveHeaderAsCSV', () => {
    component.fileType = 'csv';
    component.downloadType = 'header';
    spyOn(component, 'saveHeaderAsCSV');
    component.exportTableData();
    expect(component.saveHeaderAsCSV).toHaveBeenCalled();
  });

  it('should allow user to add input and then click on submit button to export pdf', () => {
    component.fileType = 'pdf';
    spyOn(component, 'saveToPDFByData');
    component.exportTableData();
    expect(component.saveToPDFByData).toHaveBeenCalled();
  });

  it('should call limitRecordVal, noOfDwnldExceeds= true', () => {
    const evnt = {target: {
      value: 2
    }};
    component.rowsAvailableForDownload = 1;
    component.limitRecordVal(evnt);
    expect(component.noOfDwnldExceeds).toEqual(true);
  });

  it('should call limitRecordVal, noOfDwnldExceeds= false', () => {
    const evnt = {target: {
      value: 1
    }};
    component.rowsAvailableForDownload = 2;
    component.limitRecordVal(evnt);
    expect(component.noOfDwnldExceeds).toEqual(false);
  });

  it('should call closeDialogs', () => {
    component.showDialog = false;
    spyOn(component.closeDialog, 'emit');
    component.closeDialogs();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should call saveHeaderAsCSV', () => {
    spyOn(component, 'closeDialogs');
    component.saveHeaderAsCSV();
    expect(component.closeDialogs).toHaveBeenCalled();
  });

  it('should call onSelectDropdownFileType', () => {
    const event = {value: 'pdf'};
    spyOn(component, 'closeDialogs');
    component.onSelectDropdownFileType(event);
    expect(component.fileType).toEqual(event.value);
  });

  it('should call limitValidation', () => {
    component.limitValidation();
    expect(component.exportMaxLimit).toEqual(10000);
  });

  it('should call saveToPDF', () => {
    spyOn(component, 'formatDataExport');
    component.saveToPDFByData(data);
    expect(component.formatDataExport).toHaveBeenCalled();
  });

  it('should call formatDataExport', () => {
    component.cols = [{
      colsEnable: true,
      data: [{label: '2003', value: '2003'}],
      field: 'year',
      header: 'Year',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    }];
    spyOn(component, 'exportPDFfilter');
    component.formatDataExport([{brand:'123', year: '2003'}]);
    expect(component.exportPDFfilter).toHaveBeenCalled();
  });

  it('should call saveToCSV, exportCol = false', () => {
    component.tableData = [{year: '2003'}];
    component.rowsToDownload  = 1;
    component.showExportColumns = false;
    component.tableHeader = [{
      exportCol: false,
      data: [{label: '2003', value: '2003'}],
      field: 'year',
      header: 'Year',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    }];
    spyOn(component, 'closeDialogs');
    component.saveToCSVByData(data);
    expect(component.closeDialogs).toHaveBeenCalled();
  });

  it('should call saveToCSV, colsEnable = true', () => {
    component.tableData = [{year: '2003'}];
    component.rowsToDownload  = 1;
    component.tableHeader = [{
      colsEnable: true,
      data: [{label: '2003', value: '2003'}],
      field: 'year',
      header: 'Year',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    }];
    spyOn(component, 'closeDialogs');
    component.saveToCSVByData(data);
    expect(component.closeDialogs).toHaveBeenCalled();
  });

  it('should call ngOnInit, contentType and downloadType = header', () => {
    component.tableData = [];
    component.ngOnInit();
    expect(component.downloadType ).toEqual('header');
  });

  it('should call ngOnInit, showColumns = true', () => {
    component.showExportColumns = true;
    component.allTableHeader = [{
      colDisable: false,
      colsEnable: true,
      data: [],
      field: 'checkbox',
      header: '',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    },
    {
      colDisable: false,
      colsEnable: true,
      data: [],
      field: 'brand',
      header: 'Brand',
      options: {showHeaderBorder: false, model: undefined},
      sort: false
    }];
    component.tableData = [{
      brand: 'Volkswagen', year: '2023'
    }];
    component.ngOnInit();
    expect(component.columnsOptions).toEqual([{label: 'brand', value:'brand'}]);
  });
});
