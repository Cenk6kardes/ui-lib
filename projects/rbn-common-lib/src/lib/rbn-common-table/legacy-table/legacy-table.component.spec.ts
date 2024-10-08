import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FieldName, FilterTypes } from '../../models/common-table';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { LegacyTableComponent } from './legacy-table.component';
import { SanitizeHtmlPipe } from '../shared/base-table.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { BehaviorSubject } from 'rxjs';
import { RbnCommonTableModule } from '../rbn-common-table-lib.module';

const data = [
  {
    'vin': 'a1653d4d',
    'brand': 'Volkswagen',
    'year': new Date(2018, 0, 0).toString(),
    'color': 'White'
  },
  { 'vin': 'ddeb9b10', 'brand': 'Mercedes', 'year': new Date(2018, 0, 0).toString(), 'color': 'Green' },
  { 'vin': 'd8ebe413', 'brand': 'Jaguar', 'year': new Date(2018, 0, 0).toString(), 'color': 'Silver' },
  { 'vin': 'aab227b7', 'brand': 'Audi', 'year': new Date(2018, 0, 0).toString(), 'color': 'Black' },
  { 'vin': '631f7412', 'brand': 'Volvo', 'year': new Date(2018, 0, 0).toString(), 'color': 'Red' },
  {
    'vin': '7d2d22b0',
    'brand': 'Volkswagen',
    'year': new Date(2018, 0, 0).toString(),
    'color': 'Maroon'
  }
];

const cols: any[] = [
  {
    field: FieldName.Expand,
    colsEnable: true,
    header: ''
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
    },
    colsEnable: true
  }
];

describe('LegacyTableComponent', () => {
  let component: LegacyTableComponent;
  let fixture: ComponentFixture<LegacyTableComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

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
      declarations: [LegacyTableComponent, SanitizeHtmlPipe],
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
      translateSevice.addLangs(['en']);
      translateSevice.setDefaultLang('en');
    }
    fixture = TestBed.createComponent(LegacyTableComponent);
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
    component.onRowSelect = testFuntion;
    component.onRowUnselect = testFuntion;
    component.refreshData = testFuntion;
    component.onFilter = testFuntion;
    component.onChangeActions = testFuntion;
    component.onClose = testFuntion;
    component.onOpen = testFuntion;
    component.tableName = 'tableName';
    component.onEventRowReorder = testFuntion;
    component.dropdownFilterChanged = testFuntion;
    component.showCloseTableButton = true;
    component.onCloseTable = testFuntion;
    component.switchChange = testFuntion;
    component.customSort = testFuntion;
    component.customGlobalFilter = testFuntion;
    component.isResetRowFilter = testFuntion;
    component.data.map((item: any) => {
      item.actions = [{ label: 'Select 1', value: 'select1' }];
    });
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
    component.searchData = 'searchData';
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
    const model = ['2-SBCs'];
    const value = component.filterItemExistColMultiselect(model, mockdata);
    expect(value).toEqual(model);
  });

  it('should call setWidthCol with calendar filter column', () => {
    const col = {
      field: 'date', header: 'DateColumn', sort: true, colsEnable: true, type: FilterTypes.Calendar, data: [
        { label: 'test' }, { label: 'test' }
      ],
      options: { model: 'test', usingLink: true }
    };
    const value = component.setWidthCol(col);
    expect(value).toEqual('190px');
  });

  it('should call setWidthCol with calendar filter column', () => {
    const col = { data: [], field: FieldName.Checkbox, header: '', sort: false, colsEnable: true, options: { model: '' } };
    const value = component.setWidthCol(col);
    expect(value).toEqual('50px');
  });

  it('should call onDropdownFilterChanged', () => {
    spyOn(component, 'dropdownFilterChanged');
    component.onDropdownFilterChanged('test', 'test');
    expect(component.dropdownFilterChanged).toHaveBeenCalled();
  });

  it('should call onpanelMultiShow', () => {
    spyOn(component, 'filterItemsInMultiSelect');
    component.onpanelMultiShow();
    expect(component.filterItemsInMultiSelect).toHaveBeenCalled();
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

  it('should call onChangeCheckBoxShowCol', () => {
    rbnTableService.checkboxShowCol.next(true);
    spyOn(component, 'setDataTableToStorage');
    component.onChangeCheckBoxShowCol();
    expect(component.setDataTableToStorage).toHaveBeenCalled();
  });

  it('should call isString', () => {
    spyOn(component, 'setDataTableToStorage');
    const value = component.isString('test');
    expect(value).toBeTruthy();
  });

  it('should call onClickDropdownActions', () => {
    spyOn(component.elementTriggerClick.nativeElement, 'click');
    const event = {
      stopPropagation: () => testFuntion()
    };
    component.onClickDropdownActions(event);
    expect(component.elementTriggerClick.nativeElement.click).toHaveBeenCalled();
  });

  it('should call optionDropdown', () => {
    const col = {
      data: [],
      field: 'vin',
      header: 'Vin',
      type: FilterTypes.InputText,
      options: {
        model: ''
      },
      colsEnable: true
    };
    const value = component.optionDropdown(col);
    expect(value).toEqual([]);
  });

  it('should call onRefreshData', () => {
    spyOn(component, 'refreshData');
    component.onRefreshData();
    expect(component.refreshData).toHaveBeenCalled();
  });

  it('should call onCustomSort', () => {
    spyOn(component, 'customSort');
    component.onCustomSort('');
    expect(component.customSort).toHaveBeenCalled();
  });

  it('should call onRowReorder', () => {
    spyOn(component, 'onEventRowReorder');
    component.onRowReorder();
    expect(component.onEventRowReorder).toHaveBeenCalled();
  });

  it('should call onCustomGlobalFilter', () => {
    spyOn(component, 'customGlobalFilter');
    component.onCustomGlobalFilter('');
    expect(component.customGlobalFilter).toHaveBeenCalled();
  });

  it('should call onResetRowFilter', () => {
    spyOn(component, 'isResetRowFilter');
    component.onResetRowFilter();
    expect(component.isResetRowFilter).toHaveBeenCalled();
  });

  it('should call onSwitchChange', () => {
    spyOn(component, 'switchChange');
    component.onSwitchChange({}, null);
    expect(component.switchChange).toHaveBeenCalledWith({ event: {}, col: null });
  });

  it('should call onFilterInner', () => {
    component.onFilter = jasmine.createSpy('onFilter');
    component.onFilterInner('test');
    expect(component.onFilter).toHaveBeenCalledWith('test');
  });
});
