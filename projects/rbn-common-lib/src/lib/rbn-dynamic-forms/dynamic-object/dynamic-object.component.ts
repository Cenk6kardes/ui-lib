import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-object',
  templateUrl: './dynamic-object.component.html',
  styleUrls: ['./dynamic-object.component.scss']
})
export class DynamicObjectComponent extends FieldType {
  defaultOptions = {
    defaultValue: {}
  };

  constructor() {
    super();
  }

}
