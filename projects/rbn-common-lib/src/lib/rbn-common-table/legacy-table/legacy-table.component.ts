import { Component, Input, OnChanges, AfterViewInit, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

import { BaseTableComponent } from '../shared/base-table.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { FilterService } from 'primeng/api';

@Component({
  templateUrl: '../shared/base-table.component.html',
  styleUrls: ['../shared/base-table.component.scss'],
  selector: 'rbn-legacy-table',
  providers: [DatePipe]
})
export class LegacyTableComponent extends BaseTableComponent implements OnChanges, AfterViewInit {
  @Input() onRowSelect: Function | undefined;
  @Input() onRowUnselect: Function | undefined;
  @Input() refreshData: Function | undefined;
  @Input() onFilter: Function | undefined;
  @Input() customGlobalFilter: Function | undefined;
  @Input() onChangeActions: Function | undefined;
  @Input() onClose: Function | undefined;
  @Input() onOpen: Function | undefined;
  @Input() customSort: Function | undefined;
  @Input() onEventRowReorder: Function | undefined;
  @Input() dropdownFilterChanged: Function | undefined;
  @Input() onCloseTable: Function | undefined;
  @Input() isResetRowFilter: Function | undefined;
  @Input() onClickTableActions: Function | undefined;
  @Input() onChangeTableActions: Function | undefined;
  @Input() onDeleteButtonClick: Function | undefined;
  @Input() onLinkClick: Function | undefined;
  @Input() onCheckboxChange: any;
  @Input() switchChange: Function | undefined;

  constructor(public translate: TranslateService, public datePipe: DatePipe, public rbnTableService: RbnTableService,
    public filterService: FilterService, public elementRef: ElementRef) {
    super(translate, datePipe, rbnTableService, filterService, elementRef);
  }

  onRefreshData() {
    if (this.refreshData) {
      this.refreshData();
    }
  }

  onCustomSort(event) {
    if (this.customSort) {
      this.customSort(event);
    }
  }

  onRowReorder() {
    if (this.onEventRowReorder) {
      this.onEventRowReorder();
    }
  }

  onCustomGlobalFilter(event: string) {
    if (this.customGlobalFilter) {
      this.customGlobalFilter(event);
    }
  }

  onFilterInner(event) {
    if (this.onFilter) {
      this.onFilter(event);
    }
  }

  onDropdownFilterChanged(field: string, value: any) {
    if (this.dropdownFilterChanged) {
      this.dropdownFilterChanged(field, value);
    }
  }

  onResetRowFilter() {
    if (this.isResetRowFilter) {
      this.isResetRowFilter();
    }
  }

  onSwitchChange(event: object, col) {
    if (this.switchChange) {
      this.switchChange({ event, col });
    }
  }
}
