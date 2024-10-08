import { Component } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-button',
  template: `
    <div class="container-button"><button pButton type="button" icon="{{props.icon}}" [label]="props.text" [formlyAttributes]="field"
    (click)="onClick()" [disabled]="props.disabled"></button></div>
  `,
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent extends DynamicBaseComponent {

  constructor() {
    super();
  }

  onClick() {
    if (this.props && this.props.onClick) {
      this.props.onClick();
    }
  }
}
