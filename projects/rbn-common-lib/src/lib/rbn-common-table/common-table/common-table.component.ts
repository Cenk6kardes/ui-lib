import { Component, OnChanges, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { BaseTableComponent } from '../shared/base-table.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { FilterService } from 'primeng/api';

@Component({
  templateUrl: '../shared/base-table.component.html',
  styleUrls: ['../shared/base-table.component.scss'],
  selector: 'rbn-common-table',
  providers: [DatePipe]
})
export class CommonTableComponent extends BaseTableComponent implements OnChanges, AfterViewInit {
  @Output() changeActions = new EventEmitter();
  @Output() changeTableActions = new EventEmitter();
  @Output() checkboxChange = new EventEmitter();
  @Output() clickTableActions = new EventEmitter();
  @Output() closeTable = new EventEmitter();
  @Output() customGlobalFilter = new EventEmitter();
  @Output() customSort = new EventEmitter();
  @Output() deleteButtonClick = new EventEmitter();
  @Output() dropdownFilterChanged = new EventEmitter();
  @Output() rowReorder = new EventEmitter();
  @Output() filter = new EventEmitter();
  @Output() linkClick = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Output() resetRowFilter = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  @Output() rowUnselect = new EventEmitter();
  @Output() switchChange = new EventEmitter();

  constructor(public translate: TranslateService, public datePipe: DatePipe, public rbnTableService: RbnTableService,
    public filterService: FilterService, public elementRef: ElementRef) {
    super(translate, datePipe, rbnTableService, filterService, elementRef);
  }

  onRefreshData() {
    this.refreshData.emit();
  }

  onFilterInner(event) {
    this.onFilter(event);
  }

  /* ---------- Output emit -------------*/
  onFilter(event) {
    this.filter.emit(event);
  }

  onCustomGlobalFilter(event: string) {
    this.customGlobalFilter.emit(event);
  }

  onCustomSort(event) {
    this.customSort.emit(event);
  }

  onRowReorder() {
    this.rowReorder.emit();
  }

  onCloseTable() {
    this.closeTable.emit();
  }

  onResetRowFilter() {
    this.resetRowFilter.emit();
  }

  onClickTableActions(event) {
    this.clickTableActions.emit(event);
  }

  onChangeTableActions(event) {
    this.changeTableActions.emit(event);
  }

  onLinkClick(event: object) {
    this.linkClick.emit(event);
  }

  onSwitchChange(event: object, col) {
    this.switchChange.emit({ event, col });
  }

  // when implement, need to update handle funtion
  onRowSelect(event, selectedRows: any[]) {
    this.rowSelect.emit({ event, selectedRows });
  }

  onRowUnselect(dt, selectedRows: any[]) {
    this.rowUnselect.emit({ dt, selectedRows });
  }

  onChangeActions(rowData, event, rowIndex: number) {
    this.changeActions.emit({ rowData, event, rowIndex });
  }

  onDropdownFilterChanged(field: string, value: any) {
    this.dropdownFilterChanged.emit({ field, value });
  }

  onDeleteButtonClick(event, rowData: object) {
    this.deleteButtonClick.emit({ event, rowData });
  }

  onCheckboxChange(event, selectedRows: any[], selectedChilds?: any[]) {
    this.checkboxChange.emit({ event, selectedRows, selectedChilds });
  }
}


