import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { FieldName, FilterTypes, IFilterServerDataEmit } from '../../models/common-table';

import { CommonTableComponent } from './common-table.component';
import { SanitizeHtmlPipe } from '../shared/base-table.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { RbnCommonTableModule } from '../rbn-common-table-lib.module';

describe('CommonTableComponent', () => {
  let component: CommonTableComponent;
  let fixture: ComponentFixture<CommonTableComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

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

  const cols: any[] = [
    {
      field: FieldName.Expand,
      colsEnable: true,
      header: '',
      options: {
        model: ''
      }
    },
    {
      data: [],
      field: 'vin',
      header: 'Vin',
      type: FilterTypes.InputText,
      options: {
        model: ''
      },
      colsEnable: true
    },
    {
      data: [],
      field: 'year',
      header: 'Year',
      type: FilterTypes.Calendar,
      options: {
        model: ''
      },
      colsEnable: true
    },
    {
      data: [],
      field: 'issues',
      header: 'Issues',
      type: FilterTypes.DateRange,
      options: {
        model: ''
      },
      colsEnable: true
    },
    {
      data: [],
      field: 'brand',
      header: 'Brand',
      type: FilterTypes.Dropdown,
      options: {
        model: ''
      },
      colsEnable: true,
      sort: true
    },
    {
      data: [],
      field: 'color',
      header: 'Color',
      type: FilterTypes.Multiselect,
      options: {
        model: ''
      },
      canExpand: true,
      colsEnable: true
    },
    {
      data: [],
      field: FieldName.Action,
      header: 'Action',
      type: undefined,
      options: {
        model: ''
      },
      colsEnable: true
    }
  ];

  const parent = {
    id: 1,
    clusterId: '1',
    clusterName: 'Cluster 1',
    nodeId: -1,
    nodeName: null,
    deviceType: 'SBX5K',
    collectionStatus: false,
    selected: undefined,
    children: [
      {
        id: 6,
        clusterId: '1',
        clusterName: 'Cluster 1',
        nodeId: 3,
        nodeName: 'Node 3',
        deviceType: 'SBX5K',
        collectionStatus: false
      },
      {
        id: 9,
        clusterId: '1',
        clusterName: 'Cluster 1',
        nodeId: 4,
        nodeName: 'Node 4',
        deviceType: 'SBX5K',
        collectionStatus: false
      }
    ]
  };

  const child = {
    id: 6,
    clusterId: '1',
    clusterName: 'Cluster 1',
    nodeId: 3,
    nodeName: 'Node 3',
    deviceType: 'SBX5K',
    collectionStatus: false
  };

  const rbnTableService = {
    closeDialog: new BehaviorSubject(null),
    openAdvanced: new BehaviorSubject(null),
    checkboxShowCol: new BehaviorSubject(null),
    checkboxAllCols: new BehaviorSubject(null),
    alwaysShowFilter: true
  };

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
        BrowserModule,
        BrowserAnimationsModule,
        RbnCommonTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ],
      declarations: [CommonTableComponent, SanitizeHtmlPipe],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: RbnTableService, useValue: rbnTableService }
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
    fixture = TestBed.createComponent(CommonTableComponent);
    component = fixture.componentInstance;
    component.header = 'Header';
    component.topButton = {
      label: 'Test button',
      disabled: false,
      onClick: testFuntion
    };
    component.cols = cols;
    component.data = data;
    component.numberRowPerPage = 10;
    component.tableName = 'tableName';
    component.showCloseTableButton = true;
    // component.data.map((item: any) => {
    //   item.actions = [{ label: 'Select 1', value: 'select1' }];
    // });
    const change = {
      data: new SimpleChange(
        data,
        data,
        true
      )
    };
    component.ngOnChanges(change);
    fixture.detectChanges();
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function testFuntion() { }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call refreshDataInner when keepFilter = false', () => {
    spyOn(component.dataTable, 'reset');
    spyOn(component.dataTable, 'filterGlobal');
    component.keepFilter = false;
    component.refreshDataInner(false);
    expect(component.searchData).toEqual('');
  });

  it('call refreshDataInner when emit = true', () => {
    spyOn(component.refreshData, 'emit');
    component.refreshDataInner(true);
    expect(component.refreshData.emit).toHaveBeenCalled();
  });

  it('should call funtion setCurrentDropAction', () => {
    component.setCurrentDropAction(1);
    component.data.forEach((item, index) => {
      if (index !== 1) {
        expect(item.ngModel).toEqual('');
      }
    });
  });

  it('should call onDateChanged', () => {
    spyOn(component.dataTable, 'filter');
    const event = {
      startdateValue: new Date('1-1-2019').toString(),
      enddateValue: new Date('2-1-2019').toString()
    };
    component.onDateChanged(event, component.cols[2]);
    expect(component.dataTable.filter).toHaveBeenCalled();
  });

  it('should reset calendarFilter when call onDateChanged with data undefined', () => {
    spyOn(component.dataTable, 'filter');
    const event = {
      startdateValue: undefined,
      enddateValue: undefined
    };
    component.onDateChanged(event, component.cols[2]);
    if (component.dataTable) {
      expect(component.dataTable.filter).toHaveBeenCalledWith('', component.cols[2].field, 'calendarFilter');
    }
  });

  it('should call onDateChanged when col.type = FilterTypes.DateRange', () => {
    spyOn(component.dataTable, 'filter');
    const event = {
      startdateValue: new Date('1-1-2019').toString(),
      enddateValue: new Date('2-1-2019').toString()
    };
    component.onDateChanged(event, component.cols[3]);
    expect(component.dataTable.filter).toHaveBeenCalled();
  });

  it('should call onDateChanged when col.type = FilterTypes.DateRange with data undefined', () => {
    spyOn(component.dataTable, 'filter');
    const event = {
      startdateValue: undefined,
      enddateValue: undefined
    };
    component.onDateChanged(event, component.cols[3]);
    if (component.dataTable) {
      expect(component.dataTable.filter).toHaveBeenCalledWith('', component.cols[3].field, 'dateRangeFilter');
    }
  });

  it('should call setOptions', () => {
    component.tableOptions = {
      paginator: false,
      caption: false,
      formatDate: 'MMMM d, y, h:mm:ss a z'
    };
    component.setOptions();
    expect(component.formatDate).toEqual(component.tableOptions.formatDate);
  });

  it('should call setDataTableToStorage', () => {
    component.cols = [
      { data: [], field: FieldName.Checkbox, header: '', sort: false, colsEnable: true, options: { model: '' } },
      {
        field: 'name', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, data: [],
        options: { model: 'test', usingLink: true }
      },
      {
        field: 'elements', header: '', sort: true, colsEnable: true, type: FilterTypes.InputText, data: [],
        options: { model: 'test' }
      },
      {
        field: 'severity', header: '', sort: true, colsEnable: false, colDisable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      }
    ];
    component.tableName = 'tabletTest';
    component.searchData = 'test';
    component.setDataTableToStorage();
    const value = sessionStorage.getItem(component.generateKey());
    expect(JSON.parse(value)).toEqual({
      colsDisable: ['severity'],
      colsEnable: ['checkbox', 'name', 'elements'],
      colsFilter: { name: 'test', elements: 'test', severity: 'test' },
      globalFilter: '',
      typeColsFilter: [{ colName: 'name', type: 1 }, { colName: 'elements', type: 2 }, { colName: 'severity', type: 1 }],
      showFilterRow: true,
      colsFrozen: []
    });
  });

  it('should call loadDataStorageToTable', (done) => {
    component.cols = [
      { data: [], field: FieldName.Checkbox, header: '', sort: false, colsEnable: true, options: { model: '' } },
      {
        field: 'name', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, data: [],
        options: { model: 'test', usingLink: true }
      },
      {
        field: 'elements', header: '', sort: true, colsEnable: true, type: FilterTypes.InputText, data: [],
        options: { model: 'test' }
      },
      {
        field: 'severity', header: '', sort: true, colsEnable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      },
      {
        field: 'date', header: 'DateColumn', sort: true, colsEnable: true, type: FilterTypes.Calendar,
        options: {}
      },
      {
        field: 'multi', header: '', sort: true, colsEnable: true, type: FilterTypes.Multiselect, data: [],
        options: { model: 'test' }
      }
    ];
    component.tableName = 'tabletTest';
    component.searchData = 'test';
    const key = component.generateKey();
    sessionStorage.setItem(key, JSON.stringify({
      colsDisable: ['severity'],
      colsEnable: ['checkbox', 'name', 'elements'],
      colsFilter: { name: 'test', elements: 'test', severity: 'test', date: ['2020-10-20', '2020-10-21'], multi: ['test1'] },
      globalFilter: 'test',
      showFilterRow: false
    }));
    spyOn(component, 'onDropdownFilterChanged');
    spyOn(component, 'onDateChanged');
    component.clientMode = true;
    const table: any = {
      filter: jasmine.createSpy('filter'),
      filterGlobal: jasmine.createSpy('filterGlobal'),
      columns: []
    };
    component.dataTable = table;
    component.loadDataStorageToTable();
    expect(component.onDropdownFilterChanged).toHaveBeenCalled();
    expect(component.onDateChanged).toHaveBeenCalled();
    expect(component.dataTable.filter).toHaveBeenCalledWith('test', 'name', 'equals');
    expect(component.dataTable.filter).toHaveBeenCalledWith('test', 'elements', 'contains');
    setTimeout(() => {
      expect(component.dataTable.filterGlobal).toHaveBeenCalledWith(component.searchData, 'contains');
      done();
    }, 100);
    expect(component.showFilterRow).toBeFalse();
  });

  it('should call loadDataStorageToTable with Server Mode', () => {
    component.cols = [
      { data: [], field: 'checkbox', header: '', sort: false, colsEnable: true, options: { model: '' } },
      {
        field: 'name', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, data: [],
        options: { model: 'test', usingLink: true }
      },
      {
        field: 'elements', header: '', sort: true, colsEnable: true, type: FilterTypes.InputText, data: [],
        options: { model: 'test' }
      },
      {
        field: 'severity', header: '', sort: true, colsEnable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      },
      {
        field: 'date', header: 'DateColumn', sort: true, colsEnable: true, type: FilterTypes.Calendar,
        options: {}
      }
    ];
    component.tableName = 'tabletTest';
    const key = component.generateKey();
    sessionStorage.setItem(key, JSON.stringify({
      colsFilter: { name: 'test', elements: 'test', severity: 'test' },
      globalFilter: 'test',
      showFilterRow: false
    }));
    component.searchData = 'test';
    spyOn(component, 'onDropdownFilterChanged');
    spyOn(component, 'onDateChanged');
    spyOn(component, 'emitFilterServer');
    component.clientMode = false;
    const table: any = {
      filter: jasmine.createSpy('filter')
    };
    component.dataTable = table;
    component.loadDataStorageToTable();
    expect(component.onDropdownFilterChanged).toHaveBeenCalled();
    expect(component.onDateChanged).toHaveBeenCalledWith(
      { startdateValue: undefined, enddateValue: undefined }, component.cols[4]
    );
    expect(component.emitFilterServer).toHaveBeenCalledWith(
      { filter: { name: 'test', elements: 'test', severity: 'test', date: [] }, typeFilter: undefined }
    );
    expect(component.showFilterRow).toBeFalse();
  });

  it('should call emitFilterServer', () => {
    component.waitingFilterServer = false;
    const emitData: IFilterServerDataEmit = {
      filter: { name: 'test', field: undefined, field2: [] }
    };
    spyOn(component.filterServer, 'emit');
    component.emitFilterServer(emitData);
    expect(component.filterServer.emit).toHaveBeenCalledWith({ filter: { name: 'test' } });
  });

  it('should call function toggleFilterRow', () => {
    component.cols = [
      { data: [], field: FieldName.Checkbox, header: '', sort: false, colsEnable: true, options: { model: '' } },
      {
        field: 'name', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, data: [],
        options: { model: 'test', usingLink: true }
      },
      {
        field: 'elements', header: '', sort: true, colsEnable: true, type: FilterTypes.InputText, data: [],
        options: { model: 'test' }
      },
      {
        field: 'severity', header: '', sort: true, colsEnable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      },
      {
        field: 'severity', header: '', sort: true, colsEnable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      }
    ];
    component.tableName = 'tabletTest';
    component.searchData = 'test';
    component.showFilterRow = false;
    component.toggleFilterRow();
    expect(component.showFilterRow).toEqual(true);
  });

  it('should call function filterItemExistColMultiselect', () => {
    const mockdata = [
      {
        id: 1,
        value: '2-SBCs',
        name: '2-SBCs',
        elements: 'SBX1K|sbc-edge-2',
        severity: 'All',
        rateTripwire: 'off',
        eventTripWire: '2 Events',
        actions: []
      }
    ];
    const model = ['2-SBCs', '2-SBC'];
    const value = component.filterItemExistColMultiselect(model, mockdata);
    expect(value.length).toEqual(1);
  });

  it('should call setWidthCol with calendar filter column', () => {
    const col = {
      field: 'date', header: 'DateColumn', sort: true, colsEnable: true, type: FilterTypes.Calendar, data: [
        { label: 'test' }, { label: 'test' }
      ],
      options: { model: 'test', usingLink: true }
    };
    component.tableOptions = { usingTriStateCheckbox: true };
    const value = component.setWidthCol(col);
    expect(value).toEqual('190px');
  });

  it('should call setWidthCol with calendar filter column', () => {
    component.tableOptions = { usingTriStateCheckbox: true };
    const col = { data: [], field: FieldName.Checkbox, header: '', sort: false, colsEnable: true, options: { model: '' } };
    const value = component.setWidthCol(col);
    expect(value).toEqual('85px');
  });

  it('should call onFilter', () => {
    spyOn(component.filter, 'emit');
    const event = 'test';
    component.onFilter(event);
    expect(component.filter.emit).toHaveBeenCalledWith(event);
  });

  it('should call onCustomGlobalFilter', () => {
    spyOn(component.customGlobalFilter, 'emit');
    const event = 'test';
    component.onCustomGlobalFilter(event);
    expect(component.customGlobalFilter.emit).toHaveBeenCalledWith(event);
  });

  it('should call onCustomSort', () => {
    spyOn(component.customSort, 'emit');
    const event = 'test';
    component.onCustomSort(event);
    expect(component.customSort.emit).toHaveBeenCalledWith(event);
  });

  it('should call onRowReorder', () => {
    spyOn(component.rowReorder, 'emit');
    component.onRowReorder();
    expect(component.rowReorder.emit).toHaveBeenCalled();
  });

  it('should call onCloseTable', () => {
    spyOn(component.closeTable, 'emit');
    component.onCloseTable();
    expect(component.closeTable.emit).toHaveBeenCalled();
  });

  it('should call onResetRowFilter', () => {
    spyOn(component.resetRowFilter, 'emit');
    component.onResetRowFilter();
    expect(component.resetRowFilter.emit).toHaveBeenCalled();
  });

  it('should call onClickTableActions', () => {
    spyOn(component.clickTableActions, 'emit');
    const event = 'test';
    component.onClickTableActions(event);
    expect(component.clickTableActions.emit).toHaveBeenCalledWith(event);
  });

  it('should call onChangeTableActions', () => {
    spyOn(component.changeTableActions, 'emit');
    const event = 'test';
    component.onChangeTableActions(event);
    expect(component.changeTableActions.emit).toHaveBeenCalledWith(event);
  });

  it('should call onLinkClick', () => {
    spyOn(component.linkClick, 'emit');
    const event = { name: 'test' };
    component.onLinkClick(event);
    expect(component.linkClick.emit).toHaveBeenCalledWith(event);
  });

  it('should call onSwitchChange', () => {
    spyOn(component.switchChange, 'emit');
    const event = { name: 'test' };
    component.onSwitchChange(event, null);
    expect(component.switchChange.emit).toHaveBeenCalled();
  });

  it('should call onRowSelect', () => {
    spyOn(component.rowSelect, 'emit');
    const event = 'test';
    const selectedRows = ['selectedRows'];
    component.onRowSelect(event, selectedRows);
    expect(component.rowSelect.emit).toHaveBeenCalledWith({ event, selectedRows });
  });

  it('should call onRowUnselect', () => {
    spyOn(component.rowUnselect, 'emit');
    const event = 'test';
    const selectedRows = ['selectedRows'];
    component.onRowUnselect(event, selectedRows);
    expect(component.rowUnselect.emit).toHaveBeenCalled();
  });

  it('should call onChangeActions', () => {
    spyOn(component.changeActions, 'emit');
    const event = 'test';
    const selectedRows = 'selectedRows';
    const rowIndex = 1;
    component.onChangeActions(event, selectedRows, rowIndex);
    expect(component.changeActions.emit).toHaveBeenCalled();
  });

  it('should call onDropdownFilterChanged', () => {
    spyOn(component.dropdownFilterChanged, 'emit');
    const field = 'field';
    const value = 'value';
    component.onDropdownFilterChanged(field, value);
    expect(component.dropdownFilterChanged.emit).toHaveBeenCalledWith({ field, value });
  });

  it('should call onDeleteButtonClick', () => {
    spyOn(component.deleteButtonClick, 'emit');
    const event = 'test';
    const rowData = { name: 'rowData' };
    component.onDeleteButtonClick(event, rowData);
    expect(component.deleteButtonClick.emit).toHaveBeenCalledWith({ event, rowData });
  });

  it('should call onCheckboxChange', () => {
    spyOn(component.checkboxChange, 'emit');
    const event = 'test';
    const selectedRows = ['selectedRows'];
    component.selectedChilds = ['test'];
    component.onCheckboxChange(event, selectedRows, component.selectedChilds);
    expect(component.checkboxChange.emit).toHaveBeenCalledWith({ event, selectedRows, selectedChilds: ['test'] });
  });

  it('should call onFilterInner', () => {
    spyOn(component.filter, 'emit');
    const event = 'test';
    component.onFilterInner(event);
    expect(component.filter.emit).toHaveBeenCalledWith(event);
  });

  it('should call currentPageReportTemplate when totalRecords = 1', () => {
    component.translateResults.SHOWING_RECORD = 'test {0} {1} test';
    component.dataTable.totalRecords = 1;
    const rs = component.currentPageReportTemplate;
    expect(rs).toEqual('test 1 1 test');
  });

  it('should call onShowColDialog', () => {
    component.colHidingDialogSimpleConfig.displayDialog = false;
    component.showColumnDialog();
    expect(component.colHidingDialogSimpleConfig.displayDialog).toBeTruthy();
  });

  // it('should call pipeDateCalendar', () => {
  //   component.cols = [{
  //     field: 'test',
  //     header: 'test',
  //     type: FilterTypes.Calendar,
  //     options: {
  //       format: 'format'
  //     },
  //   }];
  //   component.isSupportGrouping = true;
  //   component.data = [{ test: 'test', children: [{ test: 'child' }] }];
  //   spyOn(component.datePipe, 'transform');
  //   component.pipeDateCalendar();
  //   expect(component.datePipe.transform).toHaveBeenCalledWith('test', 'format');
  // });

  // it('should call pipeDateCalendar without format', () => {
  //   component.cols = [{
  //     field: 'field',
  //     header: 'header',
  //     type: FilterTypes.Calendar,
  //     options: {},
  //   }];
  //   component.formatDate = 'UTC test';
  //   const date = new Date();
  //   component.data = [{ field: date.getTime() }];
  //   spyOn(component.datePipe, 'transform');
  //   component.pipeDateCalendar();
  //   expect(component.datePipe.transform).toHaveBeenCalledWith(date.getTime() + (date.getTimezoneOffset() * 60000), 'test');
  // });

  it('should call pipeDateRangeCalendar', () => {
    component.cols = [{
      field: 'field',
      header: 'header',
      type: FilterTypes.DateRange,
      options: {
        format: 'format'
      },
      startDate: 'startDate',
      endDate: 'endDate'
    }];
    component.data = [{}];
    component.pipeDateRangeCalendar();
    expect(component.data[0].field).toEqual('N/A');
  });

  it('should set selectedRows when select parent with unselect row', () => {
    component.tableOptions = {
      dataKey: 'id'
    };
    component.isSupportGrouping = true;
    component.selectedChilds = [child];
    component.selectedRows = [parent];
    component.onCheckboxParent(false, parent);
    expect(component.selectedChilds.length).toEqual(0);
  });

  it('should set all select when change checkbox header', () => {
    component.tableOptions = {
      dataKey: 'id'
    };
    component.data = [parent];
    component.isSupportGrouping = true;
    component.selectedRows = [JSON.parse(JSON.stringify(parent))];
    component.tableOptions = { usingTriStateCheckbox: true };
    spyOnProperty(component, 'currentRecords').and.returnValue(1);
    component.onCheckboxHeader(true);
    expect(component.selectedChilds.length).toEqual(2);
  });

  it('should has triCheckboxValue', () => {
    component.triStateCheckbox.setValue(true);
    component.tableOptions = { usingTriStateCheckbox: true };
    const rs = component.triCheckboxValue;
    expect(rs).toBeTruthy();
  });

  it('should call pipeDateRangeCalendar and have startDate & endDate', () => {
    component.cols = [{
      field: 'field',
      header: 'header',
      type: FilterTypes.DateRange,
      options: {
        format: 'format'
      },
      startDate: 'startDate',
      endDate: 'endDate'
    }];
    component.formatDate = 'UTC test';
    const date = new Date();
    component.data = [{ startDate: date.getTime(), endDate: date.getTime() }];
    spyOn(component.datePipe, 'transform');
    component.pipeDateRangeCalendar();
    expect(component.datePipe.transform).toHaveBeenCalledTimes(2);
  });

  it('should call pipeDateRangeCalendar without format and have startDate & endDate', () => {
    component.cols = [{
      field: 'field',
      header: 'header',
      type: FilterTypes.DateRange,
      options: {},
      startDate: 'startDate',
      endDate: 'endDate'
    }];
    component.formatDate = 'UTC test';
    const date = new Date();
    component.data = [{ startDate: date.getTime(), endDate: date.getTime() }];
    spyOn(component.datePipe, 'transform');
    component.pipeDateRangeCalendar();
    expect(component.datePipe.transform).toHaveBeenCalledTimes(2);
  });
  it('should has checkboxClass is tri-checkbox-check', () => {
    component.triStateCheckbox.setValue(true);
    component.tableOptions = { usingTriStateCheckbox: true };
    const rs = component.checkboxClass;
    expect(rs).toEqual('tri-checkbox-check');
  });

  it('should has checkboxClass is tri-checkbox-double', () => {
    component.triStateCheckbox.setValue(false);
    component.tableOptions = { usingTriStateCheckbox: true };
    const rs = component.checkboxClass;
    expect(rs).toEqual('tri-checkbox-double');
  });

  it('should has checkboxClass is tri-checkbox', () => {
    component.triStateCheckbox.setValue(null);
    component.tableOptions = { usingTriStateCheckbox: true };
    const rs = component.checkboxClass;
    expect(rs).toEqual('tri-checkbox');
  });

  it('should call onRowUnselectInner', () => {
    spyOn(component, 'onCheckboxParent');
    const event = {
      data: parent
    };
    component.data = [parent];
    component.onRowUnselectInner(event);
    expect(component.onCheckboxParent).toHaveBeenCalled();
  });

  it('should call onRowSelectInner', () => {
    spyOn(component, 'onCheckboxParent');
    component.isSupportGrouping = true;
    component.selectedRows = [parent];
    component.selectedChilds = [];
    component.tableOptions = {
      dataKey: 'id'
    };
    const event = {
      data: parent,
      index: 0
    };
    component.data = [parent];
    component.onRowSelectInner(event);
    expect(component.onCheckboxParent).toHaveBeenCalled();
  });

  it('should call updateCheckboxStatus when has filteredValue', () => {
    component.triStateCheckbox.setValue(true);
    component.selectedRows = [];
    component.data = [JSON.parse(JSON.stringify(parent))];
    spyOnProperty(component, 'currentRecords').and.returnValue(1);
    const table: any = {
      first: 0,
      filteredValue: [{ ...JSON.parse(JSON.stringify(parent)), selected: false }]
    };
    component.tableOptions = {
      dataKey: 'id',
      usingTriStateCheckbox: true
    };
    component.dataTable = table;
    component.updateCheckboxStatus();
    expect(component.triCheckboxValue).toBeFalsy();
  });

  it('should call updateCheckboxStatus when has filteredValue and selected all', () => {
    component.triStateCheckbox.setValue(true);
    component.selectedRows = [parent];
    component.data = [parent];
    spyOnProperty(component, 'currentRecords').and.returnValue(1);
    const table: any = {
      first: 0
    };
    component.tableOptions = {
      dataKey: 'id',
      usingTriStateCheckbox: true
    };
    component.dataTable = table;
    component.updateCheckboxStatus();
    expect(component.triCheckboxValue).toBeFalsy();
  });

  it('should call updateCheckboxStatus when has data = []', () => {
    component.triStateCheckbox.setValue(true);
    component.selectedRows = [];
    component.data = [];
    spyOnProperty(component, 'currentRecords').and.returnValue(1);
    const table: any = {
      first: 0
    };
    component.tableOptions = {
      dataKey: 'id',
      usingTriStateCheckbox: true
    };
    component.dataTable = table;
    component.updateCheckboxStatus();
    expect(component.triCheckboxValue).toBeNull();
  });

  it('should call onTriCheckboxChanged when status = true', () => {
    component.tableOptions = { selectionMode: 'multiple' };
    spyOnProperty(component, 'currentRecords').and.returnValue(1);
    const parent1 = JSON.parse(JSON.stringify(parent));
    parent1.id = 2323;
    component.selectedRows = [];
    component.data = [parent, parent1];
    component.onTriCheckboxChanged(true);
    expect(component.selectedRows[0].id).toEqual(parent.id);
  });

  it('should call onTriCheckboxChanged when status = false', () => {
    component.tableOptions = { selectionMode: 'multiple' };
    const parent1 = JSON.parse(JSON.stringify(parent));
    parent1.id = 2323;
    component.selectedRows = [parent];
    component.data = [parent, parent1];
    component.onTriCheckboxChanged(false);
    expect(component.selectedRows.length).toEqual(2);
  });

  it('should call onTriCheckboxChanged when status = null', () => {
    component.tableOptions = { selectionMode: 'multiple' };
    const parent1 = JSON.parse(JSON.stringify(parent));
    parent1.id = 2323;
    component.selectedRows = [parent];
    component.data = [parent, parent1];
    component.onTriCheckboxChanged(null);
    expect(component.selectedRows.length).toEqual(0);
  });

  it('should call onCheckboxParent when unselected children', () => {
    spyOn(component, 'updateCheckboxStatus');
    component.isSupportGrouping = true;
    component.selectedChilds = [6];
    component.tableOptions = { selectionMode: 'multiple', dataKey: 'id' };
    component.selectedRows = [parent];
    component.data = [parent];
    component.onCheckboxParent(false, parent, 0);
    expect(component.selectedChilds.length).toEqual(1);
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should call selectChildRow', () => {
    spyOn(component, 'updateCheckboxStatus');
    component.isSupportGrouping = true;
    component.selectedChilds = [];
    component.tableOptions = { selectionMode: 'multiple', dataKey: 'id' };
    component.selectedRows = [parent];
    component.data = [parent];
    component.selectChildRow('', parent, 0);
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should call selectChildRow when parent has been not selected', () => {
    parent.selected = false;
    spyOn(component, 'updateCheckboxStatus');
    component.isSupportGrouping = true;
    component.selectedChilds = [...parent.children];
    component.tableOptions = { selectionMode: 'multiple', dataKey: 'id' };
    component.selectedRows = [];
    component.data = [parent];
    component.selectChildRow('', parent, 0);
    expect(parent.selected).toBeTruthy();
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should call triggerCheckbox', () => {
    component.data = [parent];
    const currentCols = JSON.parse(JSON.stringify(cols));
    currentCols.splice(1, 0,
      {
        field: FieldName.Checkbox,
        colsEnable: true,
        header: ''
      },
      {
        field: 'rowGroup',
        colsEnable: true,
        header: 'rowGroup'
      },
      {
        field: 'id',
        colsEnable: true,
        header: 'id'
      });
    currentCols.map(x => x.canExpand = false);
    component.cols = currentCols.filter(x => x.field !== FieldName.Expand);
    component.tableOptions = { selectionMode: 'multiple', dataKey: 'id' };
    component.isSupportGrouping = true;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('#chevronIcon'));
    if (icon) {
      icon.nativeElement.click();
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('.child-row'));
      spyOn(component, 'selectChildRow');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(component.selectChildRow).toHaveBeenCalled();
    }
  });

  it('should call triggerCheckbox when child has been selected', () => {
    const item = { test: 'string' };
    component.tableOptions.dataKey = 'test';
    component.selectedChilds = [item];
    component.triggerCheckbox(item);
    expect(component.selectedChilds.length).toEqual(0);
  });

  it('should call ngOnChanges with isSupportGrouping = false ', () => {
    const currentCols = JSON.parse(JSON.stringify(cols));
    currentCols.splice(1, 0,
      {
        field: FieldName.Checkbox,
        colsEnable: true,
        header: '',
        options: { model: [] }
      },
      {
        field: 'rowGroup',
        colsEnable: true,
        header: 'rowGroup',
        options: { model: [] }
      },
      {
        field: 'id',
        colsEnable: true,
        header: 'id',
        options: { model: [] }
      });
    const length = currentCols.length;
    component.isSupportGrouping = false;
    component.triStateCheckbox.setValue(true);
    component.selectedRows = [...component.cols];
    component.ngOnChanges({ cols: new SimpleChange(undefined, currentCols, false), data: new SimpleChange(undefined, [], false) });
    expect(component.selectedRows).toBeUndefined();
    expect(component.triStateCheckbox.value).toBeNull();
    expect(component.cols.length).toBeLessThan(length);
  });

  it('selectionMode should change to mode multiple when isSupportGrouping = true', () => {
    component.tableOptions = {};
    component.isSupportGrouping = true;
    component.ngOnChanges({ cols: new SimpleChange(undefined, cols, false) });
    expect(component.tableOptions.selectionMode).toEqual('multiple');
  });

  it('should call initSelectIndexs', () => {
    component.selectedRows = [parent];
    component.data = [parent];
    component.tableOptions = {};
    component.initSelected();
    expect(component.data[0].selected).toBeTruthy();
  });

  it('should call resetPageFirst', () => {
    component.first = 10;
    const table: any = {
      first: 10
    };
    component.dataTable = table;
    component.resetPageFirst();
    expect(component.first).toEqual(0);
    expect(component.dataTable.first).toEqual(0);
  });

  it('should call paginate', () => {
    component.first = 0;
    component.paginate({
      first: 10
    });
    expect(component.first).toEqual(10);
  });

  it('should call onPage', () => {
    spyOn(component, 'updateCheckboxStatus');
    component.onPage();
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should call onFilterDropdown', () => {
    spyOn(component, 'updateCheckboxStatus');
    component.onFilterDropdown();
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should return currentRecords', () => {
    const table: any = {
      totalRecords: 6,
      first: 5,
      rows: 5
    };
    component.dataTable = table;
    expect(component.currentRecords).toBe(1);
  });

  it('should return currentRecords equal rows', () => {
    const table: any = {
      totalRecords: 6,
      first: 0,
      rows: 5
    };
    component.dataTable = table;
    expect(component.currentRecords).toBe(5);
  });

  it('should return labelTriCheckbox when triStateCheckbox value = true', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(true);
    component.translateResults = {
      TABLE: {
        SELECT_RECORDS_PAGE: 'SELECT_RECORDS_PAGE'
      }
    };
    expect(component.labelTriCheckbox).toBe('SELECT_RECORDS_PAGE');
  });

  it('should return labelTriCheckbox when triStateCheckbox value = false', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(false);
    component.translateResults = {
      TABLE: {
        SELECT_ALL_RECORDS: 'SELECT_ALL_RECORDS'
      }
    };
    expect(component.labelTriCheckbox).toBe('SELECT_ALL_RECORDS');
  });

  it('should return labelTriCheckbox when triStateCheckbox value = null', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(null);
    component.translateResults = {
      TABLE: {
        UNSELECT_ALL_RECORDS: 'UNSELECT_ALL_RECORDS'
      }
    };
    expect(component.labelTriCheckbox).toBe('UNSELECT_ALL_RECORDS');
  });

  it('should return tooltipCheckbox when triStateCheckbox value = true', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(true);
    component.translateResults = {
      TABLE: {
        TOOLTIP_SELECT_ALL: 'TOOLTIP_SELECT_ALL'
      }
    };
    expect(component.tooltipCheckbox).toBe('TOOLTIP_SELECT_ALL');
  });

  it('should return tooltipCheckbox when triStateCheckbox value = false', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(false);
    component.translateResults = {
      TABLE: {
        TOOLTIP_UNSELECT: 'TOOLTIP_UNSELECT'
      }
    };
    expect(component.tooltipCheckbox).toBe('TOOLTIP_UNSELECT');
  });

  it('should return tooltipCheckbox when triStateCheckbox value = null', () => {
    component.tableOptions.usingTriStateCheckbox = true;
    component.triStateCheckbox.setValue(null);
    component.translateResults = {
      TABLE: {
        TOOLTIP_SELECT_CURRENT_PAGE: 'TOOLTIP_SELECT_CURRENT_PAGE'
      }
    };
    expect(component.tooltipCheckbox).toBe('TOOLTIP_SELECT_CURRENT_PAGE');
  });
});
