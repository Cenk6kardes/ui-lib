import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rbn-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor() {}

  @Input() title = '';
  @Input() content = '';
  @Input() titleAccept = '';
  @Input() titleReject = '';
  @Input() isShowConfirmDialog = true;
  @Input() confirmDialogName = '';
  @Input() hideReject = false;
  @Input() isFocusToOldElmOnHide = true;
  @Input() useInnerHtml = true;
  @Output() emitConfirm = new EventEmitter();

  accept() {
    this.emitConfirm.emit(true);
  }

  reject() {
    this.emitConfirm.emit(false);
  }
}
