import {
  Component, ElementRef, EventEmitter,
  Input, OnChanges, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  BodyTextType, FilterTypesPickList,
  IColsPickList, ILabelPickList,
  IPageChangeEvent, IPaginatorConfig,
  TypeHide,
  TypePickList
} from './model';

import { Table } from 'primeng/table';
import { ISearchGlobal, PaginatorMode } from '../../models/common-table';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'rbn-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnChanges {
  filterTypes = FilterTypesPickList;
  bodyTextType = BodyTextType;
  @Output() evOnChangeData = new EventEmitter();
  @ViewChild('dtSource', { static: true }) dataTableSource!: Table;
  @ViewChild('dtTarget', { static: true }) dataTableTarget!: Table;
  @ViewChild('tempInputFocus', { static: true }) tempInputFocus!: ElementRef;

  @Input() cols: IColsPickList[] = [];
  @Input() pickListName = '';
  @Input() pickListLabel?: ILabelPickList;
  @Input() isReorderTarget = false;
  @Input() targetConfig = {
    emptyMessageContent: ''
  };
  // Target
  colsTarget: IColsPickList[] = [];
  @Input() dataTarget: any[] = [];
  paginatorConfigTarget: IPaginatorConfig;
  selectedRowsTarget: any[] = [];

  // Source
  colsSource: IColsPickList[] = [];
  @Input() dataSource: any[] = [];
  selectedRowsSource: any[] = [];
  paginatorConfigSource: IPaginatorConfig;

  // pagination
  @Input() showPaginator = false;
  @Input() paginatorMode: PaginatorMode = PaginatorMode.Client;
  @Input() paginatorConfig: IPaginatorConfig[] = [];

  @Output() pageChange = new EventEmitter();

  // search
  @Input() showSearch = false;
  @Output() searchEvent = new EventEmitter();

  searchData = '';
  searchConfig: ISearchGlobal = {
    searchData: ''
  };

  @Input() searchTarget = '';
  @Input() searchSource = '';

  TypePickList = TypePickList;
  PaginatorMode = PaginatorMode;
  messages: any = {};
  firstRowDisplayedSource = 0;
  firstRowDisplayedTarget = 0;

  constructor(private translate: TranslateService) {
    this.translate.get('PICKLIST').subscribe((res: string) => {
      this.messages = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginatorConfig && changes.paginatorConfig.currentValue) {

      // set value for paginator Source
      this.paginatorConfigSource = changes.paginatorConfig.currentValue.find(paginatorSource =>
        paginatorSource.id === TypePickList.SOURCE
      );
      // set value for paginator Target
      this.paginatorConfigTarget = changes.paginatorConfig.currentValue.find(paginatorTarget =>
        paginatorTarget.id === TypePickList.TARGET
      );
    }
    if (changes.cols) {
      this.setColsPickList();
    }

    if (this.paginatorConfigSource?.resetPage) {
      this.firstRowDisplayedSource = 0;
    }

    if (this.paginatorConfigTarget?.resetPage) {
      this.firstRowDisplayedTarget = 0;
    }

    if (changes?.dataSource) {
      this.dataSource = this.convertDataPicklist(changes.dataSource.currentValue);
    }

    if (changes?.dataTarget) {
      this.dataTarget = this.convertDataPicklist(changes.dataTarget.currentValue);
    }
  }

  setColsPickList(): void {
    this.colsTarget = [];
    this.colsSource = [];
    this.cols.map((col) => {
      if (col.typeHide) {
        switch (col.typeHide) {
          case TypeHide.SOURCE:
            this.colsTarget.push(col);
            break;
          case TypeHide.TARGET:
            this.colsSource.push(col);
            break;
          case TypeHide.ALL:
            break;
          default:
            break;
        }
      } else {
        this.colsSource.push(col);
        this.colsTarget.push(col);
      }
    });
  }

  pickItemsToRight(): void {
    let hasChanges = false;
    this.selectedRowsSource.map((items) => {
      const index = this.findIndexData(items, this.dataSource);
      if (index !== -1) {
        this.dataTarget = [...this.dataTarget, this.dataSource[index]];
        this.dataSource = this.dataSource.filter((val, i) => i !== index);
        hasChanges = true;
      }
    });
    if (hasChanges) {
      this.selectedRowsSource = [];
      this.emitResultData();
    }
  }

  pickAllToRight(): void {
    let hasChanges = false;
    for (let i = 0; i < this.dataSource.length; i++) {
      if (!this.dataSource[i].isDisabled) {
        const removedItem = this.dataSource.splice(i, 1)[0];
        this.dataTarget.push(removedItem);
        i--;
        hasChanges = true;
      }
    }
    // to update page report template
    this.dataSource = [...this.dataSource];
    this.dataTarget = [...this.dataTarget];
    if (hasChanges) {
      this.selectedRowsSource = [];
      this.emitResultData();
    }
  }

  pickItemsToLeft(): void {
    let hasChanges = false;
    this.selectedRowsTarget.map((items) => {
      const index = this.findIndexData(items, this.dataTarget);
      if (index !== -1) {
        this.dataSource = [...this.dataSource, this.dataTarget[index]];
        this.dataTarget = this.dataTarget.filter((val, i) => i !== index);
        hasChanges = true;
      }
    });
    if (hasChanges) {
      this.selectedRowsTarget = [];
      this.emitResultData();
    }
  }

  pickAllToLeft(): void {
    let hasChanges = false;
    for (let i = 0; i < this.dataTarget.length; i++) {
      if (!this.dataTarget[i].isDisabled) {
        const removedItem = this.dataTarget.splice(i, 1)[0];
        this.dataSource.push(removedItem);
        i--;
        hasChanges = true;
      }
    }
    // to update page report template
    this.dataSource = [...this.dataSource];
    this.dataTarget = [...this.dataTarget];

    if (hasChanges) {
      this.selectedRowsTarget = [];
      this.emitResultData();
    }
  }

  findIndexData(items: any, dataTemp: any[]): number {
    // items should not array
    const index = dataTemp.findIndex(n => n === items);
    return index;
  }

  inputFilterSource(event: any, field: string, matchMode: string): void {
    this.dataTableSource.filter(event.target.value, field, matchMode);
  }

  inputFilterTarget(event: any, field: string, matchMode: string): void {
    this.dataTableTarget.filter(event.target.value, field, matchMode);
  }

  dropdownRowsChange(event: any): void {
    this.emitResultData();
  }

  multiSelectRowsChange(event: any): void {
    this.emitResultData();
  }


  // clear search server
  clearSearchGlobal(id: string): void {
    if (id === TypePickList.SOURCE) {
      this.searchSource = '';
    } else {
      this.searchTarget = '';
    }
    this.onSearch(id, true);
  }


  // event change data
  emitResultData(): void {
    this.evOnChangeData.emit({
      source: this.convertDataPicklist(JSON.parse(JSON.stringify(this.dataSource))),
      target: this.convertDataPicklist(JSON.parse(JSON.stringify(this.dataTarget))),
      pickListName: this.pickListName
    });
  }

  drop(event: CdkDragDrop<string[]>, nameList: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const selectedItem = event.item.data;
      const currentIndex = (event.previousContainer.data as any).findIndex((item: any) =>
        item?.primaryKey === selectedItem?.primaryKey);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        currentIndex,
        event.container.data.length
      );
    }
    this.dataSource = [...this.dataSource];
    this.dataTarget = [...this.dataTarget];
    this.emitResultData();
    if (nameList === 'target') {
      this.selectedRowsSource = [];
    } else {
      this.selectedRowsTarget = [];
    }
  }

  // Add the property primaryKey with index of the item in dataSource and dataTarget for drop/drag picklist
  // Remove the property primaryKey before emit result data
  convertDataPicklist(data: any[]): any[] {
    if (!data || data.length === 0) {
      return [];
    }
    return data.map((item: any, index: any) => {
      if (item.hasOwnProperty('primaryKey')) {
        delete item.primaryKey;
        return item;
      } else {
        return {
          ... item,
          primaryKey: index
        };
      }
    });
  }

  // event change page paginator
  onPageChanged(event: any, id: string): void {
    const eventPageChange: IPageChangeEvent = {
      first: event.first,
      page: event.page,
      pageCount: event.pageCount,
      rows: event.rows,
      id: id
    };
    this.firstRowDisplayedSource = event.first;
    this.pageChange.emit(eventPageChange);
  }

  // emit event search
  onSearch(id: string, removeKey = false): void {
    if (id === TypePickList.SOURCE) {
      this.firstRowDisplayedSource = 0;
    } else {
      this.firstRowDisplayedTarget = 0;
    }
    this.searchEvent.emit({
      id: id,
      key: id === TypePickList.SOURCE ? this.searchSource : this.searchTarget,
      removeKey: removeKey
    });
  }
}
