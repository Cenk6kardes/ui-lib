import { Component } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-textarea',
  template: `
      <textarea [rows]="to.rows" [formControl]="formControl" [formlyAttributes]="field" pInputTextarea
      [class.is-invalid]="showError"></textarea>
  `
})
export class DynamicTextareaComponent extends DynamicBaseComponent {

  constructor() {
    super();
  }

}
