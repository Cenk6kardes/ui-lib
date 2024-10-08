import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { HttpLoaderFactory } from '../../../shared/http-loader';

import { ColumnHidingDialogComplexComponent } from './column-hiding-dialog-complex.component';

describe('ColumnHidingDialogComplexComponent', () => {
  let component: ColumnHidingDialogComplexComponent;
  let fixture: ComponentFixture<ColumnHidingDialogComplexComponent>;
  let http: HttpTestingController | undefined;
  let translateSevice: TranslateService | undefined;
  let originalTimeout: number;

  const configValue = {
    header: 'string',
    displayDialog: true,
    sourceHeader: 'string',
    targetHeader: 'string',
    possibleCols: [{
      field: 'string1',
      header: 'string1',
      colsEnable: false
    },
    {
      field: 'string2',
      header: 'string2',
      colsEnable: true
    },
    {
      header: 'string3',
      field: 'string3',
      colsEnable: false
    },
    {
      header: 'string4',
      field: 'string4',
      colsEnable: true
    }],
    visibleCols: [{
      header: 'string3',
      field: 'string3',
      colsEnable: false
    },
    {
      header: 'string4',
      field: 'string4',
      colsEnable: true
    }]
  };

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
      declarations: [ColumnHidingDialogComplexComponent],
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
            'CHOOSE': 'Choose',
            'CUSTOMIZE': 'Customize'
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
            'CUSTOMIZE': 'Customize'
          }
        });
      }
    }
    fixture = TestBed.createComponent(ColumnHidingDialogComplexComponent);
    component = fixture.componentInstance;

    component.config = configValue;

    component.possibleCols = [{
      name: 'string1',
      header: 'string1'
    }];
    component.visibleCols = [{
      name: 'string4',
      header: 'string4',
      frozen: true
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnchanges', () => {
    spyOn(component, 'initData');
    const change: SimpleChanges = {
      config: {
        previousValue: [],
        currentValue: configValue,
        firstChange: true,
        isFirstChange: null
      }
    };
    component.ngOnChanges(change);
    expect(component.initData).toHaveBeenCalled();
  });

  it('should call initData with possibleCols.length > 0 & visibleCols.length > 0', () => {
    component.config = configValue;
    component.initData();
    expect(component.possibleCols.length).toEqual(2);
    expect(component.visibleCols.length).toEqual(1);
  });

  it('should display button cancel and button customize ', () => {
    const buttonCancel = fixture.debugElement.query(By.css('#cancel-columns-button')).nativeElement;
    const buttonCustomize = fixture.debugElement.query(By.css('#customize-columns-button')).nativeElement;

    expect(buttonCancel.textContent).toEqual('Cancel');
    expect(buttonCustomize.textContent).toEqual('Save');
  });


  it('should call onCustomize when click customize button', () => {
    spyOn(component.closeDialog, 'emit');

    const buttonCustomize = fixture.debugElement.query(By.css('#customize-columns-button .p-button')).nativeElement;
    buttonCustomize.click();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should call onCloseDialog', () => {
    spyOn(component.closeDialog, 'emit');

    const buttonCancel = fixture.debugElement.query(By.css('#cancel-columns-button .p-button')).nativeElement;
    buttonCancel.click();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should call onHideColumnDialog', () => {
    spyOn(component.hideColumnDialog, 'emit');

    component.onHideColumnDialog();
    expect(component.hideColumnDialog.emit).toHaveBeenCalled();
  });

  it('should call onMoveToSource', () => {
    component.possibleCols = [{
      name: 'string1',
      header: 'string1'
    },
    {
      name: 'string2',
      header: 'string2'
    },
    {
      header: 'string2',
      name: 'string2'
    }];

    const event = {
      items: {
        name: 'name',
        header: 'header'
      }
    };
    component.onMoveToSource(event);
    expect(component.possibleCols.length).toEqual(3);
  });

  it('should call onMoveToTarget', () => {
    component.visibleCols = [{
      name: 'string1',
      header: 'string1'
    },
    {
      name: 'string2',
      header: 'string2'
    },
    {
      header: 'string2',
      name: 'string2'
    }];
    const event = {
      items: {
        name: 'name',
        header: 'header'
      }
    };
    component.onMoveToTarget(event);
    expect(component.visibleCols.length).toEqual(3);
  });

  it('should call onTargetReorder', () => {
    spyOn(component, 'handleFrozen');
    component.allowFrozen = true;
    component.onTargetReorder();
    expect(component.handleFrozen).toHaveBeenCalled();
  });

  it('should call handleFrozen', () => {
    const col = [{
      allowHide: false,
      frozen: true
    }];
    component.handleFrozen(col, false);
    expect(component).toBeTruthy();
  });

  it('should call handleItems with array item', () => {
    spyOn(component, 'handleFrozen');
    component.allowFrozen = true;
    const items = [{
      name: 'test',
      allowHide: false,
      frozen: true
    }];
    component.handleItems(items, false);
    expect(component.handleFrozen).toHaveBeenCalled();
  });

  it('should call handleItems with object item', () => {
    spyOn(component, 'handleFrozen');
    component.allowFrozen = true;
    const item = {
      name: 'test',
      allowHide: false,
      frozen: true
    };
    component.handleItems(item, false);
    expect(component.handleFrozen).toHaveBeenCalled();
  });

  it('should call frozenCol', () => {
    const ev: MouseEvent = new MouseEvent('click');
    spyOn(ev, 'stopPropagation');
    const col = {
      name: 'string4',
      header: 'string4'
    };
    component.frozenCol(col, ev);
    expect(ev.stopPropagation).toHaveBeenCalled();
  });
});
