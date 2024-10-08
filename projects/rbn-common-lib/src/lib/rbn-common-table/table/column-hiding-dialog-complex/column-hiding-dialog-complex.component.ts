import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FieldName, Icols, IComplexDialogConfig, IHiddingColumnComplexEmit } from '../../../models/common-table';
interface Cols {
  name: string;
  header: string;
  allowHide?: boolean;
  frozen?: boolean;
}

@Component({
  selector: 'rbn-column-hiding-dialog-complex',
  templateUrl: './column-hiding-dialog-complex.component.html',
  styleUrls: ['./column-hiding-dialog-complex.component.scss']
})
export class ColumnHidingDialogComplexComponent implements OnChanges, AfterViewInit {
  @Input() config: IComplexDialogConfig;
  @Input() idComplex: string;
  @Input() allowFrozen: boolean;
  @Input() isUsingAppendTo = true;

  @Output() closeDialog = new EventEmitter();
  @Output() colsChanged = new EventEmitter();
  @Output() hideColumnDialog = new EventEmitter();
  @Output() showColumnDialog = new EventEmitter();

  possibleCols: Cols[] = [];
  visibleCols: Cols[] = [];
  originPossibleCols: Cols[] = [];
  originVisiableCols: Cols[] = [];
  fieldName = FieldName;
  currentFrozen: boolean[] = [];

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.config && changes.config.currentValue.tableActive === this.idComplex && changes.config.firstChange) {
      this.initData();
    } else if (changes.config.currentValue.tableActive !== this.idComplex) {
      this.onCloseDialog();
    }
  }

  ngAfterViewInit() {
    this.onHideItem();
    this.storeCurrentFrozen();
  }

  initData() {
    if (this.config) {
      this.possibleCols = [];
      if (this.config.possibleCols && this.config.possibleCols.length > 0) {
        this.possibleCols = this.config.possibleCols.filter(x => !x.colsEnable).map(col => {
          const possibleCols: Cols = {
            name: col.field,
            header: col.header
          };
          if (col.allowHide === false) {
            possibleCols.allowHide = col.allowHide;
          }
          return possibleCols;
        });
        this.originPossibleCols = JSON.parse(JSON.stringify(this.possibleCols));
      }

      this.visibleCols = [];
      if (this.config.visibleCols && this.config.visibleCols.length > 0) {
        this.visibleCols = this.config.visibleCols.filter(x => x.colsEnable).map((col, i) => {
          const visibleCol: Cols = {
            name: col.field,
            header: col.header
          };

          if (col.allowHide === false) {
            visibleCol.allowHide = col.allowHide;
          }
          if (this.allowFrozen) {
            if ((i <= 2 || col.field === FieldName.Action) && col.frozen === undefined) {
              visibleCol.frozen = false;
            } else {
              visibleCol.frozen = col.frozen;
            }
          }
          return visibleCol;
        });
        this.originVisiableCols = JSON.parse(JSON.stringify(this.visibleCols));
      }
    }
  }

  onCustomize() {
    const cols: Icols[] = this.config.possibleCols.concat(this.config.visibleCols);
    if (this.allowFrozen) {
      cols.map(configEl => {
        delete configEl.frozen;
        this.visibleCols.forEach(el => {
          if (configEl.field === el.name && el.frozen !== undefined) {
            configEl.frozen = el.frozen;
          }
        });
      });
    }
    const posArr = this.possibleCols.map(x => cols.find(item => item.field === x.name));
    const visArr = this.visibleCols.map(x => cols.find(item => item.field === x.name));
    const data: IHiddingColumnComplexEmit = { possibleCols: posArr, visibleCols: visArr };
    this.closeDialog.emit({
      data: data,
      isFromSimple: this.config.isFromSimple,
      tableActive: this.idComplex
    });
  }

  onCloseDialog() {
    this.closeDialog.emit({ isFromSimple: this.config.isFromSimple });
    this.initData();
  }

  onHideColumnDialog() {
    this.hideColumnDialog.emit();
  }

  onShowColDialog() {
    this.showColumnDialog.emit();
  }

  onMoveToSource(event) {
    this.handleItems(event.items, false);
  }

  onMoveToTarget(event) {
    this.handleItems(event.items, true);
  }

  handleItems(items, target: boolean) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach(item => {
        if (item.allowHide === false) {
          const index = (target ? this.visibleCols : this.possibleCols).findIndex(col => col.name === item.name);
          target ? this.possibleCols = this.originPossibleCols : this.visibleCols = this.originVisiableCols;
          (target ? this.visibleCols : this.possibleCols).splice(index, 1);
        } else {
          const index = (target ? this.originPossibleCols : this.originVisiableCols).findIndex(col => col.name === item.name);
          (target ? this.originPossibleCols : this.originVisiableCols).splice(index, 1);
        }
      });
    } else {
      if (items && items.allowHide === false) {
        target ? this.possibleCols = this.originPossibleCols : this.visibleCols = this.originVisiableCols;
        const index = (target ? this.visibleCols : this.possibleCols).findIndex(col => col.name === items.name);
        (target ? this.visibleCols : this.possibleCols).splice(index, 1);
      }
    }
    if (this.allowFrozen) {
      this.handleFrozen(items, target);
    }
    this.originPossibleCols = [...new Map(this.possibleCols.map(item => [item.name, item])).values()];
    this.originVisiableCols = [...new Map(this.visibleCols.map(item => [item.name, item])).values()];
    setTimeout(() => {
      this.onHideItem();
    });
  }

  onHideItem() {
    const arrHideItemEl = this.elementRef.nativeElement.querySelectorAll('.p-picklist-item .hide-item');
    arrHideItemEl.forEach((el: HTMLElement) => {
      const parentEl = el.parentElement;
      if (parentEl) {
        parentEl.classList.add('picklist-item-disabled');
      }
    });
  }

  onTargetReorder() {
    if (this.allowFrozen) {
      this.handleFrozen(undefined, true);
    }
  }

  frozenCol(col: Cols, ev: MouseEvent) {
    if (!col || !ev) {
      return;
    }
    const colIndex = this.visibleCols.indexOf(col);
    if (col.frozen) {
      for (let i = colIndex; i < this.visibleCols.length; i++) {
        if (this.visibleCols[i].frozen === undefined) {
          break;
        }
        this.visibleCols[i].frozen = false;
      }
    } else {
      for (let i = colIndex; i >= 0; i--) {
        if (this.visibleCols[i].frozen === undefined) {
          break;
        }
        this.visibleCols[i].frozen = true;
      }
    }
    this.storeCurrentFrozen();
    ev.stopPropagation();
  }

  handleFrozen(items?, target?) {
    if (!target && items) {
      if (Array.isArray(items) && items.length > 0) {
        items.map(el => {
          delete el.frozen;
        });
      } else {
        delete items.frozen;
      }
    }
    if (target) {
      this.pushActionToLastVisibleCols();
    }
    this.visibleCols.forEach((col, index) => {
      if (col.name === FieldName.Action) {
        col.frozen = col.frozen || false;
      } else {
        col.frozen = index <= 2 ? !!this.currentFrozen[index] : undefined;
      }
    });
    this.storeCurrentFrozen();
  }

  pushActionToLastVisibleCols(): void {
    const actionIndex = this.visibleCols.findIndex(item => item.name === FieldName.Action);
    const lastItem = actionIndex !== -1 ? this.visibleCols.splice(actionIndex, 1)[0] : undefined;
    if (lastItem) {
      this.visibleCols.push(lastItem);
    }
  }

  storeCurrentFrozen(): void {
    this.currentFrozen = [];
    // store the frozen status of the first 3 columns which having lock/unlock icon
    for (let index = 0; index <= 2; index++) {
      if (this.visibleCols[index]?.name !== FieldName.Action) {
        this.currentFrozen.push(!!this.visibleCols[index]?.frozen);
      }
    }
  }
}
