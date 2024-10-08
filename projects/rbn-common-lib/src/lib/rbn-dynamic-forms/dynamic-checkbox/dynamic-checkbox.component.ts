import { Component, OnInit } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-checkbox',
  template: `
    <div class="container-checkbox rbn-checkbox"><p-checkbox
      binary="true"
      checkboxIcon="fa fa-check"
      [label]="to.label"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (onChange)="to.change && to.change(field, $event)">
    </p-checkbox>
    <span *ngIf="to.description" class="rbn-help-info"><i class="fa fa-info-circle" [pTooltip]="to.description"></i></span>
    </div>
  `,
  styleUrls: ['./dynamic-checkbox.component.scss']
})
export class DynamicCheckboxComponent extends DynamicBaseComponent implements OnInit {
  constructor() {
    super();
    this.defaultOptions.templateOptions = {
      hideLabel: true
    };
  }

  ngOnInit() {
    if (this.formControl && this.formControl.value && typeof(this.formControl.value) === 'string') {
      this.formControl.setValue(JSON.parse(this.formControl.value));
    }
  }
}
