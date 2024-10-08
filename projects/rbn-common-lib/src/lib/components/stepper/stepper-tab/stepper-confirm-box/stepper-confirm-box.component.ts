import { Component, Input } from '@angular/core';

@Component({
  selector: 'rbn-stepper-confirm-box',
  templateUrl: './stepper-confirm-box.component.html'
})
export class StepperConfirmBoxComponent {
  @Input() for: any;
  editStep: any;
  index: any;

  generateId(type) {
    switch (type) {
      case 'contentBox': {
        return 'content' + this.index;
      }
      case 'edit': {
        return 'editconfirmbox_' + (this.index + 1);
      }
      default: {
        break;
      }
    }
  }
}
