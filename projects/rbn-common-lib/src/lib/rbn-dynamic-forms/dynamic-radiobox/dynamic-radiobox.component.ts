import { Component, OnInit } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-radiobox',
  template: `
    <div class="container-radio">
      <div *ngFor="let option of to.options" class='rbn-radio'>
        <p-radioButton
          [id]="field.id ? field.id + option.value : option.value"
          [name]="option"
          [formControl]="formControl"
          [(ngModel)]="selectedValue"
          [value]="option.value"
          [label]="option.label"
          (onClick)="to.change && to.change(field, selectedValue)"
        >
        </p-radioButton>
      </div>
    </div>
  `,
  styleUrls: ['./dynamic-radiobox.component.scss']
})
export class DynamicRadioboxComponent extends DynamicBaseComponent implements OnInit {
  selectedValue: any = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.formControl) {
      this.selectedValue = this.formControl.value;
    }
  }
}
