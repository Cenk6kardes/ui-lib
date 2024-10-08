import {
  AfterContentChecked, AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges,
  OnInit,
  Output, Pipe, PipeTransform, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { RbnTableService } from './rbn-table.service';
import moment from 'moment';
import calculateSize from 'calculate-size';

import { Table } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { FilterService } from 'primeng/api';
import { DomHandler } from 'primeng/dom';

import {
  FilterTypes, FieldName, ItopButton, IheaderButton, IexpandMessage, IexpandData, Icols,
  ITableData, ItemDropdown, IFilterServerDataEmit, ISimpleDialogConfig, IStorageData, ItableOptions,
  IPageHeader, IdefaultSortSingle, ITableConfig
} from '../../models/common-table';

let newCalculateSize;

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseTableComponent implements OnInit, OnChanges, AfterViewInit, AfterContentChecked {
  @Input() appendToEle = '';
  @Input() cols: Icols[] = [];
  @Input() customTemplate1: TemplateRef<any> | undefined; // Custom template provided by parent
  @Input() data: ITableData[] = [];
  @Input() disabledTableActions = true;
  @Input() dropdownTablePlaceholderText = null;
  @Input() expandData: IexpandData;
  @Input() expandMessage: IexpandMessage;
  @Input() header: IPageHeader | string;
  @Input() headerButton: IheaderButton;
  @Input() headerOL: any = {}; // used for table header info icon and overlay
  @Input() hideDropdownOnScroll = false;
  @Input() isCustomSort = false;
  @Input() isScrollable = true;
  @Input() isSupportGrouping = false;
  @Input() isUsingAppendTo = true;
  @Input() keepFilter = true;
  @Input() numberRowPerPage = 10;
  @Input() rowsPerPageOptions: number[] = [];
  @Input() searchPlaceholderText = '';
  @Input() selectedRows: any[] | undefined;
  @Input() selectedTableAction = '';
  @Input() showCloseTableButton = false;
  @Input() showTableActionDropdown = false;
  @Input() showTemplateSummary = false;
  @Input() tableActions = [];
  @Input() tableName = 'tbl';
  @Input() tableOptions: ItableOptions = undefined;
  @Input() theme = '';
  @Input() topButton: ItopButton;
  @Input() translateResults: any = {};
  @Input() extHeaderRghtTmplt: any;
  @Input() showCurrentPageReport = false;
  @Input() defaultSortSingle: IdefaultSortSingle;
  @Input() allowSetDataToStorage = true;
  @Output() sortClient = new EventEmitter();
  @Input() showFilterRow: boolean;

  @Output() filterServer = new EventEmitter();
  @Output() colResize = new EventEmitter();

  // all filter types
  filterTypes = FilterTypes;
  // all field name for column
  fieldName = FieldName;
  // translate results
  // current active filter
  filterField = '';
  // value for global search
  searchData = '';
  // colspan atributes of row group
  colSpanOfRowGroup: number;
  paginator = true;
  caption = true;
  first = 0;
  formatDate = 'MM/dd/yyyy HH:mm:ss';
  actionDropdownAppendTo = '';
  scrollX = false;

  selectedChilds: any = [];

  triStateCheckbox: FormControl = new FormControl();

  clientMode = true;
  waitingFilterServer: boolean;
  colHidingDialogSimpleConfig: ISimpleDialogConfig;

  colsFilterTable = {};
  reorderColsByStorage: Icols[] = [];

  tableConfig: ITableConfig;
  allCols: Icols[] = [];

  @ViewChild('dt', { static: true }) dataTable!: Table;
  @ViewChild('trigger', { static: true }) elementTriggerClick!: ElementRef<HTMLElement>;
  @ViewChildren(MultiSelect) mulChildren!: QueryList<MultiSelect>;
  @ViewChild('rbntimepicker', { static: false }) rbntimepicker;

  abstract onRefreshData();
  abstract onDropdownFilterChanged(field: string, value: any);
  abstract onCheckboxChange(event, selectedRows: any[], selectedChilds);
  abstract onFilterInner(event);

  constructor(public translate: TranslateService, public datePipe: DatePipe, public rbnTableService: RbnTableService,
    public filterService: FilterService, public elementRef: ElementRef) {
    forkJoin([this.translate.get('COMMON'), this.translate.get('TABLE')]).subscribe(([common, table]: any) => {
      this.translateResults = this.translateResults || {};
      this.translateResults = common;
      this.translateResults.SHOWING_RECORDS = this.translateResults.SHOWING_RECORDS ||
        this.translateResults.SHOWING + ' {0} ' +
        this.translateResults.OF + ' {1} ' +
        this.translateResults.RECORDS;
      this.translateResults.SHOWING_RECORD = this.translateResults.SHOWING_RECORD ||
        this.translateResults.SHOWING + ' {0} ' +
        this.translateResults.OF + ' {1} ' +
        this.translateResults.RECORD;
      table = table || {};
      this.translateResults.TABLE = table;
      // if (this.colHidingDialogSimpleConfig) {
      //   this.colHidingDialogSimpleConfig.header = this.translateResults.SELECT_TO_HIDE;
      // }
    });
    this.closeDialog();
    this.onChangeCheckBoxShowCol();
    this.onChangeCheckBoxAllShowCol();
    if (typeof calculateSize === 'function') {
      newCalculateSize = calculateSize;
    } else {
      newCalculateSize = calculateSize['default'];
    }
    this.showFilterRow = this.rbnTableService.alwaysShowFilter;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.handleSupportGrouping(changes);
    if (this.dataTable) {
      this.first = this.dataTable.first;
      // when the data table changes, the max page may be smaller than the current page. In this case, we should reset the current page = 1
      if (this.clientMode && this.dataTable.rows > 0) {
        const maxPage = Math.ceil(this.data.length / this.dataTable.rows);
        const currentPage = (this.dataTable.first / this.dataTable.rows) + 1;
        if (currentPage > maxPage) {
          this.first = 0;
          this.dataTable.first = 0;
        }
      }
    }
    if (changes.data) {
      this.pipeDateCalendar();
      this.pipeDateRangeCalendar();
      this.addCalendarFilter();
      this.addDateRangeFilter();
      if (!this.waitingFilterServer) {
        this.loadDataStorageToTable();
      } else {
        this.waitingFilterServer = undefined;
      }
      this.filterItemsInMultiSelect();
      if (!changes.data.currentValue || changes.data.currentValue.length === 0) {
        this.clearSelected();
      }
    }

    if (changes.cols) {
      if (this.cols) {
        this.setColsHeaderBorder();
      }
    }

    this.colHidingDialogSimpleConfig = {
      cols: this.colHidingDialogSimpleConfig?.cols || this.cols,
      header: this.translateResults.SHOW_COLUMN,
      isUsingAppendTo: this.isUsingAppendTo,
      displayDialog: this.colHidingDialogSimpleConfig && this.colHidingDialogSimpleConfig.displayDialog ? true : false,
      checkBoxAll: false,
      modelName: 'colsEnable',
      showAdvancedOption: false
    };
    this.setOptions();
    this.initSelected();
  }

  isColsHasFilterData() {
    if (!this.cols) {
      return false;
    }
    let flag = false;
    for (let i = 0; i < this.cols.length; i++) {
      const col = this.cols[i];
      if ((col.options && col.options.model)) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setIdsForPaginationAttributes();
    }, 500);
  }

  ngAfterContentChecked(): void {
    if (this.translateResults) {
      this.colHidingDialogSimpleConfig.header = this.translateResults.SHOW_COLUMN;
    }
  }

  setIdsForPaginationAttributes(paginatorModeElement?: ElementRef) {
    const paginatorType = paginatorModeElement ? paginatorModeElement : this.dataTable.el;
    const htmlElement = paginatorType.nativeElement.querySelectorAll('.p-paginator > .p-paginator-element');
    const idsNameArr = ['paginatorFirst', 'paginatorPrev', 'paginatorNext', 'paginatorLast'];
    if (htmlElement.length > 0) {
      for (let i = 0; i < htmlElement.length; i++) {
        htmlElement[i].id = this.tableName ? this.tableName + idsNameArr[i][0].toUpperCase() + idsNameArr[i].slice(1) : idsNameArr[i];
      }
    }
  }

  setIdsForEachPage(paginatorModeElement?: ElementRef) {
    setTimeout(async () => {
      const paginatorType = paginatorModeElement ? paginatorModeElement : this.dataTable.el;
      const allPaginatorElements: any = paginatorType.nativeElement.querySelectorAll('.p-paginator-page');
      for (const item of allPaginatorElements) {
        item.id = this.tableName ? this.tableName + 'PaginatorPage' :
          'paginatorPage';
        item.id += item.innerText;
      }
    }, 5000);
  }

  setIdsForPaginatorDropdown(paginatorModeElement?: ElementRef) {
    const paginatorType = paginatorModeElement ? paginatorModeElement : this.dataTable.el;
    const paginationDropdownElement: any = paginatorType.nativeElement.querySelector('p-paginator p-dropdown.p-inputwrapper-filled');
    if (paginationDropdownElement) {
      paginationDropdownElement.id = this.tableName ? this.tableName + 'PaginationDropdown' : 'paginationDropdown';
      paginationDropdownElement.addEventListener('click', () => {
        const arrItemsDropdown: any = this.isUsingAppendTo ?
          this.dataTable.el.nativeElement.querySelectorAll('ul.p-dropdown-items p-dropdownitem') :
          document.querySelectorAll('ul.p-dropdown-items p-dropdownitem');
        if (arrItemsDropdown.length > 0) {
          for (const item of arrItemsDropdown) {
            item.id = 'per-page-' + item.innerText + '-items';
          }
        }
      });
    }
  }

  initSelected() {
    if (this.selectedRows && Array.isArray(this.selectedRows) && this.selectedRows.length > 0) {
      this.removePropertySelected(this.selectedRows);
      if (this.data && this.data.length > 0) {
        this.removePropertySelected(this.data);
        this.data.forEach((item) => {
          const index = this.selectedRows?.findIndex(x => JSON.stringify(x) === JSON.stringify(item));
          if (index !== -1) {
            item.selected = true;
            this.selectedRows[index].selected = true;
          } else {
            item.selected = false;
          }
        });
      }
    }
  }

  removePropertySelected(ar: any[]) {
    ar.forEach((item) => {
      if (item.hasOwnProperty('selected')) {
        delete item.selected;
      }
    });
  }

  handleSupportGrouping(changes: SimpleChanges) {
    if (changes.cols) {
      if (!this.isSupportGrouping) {
        if (this.cols) {
          this.cols = this.cols.filter(col => col.field !== 'rowGroup');
        }
      }
    }

    this.tableOptions = this.tableOptions || {};
    const hasCheckbox = this.isSupportGrouping || this.tableOptions.usingTriStateCheckbox;
    if (hasCheckbox) {
      this.tableOptions.selectionMode = 'multiple';
    }
  }

  pipeDateCalendar() {
    this.cols.map((col: Icols) => {
      if (this.data && col.type === FilterTypes.Calendar || (col.options && col.options.pipeDateCalendar)) {
        this.data.map((items: any) => {
          this.formatDateDisplay(col, items);
          if (this.isSupportGrouping && items.children) {
            items.children.map((child: any) => {
              this.formatDateDisplay(col, child);
            });
          }
        });
      }
    });
  }

  formatDateDisplay(col, items) {
    if (col.options && col.options.format) {
      if (this.isCanTransformDate(items[col.field])) {
        items[col.field] = this.datePipe.transform(items[col.field], col.options.format);
      }
    } else {
      if (typeof items[col.field] === 'string' && !isNaN(items[col.field])) {
        items[col.field] = +items[col.field];
      }
      if (this.formatDate.startsWith('UTC ') && items[col.field]) {
        if (this.isCanTransformDate(items[col.field])) {
          const theDate = new Date(items[col.field]);
          const dateNum = theDate.getTime();
          items[col.field] = this.datePipe.transform(dateNum + (theDate.getTimezoneOffset() * 60000), this.formatDate.substring(4))
            + ' UTC';
        }
      } else {
        if (this.isCanTransformDate(items[col.field])) {
          items[col.field] = this.datePipe.transform(items[col.field], this.formatDate);
        }
      }
    }
  }

  isCanTransformDate(value: string | number | Date) {
    let rs = false;
    try {
      this.datePipe.transform(value, this.formatDate);
      rs = true;
    } catch {
      rs = false;
    }
    return rs;
  }

  pipeDateRangeCalendar() {
    this.cols.map((col: Icols) => {
      if (this.data && col.type === FilterTypes.DateRange) {
        this.data.map((items: any) => {
          if (col.options && col.options.format) {
            if (col.startDate && items[col.startDate] && col.endDate && items[col.endDate]) {
              // eslint-disable-next-line max-len
              items[col.field] = this.datePipe.transform(items[col.startDate], col.options.format) + ' - ' + this.datePipe.transform(items[col.endDate], col.options.format);
            } else {
              items[col.field] = 'N/A';
            }

          } else {
            if (col.startDate && items[col.startDate] && col.endDate && items[col.endDate]) {
              // eslint-disable-next-line max-len
              items[col.field] = this.datePipe.transform(items[col.startDate], this.formatDate) + ' - ' + this.datePipe.transform(items[col.endDate], this.formatDate);
            } else {
              items[col.field] = 'N/A';
            }
          }
        });
      }
    });
  }

  loadDataStorageToTable() {
    const clientMode = this.clientMode;
    const parseDataFilter = this.getStorageData();
    if (parseDataFilter) {
      const colsFilter = parseDataFilter.colsFilter;
      const typeColsFilter = parseDataFilter.typeColsFilter;
      const globalFilter = parseDataFilter.globalFilter;
      const colsEnableStorage: string[] = parseDataFilter.colsEnable || [];
      const colsDisableStorage: string[] = parseDataFilter.colsDisable || [];
      const colsFrozenStorage: string[] = parseDataFilter.colsFrozen || [];
      const storageShowFilterRow = parseDataFilter.showFilterRow;
      // cols filter
      for (let col of this.cols) {
        const filter = colsFilter[col.field];
        if (col && col.options) {
          col.options.model = filter;
          switch (col.type) {
            case FilterTypes.Dropdown:
              if (col.options.model !== '') {
                this.onDropdownFilterChanged(col.field, col.options.model);
                if (!col.options.isNotFilterStorageDropdown && clientMode && this.dataTable) {
                  this.dataTable.filter(col.options.model, col.field, 'equals');
                }
              }
              break;
            case FilterTypes.InputText:
              if (clientMode && this.dataTable) {
                this.dataTable.filter(col.options.model, col.field, 'contains');
              }
              break;
            case FilterTypes.Multiselect:
              if (clientMode && this.dataTable) {
                this.dataTable.filter(col.options.model, col.field, 'in');
              }
              break;
            case FilterTypes.Calendar:
              this.filterField = col.field;
              const startdateValue = col.options.model[0];
              const enddateValue = col.options.model[1];
              this.onDateChanged({ startdateValue, enddateValue }, col);
              break;
          }
        }
        col = this.loadColumnsEnable(col, colsEnableStorage, colsDisableStorage);
        if (colsFrozenStorage.includes(col.field)) {
          col.frozen = true;
        };
      }
      this.setColsHeaderBorder();
      let hasFilter = false;
      if (colsFilter && typeof colsFilter === 'object') {
        for (const key of Object.keys(colsFilter)) {
          const val = colsFilter[key];
          if (val && val.length > 0) {
            hasFilter = true;
            break;
          }
        }
      }
      if (!clientMode && hasFilter) {
        this.emitFilterServer({ filter: colsFilter, typeFilter: typeColsFilter });
      }

      // global filter
      this.searchData = globalFilter;
      if (this.searchData !== '') {
        setTimeout(() => {
          if (this.dataTable.columns && clientMode) {
            this.dataTable.filterGlobal(this.searchData, 'contains');
          }
        }, 0);
      }
      // sort
      const sortTemp = parseDataFilter.colsSort;
      if (sortTemp) {
        const check = this.validationValueColsSortSingle(sortTemp.sortField, sortTemp.sortOrder);
        if (check && this.dataTable) {
          this.dataTable.sortField = sortTemp.sortField;
          this.dataTable.sortOrder = sortTemp.sortOrder;
          this.dataTable.sortSingle();
        }
      }
      // show filter row
      this.showFilterRow = storageShowFilterRow;

      if (this.rbnTableService.isReorderColsByStorage || this.tableConfig?.isReorderColsByStorage) {
        this.loadReorderColsByStorage(colsEnableStorage);
      }
    }
    this.setColsFilterTable(parseDataFilter);
  }

  loadReorderColsByStorage(colsEnableStorage: string[]) {
    this.reorderColsByStorage = [];
    colsEnableStorage.forEach(enableCol => {
      this.cols.forEach(col => {
        if (enableCol === col.field) {
          this.reorderColsByStorage.push(col);
        }
      });
    });

    if (this.reorderColsByStorage.length > 0) {
      this.cols = this.reorderColsByStorage;
    }
  }

  validationValueColsSortSingle(sortField: string, sortOrder: number) {
    if (sortOrder !== -1 && sortOrder !== 1) {
      return false;
    }
    const index = this.cols.findIndex(n => n.field === sortField);
    if (index === -1) {
      return false;
    } else if (!this.cols[index].sort) {
      return false;
    }
    return true;
  }

  loadColumnsEnable(col, colsEnableStorage, colsDisableStorage) {
    // sets default column enables based on local storage. If nothing stored, using default instead
    col.colsEnable = (colsEnableStorage.length > 0 || colsDisableStorage.length > 0) ?
      colsEnableStorage.includes(col.field) : col.colsEnable;
    col.colDisable = (colsEnableStorage.length > 0 || colsDisableStorage.length > 0) ?
      colsDisableStorage.includes(col.field) : col.colDisable;
    return col;
  }

  getStorageData() {
    const tableStorage = sessionStorage.getItem(this.generateKey()) || '';
    const parseDataFilter = tableStorage ? JSON.parse(tableStorage) : null;
    if (parseDataFilter) {
      const colsFilter = parseDataFilter.colsFilter;
      // cols filter
      for (const col of this.cols) {
        if (col && col.options) {
          const filter = colsFilter[col.field];
          if (col.type === FilterTypes.Calendar) {
            if (Array.isArray(filter)) {
              filter.forEach((item: any, index: any) => {
                if (item !== null) {
                  filter[index] = new Date(item);
                }
              });
            }
          }
          const model = this.getModelForCol(col, filter);
          if (model) {
            colsFilter[col.field] = model;
          }
        }
      }
      return parseDataFilter;
    }
  }

  getModelForCol(col: Icols, value) {
    let rs;
    if (col && col.options) {
      switch (col.type) {
        case FilterTypes.Dropdown:
          if (this.isString(value)) {
            rs = this.filterItemExistColDropdown(value, col.data) || '';
          }
          break;
        case FilterTypes.InputText:
          rs = value || '';
          break;
        case FilterTypes.Multiselect:
          rs = [];
          if (Array.isArray(value)) {
            rs = this.filterItemExistColMultiselect(value, col.data) || [];
          }
          break;
        case FilterTypes.Calendar:
        case FilterTypes.DateRange:
          rs = value ? value : [];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            rs = [];
            if (value.hasOwnProperty('startdateValue')) {
              rs.push(value.startdateValue);
            }
            if (value.hasOwnProperty('enddateValue')) {
              rs.push(value.enddateValue);
            }
          }
          break;
        default:
          rs = value;
      }
    }
    return rs;
  }

  emitFilterServer(data: IFilterServerDataEmit) {
    this.waitingFilterServer = true;
    const emitData: IFilterServerDataEmit = JSON.parse(JSON.stringify(data));
    if (emitData && emitData.filter && typeof emitData.filter === 'object') {
      const keys = Object.keys(emitData.filter);
      for (const key of keys) {
        if (!emitData.filter[key] || emitData.filter[key].length === 0) {
          delete emitData.filter[key];
        }
      }
    }
    this.filterServer.emit(emitData);
  }

  generateKey(): string {
    return ('storage_' + this.tableName);
  }

  filterItemsInMultiSelect() {
    // if (this.mulChildren) {
    //   const list: MultiSelect[] = this.mulChildren.toArray();
    //   list.map((item) => {
    //     if (item.filterInputChild) {
    //       item.onFilter();
    //       const el = this.dataTable.el.nativeElement.querySelector('.ui-multiselect-close');
    //       if (el) {
    //         el.addEventListener('click', (event) => {
    //           if (item) {
    //             item.filterValue = '';
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
  }

  setOptions(): void {
    if (this.tableOptions) {
      if (this.tableOptions.paginator !== undefined && this.tableOptions.paginator !== true) {
        this.paginator = false;
      }
      if (this.tableOptions.caption !== undefined && this.tableOptions.caption !== true) {
        this.caption = false;
      }
      if (this.tableOptions.formatDate && this.tableOptions.formatDate.length > 6) {
        this.formatDate = this.tableOptions.formatDate;
      }
    }
  }

  ngAfterViewInit(): void {
    this.setIdsForEachPage();
    this.setIdsForPaginatorDropdown();
    this.addMultiSelectFilter();
    this.getColSpanOfRowGroup();
    if (this.hideDropdownOnScroll && this.dataTable && this.dataTable.el) {
      this.dataTable.el.nativeElement
        .querySelector('.p-datatable-scrollable-body').addEventListener('mousedown', this.onMouseDownScrollBar);
    }
  }

  onMouseDownScrollBar = (e) => {
    if (e.offsetX > e.target.clientWidth || e.offsetY > e.target.clientHeight) {
      if (this.elementTriggerClick) {
        setTimeout(() => {
          this.elementTriggerClick.nativeElement.click();
        }, 200);
      }
    }
  };

  // add custom filter for MultiSelect
  addMultiSelectFilter() {
    if (this.dataTable) {
      this.filterService.register('inorcontains', (value: any, filter: any) => {
        if (!filter || value === undefined || value === null || value === '') {
          return false;
        }
        let found = false;
        filter.map((filteritem: any) => {
          if (value.toString() === filteritem.toString()) {
            found = true;
          }
        });
        return found;
      });
    }
  }


  // add custom filter for calendar
  addCalendarFilter() {
    if (this.dataTable) {
      this.filterService.register('calendarFilter', (value: any, filter: any) => {
        value = moment(new Date(value));
        if (!filter || !value) {
          return false;
        } else if (filter[0] && !filter[1]) {
          const startDate = moment(new Date(filter[0]));
          return startDate <= value;
        } else if (!filter[0] && filter[1]) {
          const endDate = moment(new Date(filter[0]));
          return endDate >= value;
        } else {
          const startDate = moment(new Date(filter[0]));
          const endDate = moment(new Date(filter[1]));
          return startDate <= value && endDate >= value;
        }
      });
    }
  }

  // add custom filter for date-range
  addDateRangeFilter() {
    if (this.dataTable && this.cols) {
      this.filterService.register('dateRangeFilter', (value: any, filter: any) => {
        const model: any = this.cols.find(item => item.field === this.filterField)?.options?.model;
        if (value === 'N/A') {
          return false;
        }
        value = value.split(' - ');
        value[0] = moment(new Date(value[0]));
        value[1] = moment(new Date(value[1]));
        if (!model[1]) {
          if (!filter || !value) {
            return false;
          }
          filter = moment(new Date(filter));
          return filter.date() === value.date() &&
            filter.month() === value.month() &&
            filter.year() === value.year();
        } else {
          const startDate = moment(new Date(model[0]));
          const endDate = moment(new Date(model[1]));
          return startDate <= value[0] && endDate >= value[1];
        }
      });
    }
  }

  initDropdownData = (cols: Array<any>) => {
    const all = 'All';
    if (cols && cols.length > 0) {
      return cols.map((item: any) => {
        item.data = item.data && item.data.length > 0 ? item.data : [];
        if (item.type === FilterTypes.Dropdown &&
          (Array.isArray(item.data) && item.data.length === 0 ||
            item.data[0].label.toLowerCase() !== all.toLowerCase())) {
          item.data.unshift({ label: this.translateResults.ALL || all, value: '' });
        }
      });
    }
  };

  dataDropdown(arr: ItemDropdown[], item: any, title: any) {
    if (item[title] || item[title] === false || item[title] === 0) {
      if (arr && arr.findIndex(i => i.value === item[title]) === -1) {
        arr.push(new ItemDropdown(item[title] + '', item[title]));
      }
    }
    return arr;
  }

  clearSelected() {
    this.triStateCheckbox.setValue(null);
    this.selectedRows = undefined;
    this.selectedChilds = [];
  }

  handleFilterChanged(event) {
    this.checkScrollHeader(event);
    this.setDataTableToStorage();
    this.onFilterInner(event);
    this.onFilterDropdown(event);
    if (!this.clientMode) {
      this.first = 0;
    }
  }

  checkScrollHeader(event) {
    this.scrollX = false;
    if (event && event.filteredValue && event.filteredValue.length === 0) {
      this.scrollX = true;
    }
  }

  onSort = () => {
    this.setDataTableToStorage();
    this.dataTable.first = this.first;
    if (this.clientMode) {
      this.sortClient.emit(this.dataTable.value);
    }
    if (this.tableConfig?.allowFrozenColumn && this.dataTable.value.length > 0) {
      this.setBorderFrozenColOnSort();
    }
  };

  setBorderFrozenColOnSort() {
    const isHasFilter = this.cols.some(col => {
      const model = col?.options?.model;
      if (Array.isArray(model)) {
        return model.length > 0;
      } else {
        return !!model;
      }
    });
    // call the func if the global search value and column search value are not present
    if (!isHasFilter && !this.searchData) {
      this.setBorderFrozenCol();
    }
  }

  onpanelMultiShow() {
    this.filterItemsInMultiSelect();
  }

  // Close show/hide column dialog
  closeDialog() {
    this.rbnTableService.closeDialog.subscribe(close => {
      if (close) {
        if (this.colHidingDialogSimpleConfig) {
          this.colHidingDialogSimpleConfig.displayDialog = false;
        }
      }
    });
  }

  onHideColumnDialog() {
    this.setDataTableToStorage();
  }

  // show select column dialog
  showColumnDialog() {
    if (this.colHidingDialogSimpleConfig) {
      this.colHidingDialogSimpleConfig.displayDialog = true;
    }
  }

  onShowColumnDialog() {
    this.setValueCheckBoxAllShowCol();
  }

  onChangeCheckBoxShowCol() {
    this.rbnTableService.checkboxShowCol.subscribe(checked => {
      if (checked) {
        this.setValueCheckBoxAllShowCol();
        this.setDataTableToStorage();
        this.getColSpanOfRowGroup();
      }
    });
  }

  onChangeCheckBoxAllShowCol() {
    this.rbnTableService.checkboxAllCols.subscribe(() => {
      if (this.colHidingDialogSimpleConfig) {
        this.cols.forEach(col => {
          col.colsEnable = this.colHidingDialogSimpleConfig.checkBoxAll ? true : false;
        });
        this.setDataTableToStorage();
        this.getColSpanOfRowGroup();
      }
    });
  }

  setValueCheckBoxAllShowCol() {
    if (this.colHidingDialogSimpleConfig) {
      let allCheck = true;
      for (const col of this.cols) {
        if (col.colsEnable === false) {
          allCheck = false;
          break;
        }
      }
      this.colHidingDialogSimpleConfig.checkBoxAll = allCheck;
    }
  }

  getColSpanOfRowGroup() {
    this.colSpanOfRowGroup = 1;
    this.cols.forEach(col => {
      if (col.colsEnable) {
        this.colSpanOfRowGroup += 1;
      }
    });
  }

  getColumnStyle = (col: any) => {
    if (!this.cols || !col) {
      return 'none';
    }
    if (col.field === FieldName.Checkbox || col.field === FieldName.RowGroup ||
      (col.field === FieldName.Reorder && col.colsEnable === true)) {
      return 'table-cell';
    }
    const rs = this.cols && this.cols.find(item => item.field === col.field);
    return rs && rs.colsEnable ? 'table-cell' : 'none';
  };

  refreshDataInner = (emit: boolean) => {
    if (emit) {
      this.onRefreshData();
    }
    if (!this.keepFilter) {
      this.resetFilterDropdowns();
      this.searchData = '';
      if (this.dataTable) {
        this.dataTable.reset();
        this.dataTable.filterGlobal('', 'contains');
      }
    }
  };

  // reset filter dropdown
  resetFilterDropdowns = () => {
    if (this.dataTable) {
      this.allCols.forEach(item => {
        if (item && item.options) {
          item.options.model = '';
        }
      });
      this.dataTable.filters = {};
    }
  };

  // reset filter on click clear button
  resetFilter() {
    this.resetFilterDropdowns();
    this.dataTable.filterGlobal(this.searchData, 'contains');
  }

  optionDropdown(col: any) {
    return this.cols.filter(data => data.field === col.field)[0].data;
  }

  getDropdownHeight(dropdownItems: Array<any> | undefined) {
    if (!dropdownItems) {
      return '0';
    }
    return dropdownItems.length * 38 + 'px';
  }

  setCurrentDropAction(rowData: any) {
    this.data.map((item: any, i: number) => {
      if (JSON.stringify(rowData) !== JSON.stringify(item)) {
        item.ngModel = '';
      }
    });
  }

  onClickDropdownActions(event: any) {
    if (this.elementTriggerClick) {
      this.elementTriggerClick.nativeElement.click();
    }
    event.stopPropagation();
  }

  onDateChanged(data: { startdateValue: string | undefined, enddateValue: string | undefined }, col: any) {
    const clientMode = this.clientMode;
    col.options = col.options || {};
    if (col.type === FilterTypes.Calendar) {
      if (data.startdateValue !== undefined && data.enddateValue !== undefined) {
        col.options.model = [data.startdateValue, data.enddateValue];
        if (clientMode) {
          this.dataTable.filter(col.options.model, col.field, 'calendarFilter');
        }
      } else {
        col.options.model = '';
        if (clientMode && this.dataTable) {
          this.dataTable.filter('', col.field, 'calendarFilter');
        }
      }
    } else if (col.type === FilterTypes.DateRange) {
      if (data.startdateValue !== undefined && data.enddateValue !== undefined) {
        col.options.model = [data.startdateValue, data.enddateValue];
        if (clientMode && this.dataTable) {
          this.dataTable.filter(col.options.model, col.field, 'dateRangeFilter');
        }
      } else {
        col.options.model = '';
        if (clientMode && this.dataTable) {
          this.dataTable.filter('', col.field, 'dateRangeFilter');
        }
      }
    }
  }

  filterItemExistColDropdown(model: string, data: any) {
    if (data && data.length >= 1) {
      if (!this.isColDataContainKeyword(model, data)) {
        model = '';
      }
    }
    return model;
  }

  isColDataContainKeyword(model: string, data: any) {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      const a = data[i].value.toString();
      const b = model.toString();
      if (a === b) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  filterItemExistColMultiselect(model: any[], data: any) {
    if (data.length > 0) {
      for (let i = 0; i < model.length; i++) {
        if (!this.isColDataContainKeyword(model[i], data)) {
          model[i] = null;
        }
      }
      model = model.filter(e => e !== null);
    }
    return model;
  }

  removeItemStorage() {
    sessionStorage.removeItem(this.generateKey());
  }

  isString(value: any) {
    return typeof value === 'string' || value instanceof String;
  }

  toggleFilterRow() {
    this.showFilterRow = !this.showFilterRow;
    this.setDataTableToStorage();
    const tableStorage = sessionStorage.getItem(this.generateKey()) || '';
    const parseDataFilter = tableStorage ? JSON.parse(tableStorage) : null;
    this.setColsFilterTable(parseDataFilter);
  }

  setColsFilterTable(parseDataFilter: any) {
    const colsFilterTemp = {};
    if (parseDataFilter) {
      Object.keys(parseDataFilter.colsFilter).forEach((key) => {
        if (parseDataFilter.colsFilter[key] && (JSON.stringify(parseDataFilter.colsFilter[key]) !== ('[]' || '{}'))) {
          colsFilterTemp[key] = parseDataFilter.colsFilter[key];
        }
      });
    }
    this.colsFilterTable = colsFilterTemp;
  }

  setDataTableToStorage() {
    if (this.dataTable) {
      this.dataTable.first = this.first;
    }
    const dataStorage: IStorageData = {
      colsFilter: {},
      typeColsFilter: [],
      globalFilter: '',
      colsEnable: [],
      colsDisable: [],
      colsFrozen: [],
      showFilterRow: this.showFilterRow
    };
    if (this.tableName && this.allowSetDataToStorage) {
      for (const col of this.cols) {
        if (col.hasOwnProperty('options') &&
          (col.options?.model && !(Array.isArray(col.options.model) && col.options.model.length === 0))) {
          dataStorage.colsFilter[col.field] = col.options.model;
          dataStorage.typeColsFilter.push({ colName: col.field, type: col.type });
        }
        if (col.colDisable) {
          dataStorage.colsDisable.push(col.field);
        } else if (col.colsEnable || col.upgradeCol) {
          dataStorage.colsEnable.push(col.field);
        }
        if (col.frozen && dataStorage.colsFrozen) {
          dataStorage.colsFrozen.push(col.field);
        }
      }
      if (this.dataTable && this.dataTable.sortField && this.dataTable.sortOrder) {
        dataStorage.colsSort = {
          sortField: this.dataTable.sortField,
          sortOrder: this.dataTable.sortOrder
        };
      } else {
        if (this.defaultSortSingle) {
          const sortValue = this.defaultSortSingle.sortOrder === 'ASC' ? 1 : -1;
          if (this.validationValueColsSortSingle(this.defaultSortSingle.field, sortValue)) {
            dataStorage.colsSort = {
              sortField: this.defaultSortSingle.field,
              sortOrder: sortValue
            };
          }
        }
      }

      sessionStorage.setItem(this.generateKey(), JSON.stringify(dataStorage));
    }
  }

  onColResize(event: any, dt: Table) {
    const dataStyle = [];
    const arrHeaderEl = this.elementRef.nativeElement.querySelectorAll('.p-datatable-thead > tr > th') as HTMLElement[];
    let indexResizeEl = -1;
    arrHeaderEl.forEach((el, index) => {
      if (el.isEqualNode(event.element)) {
        if (this.tableConfig.expandRows) {
          return indexResizeEl = index - 1;
        } else {
          return indexResizeEl = index;
        }
      }
    });
    for (const [index, col] of this.cols.entries()) {
      const el = this.elementRef.nativeElement.querySelector('#colgroupId-' + col.field) as HTMLElement;
      if (index === indexResizeEl) {
        let colgroupWidth = parseInt(el.style.width, 10);
        if (isNaN(colgroupWidth)) {
          colgroupWidth = el.offsetWidth;
        }
        colgroupWidth += event.delta;
        el.style.width = colgroupWidth + 'px';
      }
      if (el && el.style.width) {
        dataStyle.push({
          'field': col.field,
          'style': { width: el.style.width }
        });
      }
    }
    if (dataStyle.length > 0) {
      sessionStorage.setItem(this.generateKey() + '_resize', JSON.stringify(dataStyle));
    }
    if (this.tableConfig.allowFrozenColumn) {
      this.resizeFrozenCol();
    }
    this.colResize.emit();
    dt.cd.detectChanges();
  }

  resizeFrozenCol() {
    const frozenCols = this.elementRef.nativeElement.querySelectorAll('.p-frozen-column') || [];
    for (let i = 0; i < frozenCols.length; i++) {
      if (frozenCols[i].style.left !== '') {
        let left = 0;
        const prev = frozenCols[i].previousElementSibling;
        if (prev) {
          left = DomHandler.getOuterWidth(prev) + (parseFloat(prev.style.left) || 0);
        }
        frozenCols[i].style.left = left + 'px';
      }
      if (frozenCols[i].style.right !== '') {
        let right = 0;
        const next = frozenCols[i].nextElementSibling;
        if (next) {
          right = DomHandler.getOuterWidth(next) + (parseFloat(next.style.right) || 0);
        }
        frozenCols[i].style.right = right + 'px';
      }
    }
  }

  setBorderFrozenCol() {
    setTimeout(() => {
      const frozenEl = this.elementRef.nativeElement.querySelectorAll('.p-frozen-column') || [];
      frozenEl.forEach(el => {
        if (el.style.left !== '') {
          if (el.nextElementSibling.classList.contains('p-frozen-column')) {
            el.classList.remove('frozen-border-right');
          } else {
            el.classList.add('frozen-border-right');
          }
        }

        if (el.style.right !== '') {
          if (el.previousElementSibling.classList.contains('p-frozen-column')) {
            el.classList.remove('frozen-border-left');
          } else {
            el.classList.add('frozen-border-left');
          }
        }
      });
    });
  }

  checkColsEllipsis(el: HTMLElement, isHeaderCol = false) {
    // if rbnTimePicker dialog visible on DOM then ignore this function
    const pickerVisible = document.querySelector('p-dialog.rbn-picker-dialog-visible');
    if (pickerVisible) {
      return;
    }
    if (isHeaderCol) {
      if (el?.classList.contains('col-ellipsis-show')) {
        const ellipsisEl = el.querySelector('.ellipsis') as HTMLElement;
        if (ellipsisEl) {
          const offsetWidth = el.classList.contains('p-sortable-column') ? el.offsetWidth + 20 : el.offsetWidth;
          if (el.scrollWidth > offsetWidth) {
            ellipsisEl.style.display = 'block';
          } else {
            ellipsisEl.removeAttribute('style');
          }
        }
      }
    } else {
      const parentEl = el?.closest('.col-ellipsis-show') as HTMLElement;
      const ellipsisEl = parentEl?.querySelector('.ellipsis') as HTMLElement;
      if (parentEl && ellipsisEl) {
        if (el.offsetWidth > parentEl.offsetWidth) {
          ellipsisEl.style.display = 'block';
        } else {
          ellipsisEl.removeAttribute('style');
        }
      }
    }
  }

  setWidthCol(col: any) {
    const tableStorage = sessionStorage.getItem(this.generateKey() + '_resize') || '';
    const parseDataFilter = tableStorage ? JSON.parse(tableStorage) : null;
    if (parseDataFilter) {
      const parseDataFilterArray = parseDataFilter as Array<any>;
      const item = parseDataFilterArray.find(n => n.field === col.field);
      if (item) {
        return item.style.width;
      }
    } else {
      if (col.colWidth > 0) {
        return col.colWidth + 'px';
      }
      let width = this.calculateWidthColumOfTable(col);

      if (width > 350) {
        width = 350;
      }
      if (col.type === FilterTypes.Calendar) {
        if (this.formatDate.endsWith('z') || this.formatDate.startsWith('UTC ')) {
          return 210 + 'px';
        } else {
          return 190 + 'px';
        }
      }
      if (col.type === FilterTypes.InputText) {
        return 210 + 'px';
      }
      if (col.type === FilterTypes.DateRange) {
        return 290 + 'px';
      }
      if (col.field === FieldName.Checkbox) {
        let tepm = this.tableOptions?.usingTriStateCheckbox ? 85 : 50;
        if (this.isSupportGrouping) {
          tepm = tepm + 20;
        }
        return tepm + 'px';
      }
      if (col.field === 'expand' || col.field === 'rowGroup') {
        return 25 + 'px';
      }
      if ((col.header && col.header.indexOf('ID') !== -1) && col.type !== FilterTypes.Dropdown) {
        return 170 + 'px';
      }
      if (col.field === 'action') {
        return 168 + 'px';
      }
      return width + 'px';
    }
  }

  calculateWidthColumOfTable(dataCol: any = []) {
    // width header column
    let widthHeaderColumn = 0;
    const calSizeField = newCalculateSize(dataCol.header, {
      font: 'Open Sans',
      fontSize: '14px',
      fontWeight: '600'
    });
    widthHeaderColumn = calSizeField.width + 24;
    // if header have sort
    if (dataCol.sort === true) {
      widthHeaderColumn = widthHeaderColumn + 25;
    }
    // width data of column
    let maxWidthDataOfColumn = 0;
    if (dataCol.data && dataCol.data.length > 0) {
      for (let i = 0; i < dataCol.data.length; i++) {
        if (dataCol.data[i].label !== undefined) {
          const calSize = newCalculateSize(dataCol.data[i].label, {
            font: 'Open Sans',
            fontSize: '14px'
          });
          if (maxWidthDataOfColumn < calSize.width) {
            maxWidthDataOfColumn = calSize.width;
          }
        }
      }
      // if column have dropdown
      if (dataCol.type === FilterTypes.Dropdown) {
        maxWidthDataOfColumn = maxWidthDataOfColumn + 55;
      }
      // if column have multiselect
      if (dataCol.type === FilterTypes.Multiselect) {
        maxWidthDataOfColumn = maxWidthDataOfColumn + 62;
      }
      // if column have InputText
      if (dataCol.type === FilterTypes.InputText) {
        maxWidthDataOfColumn = maxWidthDataOfColumn + 31;
      }
      // if column not have type
      if (!dataCol.type) {
        maxWidthDataOfColumn = maxWidthDataOfColumn + 31;
      }
    }

    if (widthHeaderColumn < maxWidthDataOfColumn) {
      return maxWidthDataOfColumn;
    } else {
      return widthHeaderColumn;
    }
  }

  triggerCheckbox(child) {
    this.selectedChilds = this.selectedChilds || [];
    const dataKey = this.tableOptions?.dataKey;
    if (child) {
      const index = dataKey ? this.selectedChilds.findIndex(x => x[dataKey] === child[dataKey]) : -1;
      const selectedChilds = [...this.selectedChilds];
      if (index !== -1) {
        selectedChilds.splice(index, 1);
      } else {
        selectedChilds.push(child);
      }
      this.selectedChilds = selectedChilds;
    }
  }

  selectChildRow(event, parent, rowIndex) {
    let isSelectedAll = true;
    this.selectedRows = this.selectedRows || [];
    const dataKey = this.tableOptions?.dataKey;
    parent.children.forEach(element => {
      if (!this.checkItemExist(this.selectedChilds, element, dataKey)) {
        element.selected = false;
        isSelectedAll = false;
      } else {
        element.selected = true;
      }
    });
    const indexSelectedRow = dataKey ? this.selectedRows.findIndex(
      element => element[dataKey] === parent[dataKey]
    ) : -1;
    const newSelectedRows = [...this.selectedRows];

    if (isSelectedAll) {
      if (indexSelectedRow === -1) {
        this.data[rowIndex].selected = true;
        parent.selected = true;
        newSelectedRows.push(parent);

      }
    } else {
      if (indexSelectedRow !== -1) {
        this.data[rowIndex].selected = false;
        newSelectedRows[indexSelectedRow].selected = false;
        newSelectedRows.splice(indexSelectedRow, 1);
      }
    }
    this.selectedRows = newSelectedRows;
    this.updateCheckboxStatus();
    if (this.onCheckboxChange) {
      this.onCheckboxChange(event, this.selectedRows, this.selectedChilds);
    }
  }

  checkItemExist(arr, item, key) {
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === item[key]) {
        found = true;
        break;
      }
    }
    return found;
  }

  findIndex(arr: any[], item, key?: string) {
    return key ? arr.findIndex(x => item[key] === x[key]) : arr.findIndex(x => JSON.stringify(item) === JSON.stringify(x));
  }

  onCheckboxParent(status, parent, rowIndex?, event?) {
    const dataKey = this.tableOptions?.dataKey;
    if (this.isSupportGrouping) {
      const newSelectedChilds = [...this.selectedChilds];
      if (status) {
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(element => {
            if (!this.checkItemExist(newSelectedChilds, element, dataKey)) {
              element.selected = true;
              newSelectedChilds.push(element);
            }
          });
        }
      } else {
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(element => {
            const indexRemove = dataKey ? newSelectedChilds.findIndex(row => row[dataKey] === element[dataKey]) : -1;
            if (indexRemove !== -1) {
              newSelectedChilds[indexRemove].selected = false;
              newSelectedChilds.splice(indexRemove, 1);
            }
          });
        }
      }
      this.selectedChilds = newSelectedChilds;
    }
    if (rowIndex !== undefined) {
      this.data[rowIndex].selected = status;
      parent.selected = status;
      this.updateCheckboxStatus();
    }
    if (this.onCheckboxChange) {
      this.onCheckboxChange(event, this.selectedRows, this.selectedChilds);
    }
  }

  onCheckboxHeader(status, event?) {
    if (this.tableOptions?.usingTriStateCheckbox) {
      this.onTriCheckboxChanged(status);
    }
    if (this.isSupportGrouping) {
      this.selectedRows = this.selectedRows || [];
      this.selectedChilds = [];
      this.selectedRows.forEach((element) => {
        element.selected = true;
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            if (status !== null && status !== undefined) {
              child.selected = true;
              this.selectedChilds.push(child);
            }
          });
        }
      });
    }
    if (this.onCheckboxChange) {
      this.onCheckboxChange(event, this.selectedRows, this.selectedChilds);
    }
  }

  onTriCheckboxChanged(status) {
    this.translateResults.TABLE = this.translateResults.TABLE || {};
    if (this.tableOptions?.selectionMode !== 'single') {
      this.selectedRows = this.selectedRows || [];
      const newSelectedRows = [...this.selectedRows];
      const newData = (this.dataTable.filteredValue && this.dataTable.filteredValue.length > 0) ?
        this.dataTable.filteredValue : this.data;
      let start;
      let end;
      if (status) {
        start = this.dataTable.first;
        end = start + this.currentRecords;
      } else {
        start = 0;
        end = newData.length;
      }
      const oldSelectedRows = [...this.selectedRows];
      for (let i = start; i < end; i++) {
        const item = newData[i];
        let index;
        if (status === true || status === false) {
          index = this.findIndex(oldSelectedRows, item);
          if (index === -1) {
            newSelectedRows.push(item);
          }
        } else {
          index = this.findIndex(newSelectedRows, item);
          if (index !== -1) {
            newSelectedRows.splice(index, 1);
          }
        }
        item.selected = status === true || status === false;
      }
      this.selectedRows = newSelectedRows;

    }
  }

  updateCheckboxStatus(filterChanges?) {
    if (this.dataTable && this.tableOptions && this.tableOptions.usingTriStateCheckbox) {
      let newData;
      if (Array.isArray(this.selectedRows)) {
        newData = this.data;
        if (this.dataTable.filteredValue && this.dataTable.filteredValue.length > 0) {
          newData = this.dataTable.filteredValue;
        }
        newData = newData || [];
        if (this.selectedRows.length === newData.length && newData.length > 0) {
          this.triStateCheckbox.setValue(false);
        } else {
          this.updateSelectCurrentPage(newData);
        }
      }
    }
  }

  onRowSelectInner(event) {
    const index = event.index;
    if (Number.isInteger(index)) {
      this.onCheckboxParent(true, event.data, index, event);
    }
  }

  onRowUnselectInner(event) {
    const index = this.data.findIndex(x => JSON.stringify(x) === JSON.stringify(event.data));
    this.onCheckboxParent(false, event.data, index, event);
  }

  onPage() {
    this.updateCheckboxStatus();
  }


  resetPageFirst() {
    this.first = 0;
    this.dataTable.first = 0;
  }

  paginate(event) {
    this.first = event.first;
    this.setIdsForEachPage();
  }

  updateSelectCurrentPage(data) {
    if (data && data.length > 0) {
      const currentPageData = data.slice(this.dataTable.first, this.dataTable.first + this.currentRecords);
      let isAllPageSelected = true;
      for (const item of currentPageData) {
        if (!item.selected) {
          isAllPageSelected = null;
          break;
        }
      }
      this.triStateCheckbox.setValue(isAllPageSelected);
    } else {
      this.triStateCheckbox.setValue(null);
    }
  }

  onFilterDropdown(filterChanges?) {
    this.updateCheckboxStatus(filterChanges);
  }

  setColsHeaderBorder(): void {
    this.cols.forEach((col, index) => {
      let showHeaderBorder = false;
      if (
        col.colsEnable && col.field !== FieldName.RowGroup && col.field !== FieldName.Expand &&
        this.cols.some((x, i) => i > index && x.colsEnable)
      ) {
        // show header border if this column is enable, not RowGroup or Expand column,
        // and have an enabled column in the right of this column
        showHeaderBorder = true;
      }
      col.options = col.options || {};
      col.options.showHeaderBorder = showHeaderBorder;
    });
  }

  filterItemExistRowsFilter(cols: any[]) {
    let flag = false;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].hasOwnProperty('options')) {
        if (cols[i].options && cols[i].options.model) {
          switch (cols[i].type) {
            case FilterTypes.Multiselect:
              {
                const tempDataMultiselect = JSON.parse(JSON.stringify(cols[i].options.model));
                cols[i].options.model = this.filterItemExistColMultiselect(cols[i].options.model, cols[i].data);
                if (JSON.stringify(tempDataMultiselect) !== JSON.stringify(cols[i].options.model) && tempDataMultiselect) {
                  flag = true;
                }
              }
              break;
            case FilterTypes.Dropdown:
              const tempDataDropdown = JSON.parse(JSON.stringify(cols[i].options.model));
              cols[i].options.model = this.filterItemExistColDropdown(cols[i].options.model, cols[i].data);
              if (tempDataDropdown !== cols[i].options.model && tempDataDropdown) {
                flag = true;
              }
          }
        }
      }
    }
    if (flag) {
      this.setDataTableToStorage();
      const clientMode = this.clientMode;
      if (!clientMode) {
        const parseDataFilter = this.getStorageData();
        const colsFilter = parseDataFilter.colsFilter;
        const typeColsFilter = parseDataFilter.typeColsFilter;
        this.emitFilterServer({ filter: colsFilter, typeFilter: typeColsFilter });
      }
    }
  }

  get currentRecords() {
    if (this.dataTable) {
      return this.dataTable.totalRecords - this.dataTable.first < this.dataTable.rows ?
        this.dataTable.totalRecords - this.dataTable.first : this.dataTable.rows;
    }
  }

  get checkboxClass() {
    if (this.tableOptions && this.tableOptions.usingTriStateCheckbox) {
      const value = this.triStateCheckbox.value;
      return value ? 'tri-checkbox-check' : value === false ? 'tri-checkbox-double' : 'tri-checkbox';
    }
  }

  get triCheckboxValue() {
    if (this.tableOptions && this.tableOptions.usingTriStateCheckbox) {
      return this.triStateCheckbox.value;
    }
  }

  get labelTriCheckbox() {
    if (this.tableOptions && this.tableOptions.usingTriStateCheckbox) {
      this.translateResults.TABLE = this.translateResults.TABLE || {};
      const status = this.triStateCheckbox.value;
      return status ? this.translateResults.TABLE.SELECT_RECORDS_PAGE :
        (status === false ? this.translateResults.TABLE.SELECT_ALL_RECORDS :
          this.translateResults.TABLE.UNSELECT_ALL_RECORDS);
    }
  }

  get tooltipCheckbox() {
    if (this.tableOptions && this.tableOptions.usingTriStateCheckbox) {
      this.translateResults.TABLE = this.translateResults.TABLE || {};
      const status = this.triStateCheckbox.value;
      return status ? this.translateResults.TABLE.TOOLTIP_SELECT_ALL :
        (status === false ? this.translateResults.TABLE.TOOLTIP_UNSELECT :
          this.translateResults.TABLE.TOOLTIP_SELECT_CURRENT_PAGE);
    }
  }

  get currentPageReportTemplate() {
    this.translateResults = this.translateResults || {};
    this.translateResults.SHOWING_RECORDS = this.translateResults.SHOWING_RECORDS || '';
    this.translateResults.SHOWING_RECORD = this.translateResults.SHOWING_RECORD || '';
    if (this.dataTable.totalRecords === 1) {
      return this.translateResults.SHOWING_RECORD
        .replace('{0}', 1).replace('{1}', 1);
    }
    const first = (this.dataTable.totalRecords - this.dataTable.first) < this.dataTable.rows ?
      this.dataTable.totalRecords - this.dataTable.first : this.dataTable.rows;
    return this.translateResults.SHOWING_RECORDS
      .replace('{0}', first).replace('{1}', this.dataTable.totalRecords);
  }
}


