import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ISimpleDialogConfig } from '../../../models/common-table';
import { RbnTableService } from '../../shared/rbn-table.service';


@Component({
  selector: 'rbn-column-hiding-dialog',
  templateUrl: './column-hiding-dialog.component.html',
  styleUrls: ['./column-hiding-dialog.component.scss']

})
export class ColumnHidingDialogComponent implements OnChanges {

  @Input() config: ISimpleDialogConfig;
  @Input() idSimple: string;
  @Input() isTableChildren: boolean;

  @Output() openAdvanceOptions = new EventEmitter();
  @Output() changeCheckboxAll = new EventEmitter();
  @Output() changeCheckbox = new EventEmitter();
  @Output() closeDialog = new EventEmitter();
  @Output() changeFrozen = new EventEmitter();

  currentActive: string;

  constructor(
    private rbnTableService: RbnTableService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config && changes.config.currentValue.tableActive) {
      this.currentActive = changes.config.currentValue.tableActive;
    }
  }

  onChangeCheckBoxAllShowCol() {
    this.rbnTableService.checkboxAllCols.next(true);
    this.changeCheckboxAll.emit();
  }

  onChangeCheckBoxShowCol(col) {
    const dataToEmit: any = {
      config: this.config,
      colHiding: this.config.cols.filter(x => !!x[this.config.modelName])
    };
    if (this.idSimple && this.idSimple === this.currentActive) {
      dataToEmit.tableActive = this.idSimple;
    }
    this.rbnTableService.checkboxShowCol.next(dataToEmit);
    const indexCol = this.config.cols.findIndex(el => el.field === col.field);
    for (let i = indexCol; i < this.config.cols.length; i++) {
      if (this.config.cols[i].frozen === undefined) {
        break;
      }
      this.config.cols[i].frozen = false;
    }
    this.frozenCol(null);
  }

  onOpenAdvancedOption() {
    this.rbnTableService.openAdvanced.next(this.idSimple);
  }

  onCloseDialog() {
    this.rbnTableService.closeDialog.next(this.config.cols.filter(x => !!x[this.config.modelName]));
  }

  setStatusCheckBoxShowHideCol(indexOfCkb: number) {
    const cols = this.config.cols;
    if (cols[indexOfCkb].allowHide === false) {
      return true;
    }
  }

  frozenCol(col) {
    this.changeFrozen.emit(col);
  }
}
