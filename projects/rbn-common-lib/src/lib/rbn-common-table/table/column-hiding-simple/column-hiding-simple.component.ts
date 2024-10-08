import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ISimpleDialogConfig } from '../../../models/common-table';


@Component({
  selector: 'rbn-column-hiding-simple',
  templateUrl: './column-hiding-simple.component.html',
  styleUrls: ['./column-hiding-simple.component.scss']
})
export class ColumnHidingSimpleComponent {

  @Input() config: ISimpleDialogConfig;
  @Input() idSimple: string;
  @Input() isTableChildren: boolean;

  @Output() hideColumnDialog = new EventEmitter();
  @Output() showColumnDialog = new EventEmitter();
  @Output() changeFrozen = new EventEmitter();

  @ViewChild('menuHiding', { static: false }) menuHiding: any;

  onHideColumnDialog() {
    this.hideColumnDialog.emit();
  }

  onShowColDialog() {
    this.showColumnDialog.emit();
  }

  onChangeFrozen(ev) {
    this.changeFrozen.emit(ev);
  }
}
