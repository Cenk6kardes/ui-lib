import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-checkbox-input',
  templateUrl: './dynamic-checkbox-input.component.html',
  styleUrls: ['./dynamic-checkbox-input.component.scss']
})
export class DynamicCheckboxInputComponent extends FieldWrapper {
  constructor() {
    super();
  }
}
