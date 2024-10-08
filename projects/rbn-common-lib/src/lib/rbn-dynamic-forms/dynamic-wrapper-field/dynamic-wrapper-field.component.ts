import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-wrapper-field',
  templateUrl: './dynamic-wrapper-field.component.html',
  styleUrls: ['./dynamic-wrapper-field.component.scss']
})
export class DynamicWrapperFieldComponent extends FieldWrapper {

  constructor() {
    super();
  }
}
