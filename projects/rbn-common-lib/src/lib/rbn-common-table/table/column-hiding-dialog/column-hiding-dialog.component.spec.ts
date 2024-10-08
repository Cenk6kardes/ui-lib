import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { HttpLoaderFactory } from '../../../shared/http-loader';
import { RbnTableService } from '../../shared/rbn-table.service';

import { ColumnHidingDialogComponent } from './column-hiding-dialog.component';

describe('ColumnHidingDialogComponent', () => {
  let component: ColumnHidingDialogComponent;
  let fixture: ComponentFixture<ColumnHidingDialogComponent>;
  let http: HttpTestingController | undefined;
  let translateSevice: TranslateService | undefined;
  let originalTimeout: number;

  const rbnTableService = {
    closeDialog: new BehaviorSubject(null),
    openAdvanced: new BehaviorSubject(null),
    checkboxShowCol: new BehaviorSubject(null),
    checkboxAllCols: new BehaviorSubject(null)
  };

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
      declarations: [ColumnHidingDialogComponent],
      imports: [
        ButtonModule,
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
      providers: [{ provide: RbnTableService, useValue: rbnTableService }],
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
    fixture = TestBed.createComponent(ColumnHidingDialogComponent);
    component = fixture.componentInstance;
    component.config = config;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button close', () => {
    const buttonClose = fixture.nativeElement.querySelector('.p-button');
    expect(buttonClose).toBeTruthy();
  });

  it('should call onChangeCheckBoxAllShowCol', () => {
    spyOn(component.changeCheckboxAll, 'emit');
    component.onChangeCheckBoxAllShowCol();
    expect(component.changeCheckboxAll.emit).toHaveBeenCalled();
  });

  it('should call onChangeCheckBoxShowCol', () => {
    spyOn(rbnTableService.checkboxShowCol, 'next');
    const col = {
      field: 'string',
      allowHide: false,
      frozen: true
    };
    component.onChangeCheckBoxShowCol(col);
    expect(rbnTableService.checkboxShowCol.next).toHaveBeenCalled();
  });

  it('should call onCloseDialog', () => {
    spyOn(rbnTableService.closeDialog, 'next');
    component.onCloseDialog();
    expect(rbnTableService.closeDialog.next).toHaveBeenCalled();
  });

  it('should call onOpenAdvancedOption', () => {
    spyOn(rbnTableService.openAdvanced, 'next');
    component.onOpenAdvancedOption();
    expect(rbnTableService.openAdvanced.next).toHaveBeenCalled();
  });

  it('should call frozenCol', () => {
    const col = {
      field: 'action',
      allowHide: false,
      frozen: true
    };
    component.frozenCol(col);
    expect(component).toBeTruthy();
  });
});
