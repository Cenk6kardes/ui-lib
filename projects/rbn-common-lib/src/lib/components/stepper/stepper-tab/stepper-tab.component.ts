import { AfterContentInit, Component, ContentChildren, ElementRef, Input, QueryList } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { StepperConfirmBoxComponent } from './stepper-confirm-box/stepper-confirm-box.component';


@Component({
  selector: 'rbn-stepper-tab',
  templateUrl: './stepper-tab.component.html'
})
export class StepperTabComponent implements AfterContentInit {
  label = '';
  subText = '';
  description = '';
  active = false;
  id: any;
  totalTabs: any;
  next: any;
  prev: any;
  editStep: any;
  isValidStep = false;
  crossStep = 1;

  @Input() localValidation = false;
  @ContentChildren(StepperConfirmBoxComponent) confirmBox: QueryList<StepperConfirmBoxComponent>;

  constructor(public elementRef: ElementRef, public general: GeneralService) { }

  ngAfterContentInit() {
    this.initializeConfirmBox();
  }

  initializeConfirmBox() {
    this.confirmBox.toArray().forEach((confirm: StepperConfirmBoxComponent, index: number) => {
      confirm.index = index;
      confirm.editStep = (step?) => {
        this.editStep(step);
      };
    });
  }

  isPreviousButtonHidden() {
    if (this.id === 1) {
      return true;
    } else {
      return false;
    }
  }

  isNextButtonHidden() {
    if (this.id === this.totalTabs) {
      return true;
    } else {
      return false;
    }
  }

  createEditId() {
    return this.general.getId('edit_' + this.label);
  }

  canEdit() {
    if ((!this.active && this.isValidStep) || (this.id <= this.crossStep)) {
      return true;
    }
    return false;
  }

  goToStep(stepId) {
    if (this.canEdit()) {
      this.editStep(stepId);
    }
    return;
  }
}
