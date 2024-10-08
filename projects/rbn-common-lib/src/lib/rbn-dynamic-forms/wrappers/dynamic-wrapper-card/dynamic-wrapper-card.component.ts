import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-wrapper-card',
  templateUrl: './dynamic-wrapper-card.component.html',
  styleUrls: ['./dynamic-wrapper-card.component.scss']
})
export class DynamicWrapperCardComponent extends FieldWrapper {

  constructor() {
    super();
  }

}
