import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { ColumnHidingSimpleComponent } from './column-hiding-simple.component';


describe('ColumnHidingSimpleComponent', () => {
  let component: ColumnHidingSimpleComponent;
  let fixture: ComponentFixture<ColumnHidingSimpleComponent>;
  let http: HttpTestingController | undefined;
  let translateSevice: TranslateService | undefined;
  let originalTimeout: number;

  const config = {
    header: 'string',
    displayDialog: true,
    isUsingAppendTo: true,
    cols: [{
      header: 'string',
      field: 'string'
    }],
    checkBoxAll: true,
    modelName: 'modelName',
    closeButtonLabel: 'Close',
    showAdvancedOption: true
  };

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnHidingSimpleComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
            'CHOOSE': 'Choose'
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
            'CHOOSE': 'Choose'
          }
        });
      }
    }
    fixture = TestBed.createComponent(ColumnHidingSimpleComponent);
    component = fixture.componentInstance;
    component.config = config;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onHideColumnDialog', () => {
    spyOn(component.hideColumnDialog, 'emit');
    component.onHideColumnDialog();
    expect(component.hideColumnDialog.emit).toHaveBeenCalled();
  });

});
