import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PickListComponent } from './pick-list.component';
import { TypeHide, TypePickList } from './model';
import { PickListTableModule } from './pick-list.module';

describe('PickListComponent', () => {
  let component: PickListComponent;
  let fixture: ComponentFixture<PickListComponent>;
  let originalTimeout: number;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    window.sessionStorage.clear();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        PickListTableModule
      ],
      declarations: [PickListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(PickListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    spyOn(component, 'setColsPickList');
    const changes: SimpleChanges = {
      paginatorConfig: {
        currentValue: [
          {
            id: TypePickList.SOURCE
          },
          {
            id: TypePickList.TARGET
          }
        ],
        firstChange: true,
        isFirstChange: () => true,
        previousValue: ''
      },
      cols: {
        currentValue: [],
        firstChange: true,
        isFirstChange: () => true,
        previousValue: ''
      }
    };
    component.ngOnChanges(changes);
    expect(component.setColsPickList).toHaveBeenCalled();
  });

  it('should call ngOnChanges, with change dataSource', () => {
    const changes: SimpleChanges = {
      dataSource: {
        currentValue: [{name: 'item1'}],
        firstChange: true,
        isFirstChange: () => true,
        previousValue: []
      }
    };
    component.ngOnChanges(changes);
    expect(component.dataSource[0]?.primaryKey).toEqual(0);
  });

  it('should call ngOnChanges, with change dataSource', () => {
    const changes: SimpleChanges = {
      dataTarget: {
        currentValue: [{name: 'item2'}],
        firstChange: true,
        isFirstChange: () => true,
        previousValue: []
      }
    };
    component.ngOnChanges(changes);
    expect(component.dataTarget[0]?.primaryKey).toEqual(0);
  });

  it('should call setColsPickList', () => {
    component.cols = [
      {
        typeHide: TypeHide.SOURCE,
        field: '',
        header: ''
      },
      {
        typeHide: TypeHide.TARGET,
        field: '',
        header: ''
      },
      {
        typeHide: TypeHide.ALL,
        field: '',
        header: ''
      },
      {
        field: '',
        header: ''
      }
    ];
    component.setColsPickList();
    expect(component.colsSource.length).toEqual(2);
    expect(component.colsTarget.length).toEqual(2);
  });

  it('should call pickItemsToRight', () => {
    spyOn(component, 'emitResultData');
    component.selectedRowsSource = ['item1', 'item2'];
    component.dataSource = ['item1', 'item2', 'item3', 'item4'];
    component.dataTarget = [];
    component.paginatorConfigTarget = {
      totalRecords: 0,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    component.pickItemsToRight();
    expect(component.emitResultData).toHaveBeenCalled();
    expect(component.dataTarget.length).toEqual(2);
  });

  it('should call pickAllToRight', () => {
    spyOn(component, 'emitResultData');
    component.dataSource = ['item1', 'item2', 'item3', 'item4'];
    component.dataTarget = [];
    component.paginatorConfigTarget = {
      totalRecords: 0,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    component.pickAllToRight();
    expect(component.emitResultData).toHaveBeenCalled();
    expect(component.dataTarget.length).toEqual(4);
  });

  it('should call pickItemsToLeft', () => {
    spyOn(component, 'emitResultData');
    component.selectedRowsTarget = ['item1', 'item2'];
    component.dataTarget = ['item1', 'item2', 'item3', 'item4'];
    component.dataSource = [];
    component.paginatorConfigTarget = {
      totalRecords: 0,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    component.pickItemsToLeft();
    expect(component.emitResultData).toHaveBeenCalled();
    expect(component.dataTarget.length).toEqual(2);
  });

  it('should call pickAllToLeft', () => {
    spyOn(component, 'emitResultData');
    component.dataTarget = ['item1', 'item2', 'item3', 'item4'];
    component.dataSource = [];
    component.paginatorConfigTarget = {
      totalRecords: 0,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    component.pickAllToLeft();
    expect(component.emitResultData).toHaveBeenCalled();
    expect(component.dataTarget.length).toEqual(0);
  });

  it('should call dropdownRowsChange', () => {
    spyOn(component, 'emitResultData');
    component.dropdownRowsChange('event');
    expect(component.emitResultData).toHaveBeenCalled();
  });

  it('should call multiSelectRowsChange', () => {
    spyOn(component, 'emitResultData');
    component.multiSelectRowsChange('event');
    expect(component.emitResultData).toHaveBeenCalled();
  });

  it('should call inputFilterTarget', () => {
    spyOn(component.dataTableTarget, 'filter');
    const event = {
      target: {
        value: ''
      }
    };
    component.inputFilterTarget(event, 'field', 'macth');
    expect(component.dataTableTarget.filter).toHaveBeenCalled();
  });

  it('should call inputFilterSource', () => {
    spyOn(component.dataTableSource, 'filter');
    const event = {
      target: {
        value: ''
      }
    };
    component.inputFilterSource(event, 'field', 'macth');
    expect(component.dataTableSource.filter).toHaveBeenCalled();
  });

  it('should call clearSearchGlobal id = target', () => {
    spyOn(component, 'onSearch');
    component.clearSearchGlobal(TypePickList.TARGET);
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should call clearSearchGlobal id = source', () => {
    spyOn(component, 'onSearch');
    component.clearSearchGlobal(TypePickList.SOURCE);
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should call emitResultData ', () => {
    component.dataSource = [];
    component.dataTarget = [];
    component.pickListName = 'pickListName';
    spyOn(component.evOnChangeData, 'emit');
    component.emitResultData();
    expect(component.evOnChangeData.emit).toHaveBeenCalled();
  });

  it('should call drop with param is source', () => {
    spyOn(component, 'emitResultData');
    component.paginatorConfigTarget = {
      totalRecords: 0,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    const event: any = {
      previousContainer: {data: ['item1', 'item2', 'item3', 'item4']},
      container: {data: []},
      previousIndex: 3,
      currentIndex: 0,
      item: {data: 'item1'}
    };
    component.drop(event, 'source');
    expect(component.emitResultData).toHaveBeenCalled();
  });

  it('should call drop with param is target', () => {
    spyOn(component, 'emitResultData');
    component.paginatorConfigTarget = {
      totalRecords: 4,
      numberRowPerPage: 5,
      id: TypePickList.TARGET
    };
    const event: any = {
      previousContainer: {data: ['item1', 'item2', 'item3', 'item4']},
      container: {data: ['item5' ]},
      previousIndex: 3,
      currentIndex: 1,
      item: {data: 'item1'}
    };
    component.drop(event, 'target');
    expect(component.emitResultData).toHaveBeenCalled();
  });

  it('should call onPageChanged', () => {
    spyOn(component.pageChange, 'emit');
    const event = {
      rows: 10,
      page: 1,
      first: 0,
      pageCount: 10
    };
    component.onPageChanged(event, 'id');
    expect(component.pageChange.emit).toHaveBeenCalled();
  });

  it('should call onSearch', () => {
    spyOn(component.searchEvent, 'emit');
    component.onSearch('id');
    expect(component.searchEvent.emit).toHaveBeenCalled();
  });

  it('should call convertDataPicklist, with case remove primaryKey', () => {
    const data = [{name: 'item1', primaryKey: 0}];
    const result = component.convertDataPicklist(data);
    expect(result[0]?.primaryKey).toBeUndefined();
  });
});
