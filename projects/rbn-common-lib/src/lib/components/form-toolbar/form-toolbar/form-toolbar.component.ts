import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormToolbarEmit } from '../form-toolbar.model';

@Component({
  selector: 'rbn-form-toolbar',
  templateUrl: './form-toolbar.component.html',
  styleUrls: ['./form-toolbar.component.scss']
})
export class FormToolbarComponent {

  @Input() disabledSecondary = false;
  @Input() disabledPrimary = false;
  @Input() displaySecondary = true;
  @Input() secondaryLabel = '';
  @Input() primaryLabel = '';
  @Input() className = 'transparent';
  @Input() toolbarId = '';

  @Output() buttonClickedEmit = new EventEmitter();


  constructor() { }

  secondaryClick() {
    this.buttonClickedEmit.emit(FormToolbarEmit.secondary);
  }

  primaryClick() {
    this.buttonClickedEmit.emit(FormToolbarEmit.primary);
  }
}
