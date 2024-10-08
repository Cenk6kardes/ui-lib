import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'rbn-base',
  template: '<p>dynamic-base works!</p>'
})
export class DynamicBaseComponent extends FieldType {

  defaultOptions: any;

  constructor() {
    super();
    this.defaultOptions = {
      templateOptions: {
      }
    };
  }
}
