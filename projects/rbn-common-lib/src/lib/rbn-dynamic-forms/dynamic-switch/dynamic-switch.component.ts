import { Component } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-switch',
  template: `
    <div><p-inputSwitch
    binary="true"
    class="rbn-switch"
    [formControl]="formControl"
    [formlyAttributes]="field"
    (onChange)="to.change && to.change(field, $event)">
  </p-inputSwitch></div>
  `
})
export class DynamicSwitchComponent extends DynamicBaseComponent {
  constructor() {
    super();
    // this.defaultOptions.className += ' rbn-switch';
  }
}
