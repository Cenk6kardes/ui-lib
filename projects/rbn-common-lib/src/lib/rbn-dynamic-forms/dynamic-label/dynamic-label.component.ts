import { Component } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-label',
  templateUrl: './dynamic-label.component.html',
  styleUrls: ['./dynamic-label.component.css']
})
export class DynamicLabelComponent extends DynamicBaseComponent {

  constructor() {
    super();
  }

}
