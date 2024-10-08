import { Component } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-messages',
  templateUrl: './dynamic-messages.component.html'
})
export class DynamicMessagesComponent extends DynamicBaseComponent {

  constructor() {
    super();
  }

}
