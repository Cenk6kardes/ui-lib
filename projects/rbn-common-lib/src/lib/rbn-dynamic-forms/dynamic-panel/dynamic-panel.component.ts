import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-form-panel',
  templateUrl: './dynamic-panel.component.html',
  styleUrls: ['./dynamic-panel.component.scss']
})
export class DynamicPanelComponent extends FieldWrapper {
  @Output() emitSubmitEvent = new EventEmitter();
  @Output() emitCancelEvent = new EventEmitter();

  constructor() {
    super();
  }

  // emit close key
  submitEvent() {
    if (this.props && this.props.submit) {
      this.props.submit();
    }
  }

  // emit close key
  cancelEvent() {
    if (this.props && this.props.cancel) {
      this.props.cancel();
    }
  }
}
