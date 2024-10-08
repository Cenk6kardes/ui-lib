import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent, filterDate, removeUnusedPropObject, removeUncontinuityPlanPropObject, notEmpty } from './base.component';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterTypes } from '../models/common-table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RbnCommonTableModule } from '../rbn-common-table/rbn-common-table-lib.module';

const cols = [{ field: 'vin', header: 'Vin' }, { field: 'year', header: 'Year' }];

@Component({
  template: `
    <rbn-common-table #rbnTable [cols]="cols" [data]="car"></rbn-common-table>
    <div id="testId"></div>
  `
})
class TestBaseComponent extends BaseComponent {
  cars: any[] = [{ vin: 'vin', year: 'year' }];
  cols: any[] = cols;
}

describe('BaseComponent', () => {
  let component: TestBaseComponent;
  let fixture: ComponentFixture<TestBaseComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RbnCommonTableModule
      ],
      declarations: [TestBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBaseComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call resetFilter', () => {
    if (component.rbnTable) {
      component.rbnTable.resetFilter = jasmine.createSpy('resetFilter');
    }
    component.resetFilter();
    expect(component).toBeTruthy();
  });

  it('call resetAllDropDownActions', () => {
    const arr = [{ ngModel: 'test' }];
    component.resetAllDropDownActions(arr);
    expect(arr[0].ngModel).toEqual('');
  });

  it('call scrollToElement', () => {
    const rs = component.scrollToElement('testId');
    expect(rs).toBeUndefined();
  });

  it('call initDropdownData', () => {
    const data = [
      { data: 'test1' },
      { data: 'test2', type: FilterTypes.Multiselect }];
    component.initDropdownData(data);
    expect(data[1].data).toEqual([]);
  });

  it('should do nothing when call filterDate without data', () => {
    const dataToFilter = [
      {
        date: new Date(2018, 11, 25, 10, 33, 30)
      }
    ];
    const rs = filterDate(undefined, dataToFilter, 'date');
    expect(rs.length).toEqual(dataToFilter.length);
  });

  it('should return filter date', () => {
    const dataToFilter = [
      {
        date: new Date(2018, 11, 25, 10, 33, 30)
      },
      {
        date: new Date(2018, 11, 24, 10, 33, 30)
      },
      {
        date: new Date(2018, 12, 24, 10, 33, 30)
      }
    ];
    const rs = filterDate(
      [new Date(2018, 11, 24, 10, 33, 30), new Date(2018, 12, 24, 10, 33, 30)],
      dataToFilter,
      'date'
    );
    expect(rs.length).toEqual(3);
  });

  it('call removeNotExistDropdownItem', () => {
    const dropdownData = {
      data: [{ value: 'test', label: 'test' }],
      field: 'name',
      options: { model: 'test' }
    };
    const currentData: Array<any> = [{ name: 'test1' }];
    if (component.rbnTable) {
      component.rbnTable.dataTable.filters = {
        name: {}
      };
      component.rbnTable.dataTable.filterService.filters['name'] = {};
    }
    const result = component.removeNotExistDropdownItem(dropdownData, FilterTypes.Multiselect, currentData);
    expect(result).toBeDefined();
  });

  it('call removeUnusedPropObject', () => {
    const obj = {
      actions: 'actions',
      ngModel: 'ngModel'
    };
    const rs = removeUnusedPropObject(obj);
    expect(rs).toEqual({});
  });

  it('call removeUncontinuityPlanPropObject', () => {
    const obj = {
      className: 'className'
    };
    const rs = removeUncontinuityPlanPropObject(obj);
    expect(rs).toEqual({});
  });

  // it('should show errorObj.message', () => {
  //   component.showError({ message: 'show message' }, rbnMessage);
  //   expect(rbnMessage.showError).toHaveBeenCalledWith('show message');
  // });

  // it('should show errorObj.error', () => {
  //   component.showError({ error: 'show error' }, rbnMessage);
  //   expect(rbnMessage.showError).toHaveBeenCalledWith('show error');
  // });

  it('should call removeNotExistDropdownItem and return true', () => {
    const dropdownData = {
      data: [{ value: 'test', label: 'test' }],
      field: 'name',
      options: { model: 'test' }
    };
    const currentData: Array<any> = [{ name: 'test1' }];
    const result = component.removeNotExistDropdownItem(dropdownData, FilterTypes.Dropdown, currentData);
    expect(result).toBeDefined();
  });

  it('should call dataDropdown', () => {
    const dropdownData = [{ value: 'test', label: 'test' }];
    component.dataDropdown(dropdownData, { name: 'test1' }, 'name');
    expect(dropdownData[1].value).toEqual('test1');
  });

  it('should call cleanDataTableFilter', () => {
    const currentData: Array<any> = [{ year: '2022' }];
    if (component.rbnTable) {
      component.rbnTable.dataTable.filterService.filters['year'] = { value: '2022' };
    }
    const newCols = [...cols];
    newCols[1]['options'] = {};
    const resultCols = component.cleanDataTableFilter(currentData, newCols);
    expect(resultCols[1].options.model).toEqual('2022');
  });

  it('should call cleanDataTableFilter and return value ""', () => {
    const currentData: Array<any> = [{ year: '' }];
    if (component.rbnTable) {
      component.rbnTable.dataTable.filterService.filters['year'] = { value: '2022' };
      component.cleanDataTableFilter(currentData, cols);
      expect(component.rbnTable.dataTable.filterService.filters['year'].value).toEqual('');
    }
  });

  it('should call isValidElement and return false', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    const valid = component.isValidElement(form, 'name');
    expect(valid).toBeFalse();
  });

  it('should call isValidElement and return true', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    const valid = component.isValidElement(form, 'test');
    expect(valid).toBeTrue();
  });

  it('should call getZoneTime', () => {
    const datePipe = new DatePipe('en-US');
    const date = component.getZoneTime('dd/MM/yyyy', 1638954958756, datePipe);
    expect(date).toEqual('08/12/2021');
  });

  it('should call getZoneTime and formatDate start with UTC', () => {
    const datePipe = new DatePipe('en-US');
    const date = component.getZoneTime('UTC dd/MM/yyyy', 1638954958756, datePipe);
    expect(date).toEqual('08/12/2021 UTC');
  });

  it('should call updateList and add new item', () => {
    const items = [{ name: 'Test' }];
    const newItem = {
      name: 'Admin'
    };
    const newItems = component.updateList(items, newItem, 'name');
    expect(newItems[1]).toEqual(newItem);
  });

  it('should call updateList and update item', () => {
    const items = [{ name: 'Admin', value: '1' }];
    const newItem = {
      name: 'Admin',
      value: '2'
    };
    const newItems = component.updateList(items, newItem, 'name');
    expect(newItems[0]).toEqual(newItem);
  });

  it('should call updateList with items=[]', () => {
    const items = [];
    const newItem = {
      name: 'Admin',
      value: '2'
    };
    const newItems = component.updateList(items, newItem, 'name');
    expect(newItems[0]).toEqual(newItem);
  });

  it('should call notEmpty', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    const valid = notEmpty(form.controls['name']);
    expect(valid && valid.notEmpty).toBeTrue();
  });
});
