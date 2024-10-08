/* eslint-disable @typescript-eslint/no-empty-function */
import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ElementRef, QueryList, SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { FieldName, FilterTypes, PaginatorMode, ExpandDataMode, ExpandDisplayType, IComplexDialogConfig } from '../../models/common-table';
import { SanitizeHtmlPipe } from '../shared/base-table.component';
import { TableComponent } from './table.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { RbnCommonTableModule } from '../rbn-common-table-lib.module';

const data: Array<any> = [
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

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  const tableConfig = {
    tableName: 'Rbn-Table',
    loading: false,
    paginatorMode: PaginatorMode.Client,
    isSupportGrouping: true,
    isUsingAppendTo: true,
    tableOptions: {
      dataKey: 'brand',
      usingTriStateCheckbox: true,
      hideColumnInLib: false
    },
    actionColumnConfig: {
      actions: [
        {
          icon: 'pi pi-check', onClick: (rowData, index) => { },
          label: 'Checked'
        },
        {
          icon: 'pi pi-times', onClick: (rowData, index) => { },
          label: 'Close'
        },
        {
          icon: 'pi pi-desktop', onClick: (rowData, index) => { },
          label: 'Monitor'
        }
      ]
    }
  };
  const rbnTableService = {
    closeDialog: new BehaviorSubject(null),
    openAdvanced: new BehaviorSubject(null),
    checkboxShowCol: new BehaviorSubject(null),
    checkboxAllCols: new BehaviorSubject(null)
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
      declarations: [TableComponent, SanitizeHtmlPipe],
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
            'CHOOSE': 'Choose',
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'SELECTED_ALL_ROWS': 'Select all {0} rows',
            'DESELECT_ALL_ROWS': 'Deselect all {0} rows',
            'GO_TO_THE_FIRST_PAGE': 'Go to the first page',
            'GO_TO_THE_PREVIOUS_PAGE': 'Go to the previous page',
            'GO_TO_THE_NEXT_PAGE': 'Go to the next page',
            'GO_TO_THE_LAST_PAGE': 'Go to the last page',
            'SELECT_NUMBER_OF_ROWS': 'Select Number of Rows',
            'PAGE': 'Page'
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
            'GO_TO_THE_FIRST_PAGE': 'Go to the first page',
            'GO_TO_THE_PREVIOUS_PAGE': 'Go to the previous page',
            'GO_TO_THE_NEXT_PAGE': 'Go to the next page',
            'GO_TO_THE_LAST_PAGE': 'Go to the last page',
            'SELECT_NUMBER_OF_ROWS': 'Select Number of Rows',
            'PAGE': 'Page'
          },
          'TABLE': {
            'MESSAGE_RECORD_OF_PAGE_SELECTED': 'All {0} rows on this page are selected',
            'MESSAGE_RECORD_SELECTED': 'All {0} rows are selected',
            'FILTER_ROW_IS_SHOWING': 'Filter Row is showing',
            'FILTER_ROW_IS_HIDING': 'Filter Row is hiding'
          }
        });
      }
    }
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.tableConfig = tableConfig;
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
    component.data.map((item: any) => {
      item.actions = [{ label: 'Select 1', value: 'select1' }];
    });
    const change = {
      data: new SimpleChange(
        data,
        data,
        true
      ),
      tableConfig: new SimpleChange(tableConfig, tableConfig, true)
    };
    component.ngOnChanges(change);
  });

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

  it('should call function closeDialog', () => {
    const dataCol = [
      { header: 'header 1', field: 'field 1' },
      { header: 'header 2', field: 'field 2' }
    ];
    component.paginatorMode = 'server';
    component.closeDialog(dataCol);
    expect(component.colHidingDialogComplexConfig.displayDialog).toBeFalsy();
  });

  it('should hide column dialog', () => {
    const colHidingDialogSimpleConfig = {
      header: 'string',
      displayDialog: true,
      cols: [
        { header: 'header 1', field: 'field 1' },
        { header: 'header 2', field: 'field 2' }
      ],
      checkBoxAll: true,
      modelName: 'string',
      showAdvancedOption: true
    };
    const colHidingDialogComplexConfig: IComplexDialogConfig = {
      header: 'header',
      displayDialog: false,
      sourceHeader: 'sourceHeader',
      targetHeader: 'targetHeader'
    };
    component.colHidingDialogSimpleConfig = colHidingDialogSimpleConfig;
    component.colHidingDialogComplexConfig = colHidingDialogComplexConfig;
    component.onHideColumnDialog();
    expect(component.colHidingDialogComplexConfig?.possibleCols?.length).toEqual(6);
  });

  it('should set show cols when check box all change', () => {
    const colHidingDialogSimpleConfig = {
      header: 'string',
      displayDialog: true,
      cols: [
        { header: 'header 1', field: 'field 1' },
        { header: 'header 2', field: 'field 2' }
      ],
      checkBoxAll: true,
      modelName: 'string',
      showAdvancedOption: true
    };
    component.colHidingDialogSimpleConfig = colHidingDialogSimpleConfig;
    component.onChangeCheckBoxAllShowCol();
    expect(component.colHidingDialogSimpleConfig.cols.length).toEqual(2);
  });

  it('should set value checkbox show all cols', () => {
    const colHidingDialogSimpleConfig = {
      header: 'string',
      displayDialog: true,
      cols: [
        { header: 'header 1', field: 'field 1' },
        { header: 'header 2', field: 'field 2' }
      ],
      checkBoxAll: true,
      modelName: 'string',
      showAdvancedOption: true
    };
    component.colHidingDialogSimpleConfig = colHidingDialogSimpleConfig;
    component.setValueCheckBoxAllShowCol();
    expect(component.colHidingDialogSimpleConfig.checkBoxAll).toBeFalsy();
  });

  it('should emit pageChange', () => {
    spyOn(component.pageChanged, 'emit');
    component.onPageChanged('event');
    expect(component.pageChanged.emit).toHaveBeenCalled();
  });

  it('should emit switchChange', () => {
    spyOn(component.switchChange, 'emit');
    component.onSwitchChange({}, 'col');
    expect(component.switchChange.emit).toHaveBeenCalled();
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
      caption: false
    };
    component.tableOptions.formatDate = 'MMMM d, y, h:mm:ss a z';
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
        field: 'severity', header: '', sort: true, colsEnable: true,
        type: FilterTypes.Dropdown, data: [], options: { model: 'test' }
      }
    ];
    component.tableName = 'tabletTest';
    component.searchData = 'test';
    component.setDataTableToStorage();
    const value = sessionStorage.getItem(component.generateKey()) || '';
    expect(JSON.parse(value).globalFilter).toEqual('');
  });

  it('should call onSort', () => {
    component.first = 0;
    component.onSort();
    expect(component.dataTable.first).toEqual(0);
  });


  it('should call filterItemExistColDropdown', () => {
    const mockdata = [
      { value: 'test' }, { value: 'test1' }
    ];
    const value = component.filterItemExistColDropdown('test2', mockdata);
    expect(value).toEqual('');
  });

  it('should call removeItemStorage', () => {
    component.tableName = 'test';
    component.removeItemStorage();
    const value = sessionStorage.getItem(component.generateKey());
    expect(value).toEqual(null);
  });

  it('should call isString', () => {
    spyOn(component, 'setDataTableToStorage');
    const value = component.isString('test');
    expect(value).toBeTruthy();
  });

  it('should call onClickDropdownActions', () => {
    const event = {
      stopPropagation: () => testFuntion(),
      item: {
        icon: 'pi pi-check'
        // onClick: () => testFuntion(),
      },
      icon: 'pi pi-check',
      originalEvent: {
        stopPropagation: () => testFuntion()
      }
    };
    component.dropdownActions = tableConfig.actionColumnConfig.actions;
    component.onClickDropdownActions(event);
    expect(component.dropdownActions.length).toEqual(3);
  });

  it('should emit filter changed with data', () => {
    spyOn(component, 'emitFilterServer');
    const dataEmit = {
      filter: [],
      reset: false
    };
    component.emitFilterChanged(dataEmit);
    expect(component.emitFilterServer).toHaveBeenCalledWith(dataEmit);
  });

  it('should load column enable', () => {
    const dataCol = { header: 'col', field: 'field' };
    const columns = component.loadColumnsEnable(dataCol, ['colsEnable'], ['colsDisable']);
    expect(columns).toEqual(dataCol);
  });

  it('should handle filter input change', () => {
    spyOn(component.inputFilterChanged, 'next');
    const dataCol = { header: 'col', field: 'field', type: 2 };
    component.handleFilterInputChanges('event', 'value', dataCol);
    expect(component.inputFilterChanged.next).toHaveBeenCalled();
  });

  it('should handle filter change with input text', () => {
    spyOn(component, 'setDataTableToStorage');
    const newDataTable: any = [
      1, 2
    ];
    component.dataTable = newDataTable;
    const dataCol = { header: 'col', field: 'field', type: 2, options: { model: '' } };
    component.handleFilterChanges(() => testFuntion(), dataCol);
    expect(component.setDataTableToStorage).toHaveBeenCalled();
  });

  it('should handle filter change with select dropdown', () => {
    spyOn(component, 'setDataTableToStorage');
    const newDataTable: any = [
      1, 2
    ];
    component.dataTable = newDataTable;
    const dataCol = { header: 'col', field: 'field', type: 1, options: { model: '' } };
    component.handleFilterChanges(() => testFuntion(), dataCol);
    expect(component.setDataTableToStorage).toHaveBeenCalled();
  });

  it('should handle filter change with select multiselect', () => {
    spyOn(component, 'setDataTableToStorage');
    const newDataTable: any = [
      1, 2
    ];
    component.dataTable = newDataTable;
    const dataCol = { header: 'col', field: 'field', type: 4, options: { model: '' } };
    component.handleFilterChanges(() => testFuntion(), dataCol);
    expect(component.setDataTableToStorage).toHaveBeenCalled();
  });

  it('should handle filter change with select Calendar', () => {
    spyOn(component, 'setDataTableToStorage');
    spyOn(component, 'onDateChanged');
    const newDataTable: any = [
      1, 2
    ];
    component.dataTable = newDataTable;
    const dataCol = { header: 'col', field: 'field', type: 6, options: { model: '' } };
    component.handleFilterChanges(() => testFuntion(), dataCol);
    expect(component.onDateChanged).toHaveBeenCalled();
  });

  it('should call getColumnStyle when col = null', () => {
    component.cols = [];
    const value = component.getColumnStyle(null);
    expect(value).toEqual('none');
  });

  it('call resetFilterDropdowns when dataTable = undefined', () => {
    component.dataTable = undefined as any;
    const rs = component.resetFilterDropdowns();
    expect(rs).toBeUndefined();
  });

  it('should call resetFilter', () => {
    spyOn(component, 'resetFilterDropdowns');
    spyOn(component, 'setDataTableToStorage');
    spyOn(component.dataTable, 'filterGlobal');
    component.resetFilter();
    expect(component.resetFilterDropdowns).toHaveBeenCalled();
    expect(component.dataTable.filterGlobal).toHaveBeenCalled();
  });

  it('should call getDropdownHeight when dropdownItems = undefined', () => {
    const rs = component.getDropdownHeight(undefined);
    expect(rs).toEqual('0');
  });

  it('should call onFilter', () => {
    spyOn(component.filter, 'emit');
    const event = 'test';
    component.onFilter(event);
    expect(component.filter.emit).toHaveBeenCalledWith(event);
  });

  it('should call onFilterInner', () => {
    spyOn(component, 'onFilter');
    const event = {
      filteredValue: data
    };
    component.onFilterInner(event);
    expect(component.onFilter).toHaveBeenCalledWith(event);
  });

  it('should set show more Action index', () => {
    component.showMoreActions(1);
    expect(component.showMoreActionsIndex).toEqual(1);
  });

  it('should set selected dropdown action index', () => {
    const dataTest = { id: 2 };
    component.onDropdownClick(dataTest, 1);
    expect(component.selectedDropdownActionIndex).toEqual(1);
    expect(component.selectedDropdownActionData).toEqual(dataTest);
  });

  it('should set display dialog', () => {
    component.colHidingDialogComplexConfig = {
      header: 'header',
      displayDialog: false,
      sourceHeader: 'sourceHeader',
      targetHeader: 'targetHeader'
    };
    component.showColumnDialog();
    expect(component.colHidingDialogComplexConfig.displayDialog).toBeTruthy();
  });

  it('should call onCustomGlobalFilter', () => {
    spyOn(component.customGlobalFilter, 'emit');
    const event = 'test';
    component.onCustomGlobalFilter(event);
    expect(component.customGlobalFilter.emit).toHaveBeenCalledWith(event);
  });

  it('should call onCustomSort', () => {
    spyOn(component.customSort, 'emit');
    component.onCustomSort();
    expect(component.customSort.emit).toHaveBeenCalled();
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
    component.onLinkClick(event, 'fieldName');
    expect(component.linkClick.emit).toHaveBeenCalled();
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

  it('should be items contextmenu', () => {
    const rowdata = {
      actions: [
        {
          label: 'Search'
        }
      ]
    };
    const cm = null;
    component.onRightClick(rowdata, cm);
    expect(component.itemsContextMenu[0].label).toEqual('Search');
  });

  it('should be clear style items contextmenu', () => {
    component.itemsContextMenu = [
      {
        label: 'search',
        style: { background: 'red' }
      }
    ];
    component.clearStyleContextMenu();
    expect(component.itemsContextMenu[0].style).toEqual({});
  });

  it('should call onCheckboxChange', () => {
    spyOn(component.checkboxChange, 'emit');
    const event = 'test';
    const selectedRows = ['selectedRows'];
    const selectedChilds = ['selectedChilds'];
    component.onCheckboxChange(event, selectedRows, selectedChilds);
    expect(component.checkboxChange.emit).toHaveBeenCalledWith({ event, selectedRows, selectedChilds });
  });

  it('should call currentPageReportTemplate when totalRecords = 1', () => {
    component.translateResults.SHOWING_RECORD = 'test {0} {1} test';
    component.dataTable.totalRecords = 1;
    const rs = component.currentPageReportTemplate;
    expect(rs).toEqual('test 1 1 test');
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
  //   component.data = [{ test: 'test' }];
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

  it('should call ngOnChanges with isSupportGrouping = false ', () => {
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
    const length = currentCols.length;
    component.isSupportGrouping = false;
    component.ngOnChanges({ cols: new SimpleChange(undefined, currentCols, false) });
    expect(component.cols.length).toBeLessThan(length);
  });

  it('selectionMode should change to mode multiple when isSupportGrouping = true', () => {
    component.tableOptions = {};
    component.isSupportGrouping = true;
    component.ngOnChanges({ cols: new SimpleChange(undefined, cols, false) });
    expect(component.tableOptions.selectionMode).toEqual('multiple');
  });

  it('should call onCheckboxHeader', () => {
    spyOn(component, 'onCheckboxChanged');
    component.clientMode = true;
    component.onCheckboxHeader();
    expect(component.onCheckboxChanged).toHaveBeenCalled();
  });

  it('should call onCheckboxChanged with selectAll', () => {
    spyOn(component, 'updateSelectCurrentPage');
    component.dataTable.filteredValue = [];
    component.onCheckboxChanged(true);
    expect(component.updateSelectCurrentPage).toHaveBeenCalled();
  });

  it('should call onCheckboxChanged with pCkeck = false', () => {
    fixture.detectChanges();
    spyOn(component, 'updateSelectCurrentPage');
    component.dataTable.filteredValue = [];
    component.pCheckbox = false;
    component.data = data;
    component.onCheckboxChanged();
    expect(component.updateSelectCurrentPage).toHaveBeenCalled();
  });

  it('should call onPage', () => {
    spyOn(component, 'updateCheckboxStatus');
    component.onPage();
    expect(component.updateCheckboxStatus).toHaveBeenCalled();
  });

  it('should call updateCheckboxStatus', () => {
    spyOn(component, 'updateSelectCurrentPage');
    component.selectedRows = [{
      vin: 'a1653d4d',
      brand: 'Volkswagen',
      year: new Date(2018, 0, 0).toString(),
      color: 'White',
      issues: new Date(2018, 0, 0).toString()
    }];
    component.dataTable.filteredValue = [{
      vin: 'a1653d4d',
      brand: 'Volkswagen',
      year: new Date(2018, 0, 0).toString(),
      color: 'White',
      issues: new Date(2018, 0, 0).toString()
    }];
    component.data = data;
    component.updateCheckboxStatus();
    expect(component.updateSelectCurrentPage).toHaveBeenCalled();
  });

  it('should call updateCheckboxStatus with dataTable.filteredValue = null', () => {
    spyOn(component, 'updateSelectCurrentPage');
    component.selectedRows = [{
      vin: 'a1653d4d',
      brand: 'Volkswagen',
      year: new Date(2018, 0, 0).toString(),
      color: 'White',
      issues: new Date(2018, 0, 0).toString()
    }];
    component.dataTable.filteredValue = [];
    component.data = data;
    component.updateCheckboxStatus();
    expect(component.updateSelectCurrentPage).toHaveBeenCalled();
  });

  it('should call hasCheckbox and return false', () => {
    component.cols = [{ field: 'test' }] as any;
    const rs = component.hasCheckbox();
    expect(rs).toBeFalsy();
  });

  it('should call hasCheckbox and return true', () => {
    component.cols = [{ field: FieldName.Checkbox }] as any;
    const rs = component.hasCheckbox();
    expect(rs).toBeTruthy();
  });


  it('should call updateVariables when tableConfig is not table children', () => {
    component.tableConfig = tableConfig;
    expect(component.tableConfig.isTableChildren).toBeFalse();
  });

  it('should call getColSpanOfRowGroup when call onChangeCheckBoxShowCol', () => {
    spyOn(rbnTableService.checkboxShowCol, 'next');
    spyOn(component, 'getColSpanOfRowGroup');
    component.onChangeCheckBoxShowCol();
    expect(component.getColSpanOfRowGroup).toHaveBeenCalled();
  });

  it('should call onRowExpand', () => {
    component.parentData = {
      data: {
        children: [{ selected: false }],
        dataExpand: [{ title: 'test', value: 'value' }]
      }
    };
    component.expandedRows = { brand: 'Test' };
    component.tableConfig = tableConfig;
    if (component.tableConfig.tableOptions) {
      component.tableConfig.tableOptions.dataKey = 'brand';
    }

    component.onRowExpand({
      data: {
        brand: 'Honda'
      }
    });
    expect(component.isExpanded).toBeFalsy();
    expect(Object.keys(component.expandedRows).length).toEqual(0);
    expect(component.parentData.dataExpand).toBeUndefined();
  });

  it('should call removeChild', () => {
    const child = { selected: false };
    const parentData = {
      children: [child]
    };
    component.selectedChilds = [child];
    component.removeChild(parentData);
    expect(component.selectedChilds.length).toEqual(0);
    expect(parentData.children).toBeUndefined();
  });

  it('should call onRowCollapse', () => {
    component.expandedRows = {};
    component.onRowCollapse('');
    expect(component.isExpanded).toBeFalsy();
  });

  it('should emit changeInputNumber', () => {
    spyOn(component.changeInputNumber, 'emit');
    component.onChangeInputNumber({}, 'col');
    expect(component.changeInputNumber.emit).toHaveBeenCalled();
  });

  it('should check func isExpandRowData', () => {
    component.expandDataMode = '';
    component.expandDisplayType = '';
    expect(component.isExpandRowData()).toBeFalsy();
    component.expandDataMode = ExpandDataMode.Client;
    component.expandDisplayType = ExpandDisplayType.Table;
    expect(component.isExpandRowData()).toBeTruthy();
  });

  it('should check func checkEnableExpandIcon(false)', () => {
    const rowData = { dataExpand: ['dataExpand'] };
    component.expandDataMode = '';
    component.expandDisplayType = '';
    expect(component.checkEnableExpandIcon(rowData)).toBeFalsy();
    component.isSupportGrouping = false;
    expect(component.checkEnableExpandIcon(rowData)).toBeFalsy();
  });

  it('should check func checkEnableExpandIcon(true)', () => {
    const rowData = { dataExpand: ['dataExpand'], rowExpand: true };
    component.isSupportGrouping = true;
    component.expandDataMode = ExpandDataMode.Client;
    component.expandDisplayType = ExpandDisplayType.TabView;
    expect(component.checkEnableExpandIcon(rowData)).toBeTruthy();
    component.expandDataMode = ExpandDataMode.Server;
    component.expandDisplayType = ExpandDisplayType.TabView;
    expect(component.checkEnableExpandIcon(rowData)).toBeTruthy();
    component.expandDataMode = ExpandDataMode.Server;
    component.expandDisplayType = ExpandDisplayType.Table;
    expect(component.checkEnableExpandIcon(rowData)).toBeTruthy();
  });

  it('should check func isExpandClientMode', () => {
    component.expandDataMode = ExpandDataMode.Server;
    expect(component.isExpandClientMode()).toBeFalsy();
    component.expandDataMode = ExpandDataMode.Client;
    expect(component.isExpandClientMode()).toBeTruthy();
    component.expandDataMode = '';
    expect(component.isExpandClientMode()).toBeFalsy();
  });

  it('should check func expandServer', () => {
    component.expandDataMode = ExpandDataMode.Client;
    expect(component.isExpandServerMode()).toBeFalsy();
    component.expandDataMode = ExpandDataMode.Server;
    expect(component.isExpandServerMode()).toBeTruthy();
  });

  it('should check func emitRowData', () => {
    const rowData = { dataExpand: ['dataExpand'] };
    const colExpand = document.createElement('div');
    spyOn(component.fetchChildItem, 'emit');
    component.expandDataMode = ExpandDataMode.Server;
    component.emitRowData(true, rowData, colExpand);
    expect(component.fetchChildItem.emit).toHaveBeenCalled();
  });

  it('should call func setLoadingTable check loading = false', () => {
    component.setLoadingTable(true);
    expect(component.loading).toBeFalsy();
  });

  it('should call func setLoadingTable check loading = true', () => {
    component.expandDataMode = ExpandDataMode.Server;
    component.expandDisplayType = ExpandDisplayType.Table;
    component.setLoadingTable(false);
    expect(component.loading).toBeTruthy();
  });

  it('should call func setDropdownDataCols and update cols when update data', () => {
    const currentData = JSON.parse(JSON.stringify(data));
    currentData.push({
      vin: 'demo1',
      brand: 'demoBrand1',
      year: new Date(2018, 0, 0).toString(),
      color: 'White',
      issues: new Date(2018, 0, 0).toString()
    },
    {
      vin: 'demo2',
      brand: 'demoBrand2',
      year: new Date(2018, 0, 0).toString(),
      color: 'Green',
      issues: new Date(2018, 0, 0).toString()
    });
    component.setDropdownDataCols(currentData);
    expect(component.cols[4].data?.length).toEqual(8);
    expect(component.cols[5].data?.length).toEqual(6);
  });

  it('should call func allowKeepSelectedRows', () => {
    component.paginatorMode = PaginatorMode.Server;
    component.tableConfig.keepSelectedRows = true;
    let result = component.allowKeepSelectedRows();
    expect(result).toBeTrue();
    component.paginatorMode = PaginatorMode.Client;
    result = component.allowKeepSelectedRows();
    expect(result).toBeTrue();
  });

  it('should call func handleSelectedRows when page changed data', fakeAsync(() => {
    spyOn(component, 'allowKeepSelectedRows').and.returnValue(true);
    component.isPageChange = true;
    component.dataTable.totalRecords = 2;
    component.dataTable.first = 0;
    component.dataTable.rows = 2;
    component.paginatorMode = PaginatorMode.Server;
    spyOn(component.elementRef.nativeElement, 'querySelectorAll').and.returnValue(['test', 'test']);
    component.handleSelectedRows(true);
    tick();
    expect(component.isPageChange).toBeFalse();
  }));

  it('should call func handleSelectedRows when page changed config', fakeAsync(() => {
    spyOn(component, 'allowKeepSelectedRows').and.returnValue(true);
    component.isPageChange = true;
    component.dataTable.totalRecords = 2;
    component.dataTable.first = 0;
    component.dataTable.rows = 2;
    component.paginatorMode = PaginatorMode.Server;
    spyOn(component.elementRef.nativeElement, 'querySelectorAll').and.returnValue(['test', 'test']);
    component.handleSelectedRows();
    tick();
    expect(component.pCheckbox).toBeTrue();
    expect(component.isPageChange).toBeTrue();
  }));

  it('should call func handleSelectedRows when table changed data', () => {
    spyOn(component, 'allowKeepSelectedRows').and.returnValue(false);
    component.isPageChange = true;
    component.paginatorMode = PaginatorMode.Server;
    component.handleSelectedRows();
    expect(component.selectedRowsTemp.length).toEqual(0);
    expect(component.selectedRows?.length).toEqual(0);
    expect(component.pCheckbox).toBeFalse();
  });

  it('should call func addAriaLabelForPaginator', () => {
    fixture.detectChanges();
    const paginatorType = component.paginatorModeElement ? component.paginatorModeElement : component.dataTable.el;
    component.addAriaLabelForPaginator(paginatorType);

    // case for button paginator
    const paginator = paginatorType.nativeElement.querySelectorAll('.p-paginator-element');
    if (paginator[0].classList.contains('p-paginator-first')) {
      expect(paginator[0].ariaLabel).toEqual(component.translateResults.GO_TO_THE_FIRST_PAGE);
    } else if (paginator[1].classList.contains('p-paginator-prev')) {
      expect(paginator[1].ariaLabel).toEqual(component.translateResults.GO_TO_THE_PREVIOUS_PAGE);
    } else if (paginator[3].classList.contains('p-paginator-next')) {
      expect(paginator[3].ariaLabel).toEqual(component.translateResults.GO_TO_THE_NEXT_PAGE);
    } else if (paginator[4].classList.contains('p-paginator-last')) {
      expect(paginator[4].ariaLabel).toEqual(component.translateResults.GO_TO_THE_LAST_PAGE);
    } else {
      paginator[2].ariaLabel = component.translateResults.PAGE + paginator[2].textContent;
    }

    // case for dropdown row per page paginator
    const rowPerPagePaginator = paginatorType.nativeElement.querySelector('.p-paginator .p-inputwrapper-filled input');
    expect(rowPerPagePaginator.ariaLabel).toEqual(component.translateResults.SELECT_NUMBER_OF_ROWS);
  });

  it('should call func configFrozen', () => {
    component.configFrozen();
    expect(component).toBeTruthy();
  });

  it('should call func frozenCol', () => {
    const ev = new Event('click');
    spyOn(ev, 'preventDefault');
    const col = {
      frozen: undefined
    };
    component.tableConfig.allowFrozenColumn = true;
    component.frozenCol(ev, null, col);
    expect(ev.preventDefault).toHaveBeenCalled();
  });

  it('should call func executeFrozen', () => {
    spyOn(component, 'configFrozen');
    const index = 1;
    component.executeFrozen(index, component.cols[1]);
    expect(component.configFrozen).toHaveBeenCalled();
  });

  it('should call func onChangeFrozen', () => {
    spyOn(component, 'executeFrozen');
    const col = {
      field: 'action',
      frozen: false
    };
    component.onChangeFrozen(col);
    expect(component.executeFrozen).toHaveBeenCalled();
  });

  it('should call liveAnnouncer.announce on toggle Filter Row', () => {
    spyOn(component.liveAnnouncer, 'announce');
    component.toggleFilterRow();
    expect(component.liveAnnouncer.announce).toHaveBeenCalled();
  });

  it('should set TabIndex for usingLink span', () => {
    component.cols.filter(item => item.field === 'vin')[0].options = {usingLink: true};
    component.data = [
      {
        vin: [
          'aaaaaaaaaaaaaaaaaaaaa',
          'bbbbbbbbbbbbbbbbbbbbb'
        ],
        brand: 'Mercedes',
        year: new Date(2018, 0, 0).toString(),
        color: 'Green', issues: new Date(2018, 0, 0).toString()
      }
    ] as any;
    fixture.detectChanges();
    component.setUsingLinkSpanTabIndex();
    const showingSpan = component.dataTable.el?.nativeElement.querySelector('#Rbn-TableLink_Vin_aaaaaaaaaaaaaaaaaaaaa');
    const hiddenSpan = component.dataTable.el?.nativeElement.querySelector('#Rbn-TableLink_Vin_bbbbbbbbbbbbbbbbbbbbb');
    expect(showingSpan.tabIndex).toEqual(0);
    expect(hiddenSpan.tabIndex).toEqual(-1);
  });

  it('should change table cols to the reorder cols by storage', () => {
    const colsEnableStorage = ['vin', 'year'];
    const reorderColsByStorage = component.cols.filter(col => colsEnableStorage.includes(col.field));
    component.loadReorderColsByStorage(colsEnableStorage);
    expect(component.cols).toEqual(reorderColsByStorage);
  });

  it('should call ResizeObserver on setting ellipsis element\'s style', () => {
    const mockQueryList: QueryList<ElementRef<any>> = new QueryList<ElementRef<any>>();
    mockQueryList.reset([{ nativeElement: {} }, { nativeElement: {} }]);
    component.headerSortCols = mockQueryList;
    component.headerCols = mockQueryList;
    component.tempTxts = mockQueryList;
    component.tempTxt2s = mockQueryList;
    spyOn(window, 'ResizeObserver').and.returnValue({
      observe: jasmine.createSpy('observe'),
      disconnect: () => void {},
      unobserve: () => void {}
    });
    component.setEllipsisElStyle();
    expect(window.ResizeObserver).toHaveBeenCalled();
  });

  it('should call clearAllRows', () => {
    spyOn(component, 'resetFilterDropdowns');
    component.clearAllRows();
    expect(component.data.length).toBe(0);
    expect(component.resetFilterDropdowns).toHaveBeenCalled();
  });

  it('should call func disableUsingLink', () => {
    const rowData = {...data[0]};
    rowData.disableLinks = [{colName: 'vin'}];
    const falseCase = component.disableUsingLink('vin', rowData);
    expect(falseCase).toBeTrue();
    const trueCase = component.disableUsingLink('vin', {...data[0]});
    expect(trueCase).toBeFalse();
  });
});
