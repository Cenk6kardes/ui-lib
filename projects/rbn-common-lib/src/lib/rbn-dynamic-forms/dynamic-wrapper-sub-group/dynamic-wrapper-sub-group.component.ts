import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-wrapper-sub-group',
  templateUrl: './dynamic-wrapper-sub-group.component.html',
  styleUrls: ['./dynamic-wrapper-sub-group.component.scss']
})
export class DynamicWrapperSubGroupComponent extends FieldWrapper {

  constructor() {
    super();
  }

}
