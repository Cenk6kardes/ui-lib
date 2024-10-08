import { Injectable, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonTableComponent } from '../rbn-common-table/common-table/common-table.component';
import { FilterTypes, ItemDropdown } from '../models/common-table';

@Injectable()
export abstract class BaseComponent {
  tableName = ''; // used to store column enables, set by extending class
  translateResults: any = {};
  @ViewChild('rbnTable', { static: true }) rbnTable: CommonTableComponent | undefined;

  // Reset sort, filter dropdown of table
  resetFilter() {
    if (this.rbnTable && this.rbnTable.dataTable) {
      this.rbnTable.resetFilter();
    }
  }

  // scroll to html element
  scrollToElement(idElement: string) {
    setTimeout(() => {
      const htmlElement = document.getElementById(`${idElement}`);
      if (htmlElement) {
        htmlElement.scrollIntoView();
      }
    }, 0);
  }

  // reset all dropdown action
  resetAllDropDownActions(data: any) {
    if (data) {
      data.map((item: any) => {
        item.ngModel = '';
      });
    }
  }

  initDropdownData = (cols: Array<any>) => cols.map((item: any) => {
    if (item.type !== FilterTypes.Multiselect) {
      item.data = [new ItemDropdown()];
      item.data[0].label = this.translateResults.ALL;
    } else {
      item.data = [];
    }
  });

  dataDropdown(arr: ItemDropdown[], item: any, title: any) {
    if (arr && arr.findIndex(i => i.value === item[title]) === -1) {
      if (item[title]) {
        arr.push(new ItemDropdown(item[title], item[title]));
      }
    }
  }

  // remove dropdown item not exist in current data
  removeNotExistDropdownItem(
    dropdownData: { data: Array<ItemDropdown>, field: string, options: { model: string } },
    dropdownType: FilterTypes,
    currentData?: Array<any>) {
    dropdownData.data = dropdownData.data.filter((item, index) => {
      if (index === 0 && dropdownType !== FilterTypes.Multiselect) {
        return true;
      }
      const isExisted = currentData && currentData.find(item1 => item.value === item1[dropdownData.field]);
      if (!isExisted) {
        // Reset dropdown selected data if this item not existed on dropdown
        if (dropdownData.options.model === item.value) {
          dropdownData.options.model = '';
          // Reset dataTable filter for item not existed on dropdown
          if (this.rbnTable && this.rbnTable.dataTable && this.rbnTable.dataTable.filters.hasOwnProperty(dropdownData.field)) {
            this.rbnTable.dataTable.filterService.filters[dropdownData.field].value = '';
          }
        }
      }
      return isExisted;
    });
    return dropdownData;
  }

  cleanDataTableFilter(currentData: Array<any>, cols: Array<any>) {
    if (this.rbnTable && this.rbnTable.dataTable && this.rbnTable.dataTable.filters) {
      const tableFilter = this.rbnTable.dataTable.filterService.filters;
      Object.keys(tableFilter).forEach(key => {
        const isExisted = currentData && currentData.find(item1 => tableFilter[key].value === item1[key]);
        if (!isExisted) {
          tableFilter[key].value = '';
        } else {
          const col = cols && cols.find(col1 => key === col1.field);
          if (col) {
            col.options.model = tableFilter[key].value;
          }
        }
      });
    }
    return cols;
  }

  isValidElement(form: FormGroup | any, elmName: string, validator = 'required') {
    if (form && form.controls && form.controls[elmName] && form.controls[elmName].invalid) {
      form.controls[elmName].markAsDirty();
      if (form.controls[elmName].errors && form.controls[elmName].errors.hasOwnProperty(validator)) {
        return false;
      }
    }
    return true;
  }

  getZoneTime(formatDate: string, dateNum: number, datePipe: DatePipe): string {
    let returnDateStr = '';
    if (formatDate.startsWith('UTC ')) {
      const theDate = new Date(dateNum);
      returnDateStr = datePipe.transform(dateNum + (theDate.getTimezoneOffset() * 60000), formatDate.substring(4))
        + ' UTC';
    } else {
      returnDateStr = '' + datePipe.transform(dateNum, formatDate);
    }
    return returnDateStr;
  }

  updateList(items: any[], newItem: any, fieldname: string): any[] {
    if (items.length > 0 && newItem && newItem[fieldname]) {
      const oldItemIndex = items.findIndex(item1 => newItem[fieldname] === item1[fieldname]);
      if (oldItemIndex >= 0) {
        // let oldItem = items[oldItemIndex];
        items[oldItemIndex] = JSON.parse(JSON.stringify(newItem));
      } else {
        items.push(newItem);
      }
    } else {
      items.push(newItem);
    }
    return JSON.parse(JSON.stringify(items));
  }
}

/**
 * Filter data by range of Date
 * @param rangeDates array of start date and end date
 * @param dataToFilter array of data to filter
 * @param fieldNameToFilter filter by
 */
export function filterDate(rangeDates: Array<any> | undefined, dataToFilter: Array<any>, fieldNameToFilter: string) {
  if (!rangeDates || !dataToFilter) {
    return dataToFilter;
  }
  const startDate = rangeDates[0];
  const endDate = rangeDates[1];
  return dataToFilter.filter(
    item =>
      (new Date(item[fieldNameToFilter]) > startDate && new Date(item[fieldNameToFilter]) < endDate) ||
      (new Date(item[fieldNameToFilter]).getUTCDate() === startDate.getDate() &&
        new Date(item[fieldNameToFilter]).getUTCMonth() === startDate.getMonth() &&
        new Date(item[fieldNameToFilter]).getUTCFullYear() === startDate.getFullYear()) ||
      (endDate &&
        (new Date(item[fieldNameToFilter]).getUTCDate() === endDate.getDate() &&
          new Date(item[fieldNameToFilter]).getUTCMonth() === endDate.getMonth() &&
          new Date(item[fieldNameToFilter]).getUTCFullYear() === endDate.getFullYear()))
  );
}
export function removeUnusedPropObject(obj: any) {
  if (obj.hasOwnProperty('actions')) {
    delete obj['actions'];
  }
  if (obj.hasOwnProperty('ngModel')) {
    delete obj['ngModel'];
  }
  return obj;
}

export function removeUncontinuityPlanPropObject(obj: any) {
  if (obj.hasOwnProperty('className')) {
    delete obj['className'];
  }
  return obj;
}

export function notEmpty(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return !isValid ? { 'notEmpty': true } : null;
}

export interface IQueryParams {
  pageNum: number;
  recordPerPage: number;
  unique?: boolean;
  searchCriteria?: string;
  sortBy?: string;
  sortDir?: number;
  filter?: Array<IFilterParam>;
  string?: string;
}

export interface IFilterParam {
  field: string;
  value: any;
}
