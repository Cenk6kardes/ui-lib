import {
  Component, ContentChildren, QueryList, AfterContentInit,
  OnChanges, EventEmitter, Input, Output, ViewEncapsulation, OnInit, ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { MenuItem } from 'primeng/api/menuitem';

import { InputFocusDirective } from '../../directives/input-focus.directive';
import { StepperTabComponent } from './stepper-tab/stepper-tab.component';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'rbn-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [InputFocusDirective]
})
export class StepperComponent implements AfterContentInit, OnInit, OnChanges {
  @Input() activeIndex = 0;
  @Input() previousIndex = -1;
  @Input() stepperTabs = [];
  @Input() form;
  @Input() templateStepperFooter: NgTemplateOutlet;

  // @Output properties
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() activeIndexChange: EventEmitter<any> = new EventEmitter();

  items: MenuItem[] = [];
  validatedStep = -1;
  validatedSteps = [];
  firstChange = true;
  card: any = [];
  editMode = false;
  isSubmitBtnClicked = false;
  crossStep = 1;

  @ContentChildren(StepperTabComponent) steps: QueryList<StepperTabComponent>;

  constructor(
    private validationService: ValidationService,
    private inputFocus: InputFocusDirective,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) { }

  ngAfterContentInit() {
    this.compileStepperTabs();
  }

  ngOnInit() {
    this.isEditModeOn();
    this.setStepperStepHeight();
  }

  isEditModeOn() {
    this.route.url.subscribe(url => {
      if ('edit' === url[0].path) {
        this.editMode = true;
      }
    });
  }

  compileStepperTabs() {
    this.items = [];
    this.steps.toArray().forEach((step: StepperTabComponent, index: number) => {
      step.id = index + 1;
      step.totalTabs = this.steps.length;
      step.label = this.stepperTabs[index].label;
      step.subText = this.stepperTabs[index].subText;
      step.description = this.stepperTabs[index].description;
      step.next = () => {
        this.handleNext();
      };
      step.prev = () => {
        this.handlePrevious();
      };
      step.editStep = (thisStepEdit?) => {
        this.goToStep(thisStepEdit, this.activeIndex);
      };
      if (index === this.activeIndex) {
        step.active = true;
      }
      this.items[index] = {
        label: step.label,
        command: (event: any) => {
          this.steps.toArray().forEach((thisStep: StepperTabComponent) => thisStep.active = false);
          step.active = true;
          this.activeIndex = index;
          this.activeIndexChange.emit(index);
        }
      };
      if (step.crossStep < this.crossStep) {
        step.crossStep = this.crossStep;
      }
      if (this.editMode && !this.validatedSteps.some((item) => item === index)) {
        this.validatedSteps.push(index);
      }
    });
  }

  updateSideTimeline() {
    setTimeout(() => {
      this.steps.toArray().forEach((step: StepperTabComponent) => {
        if (step.crossStep < step.id) {
          return;
        }
        if (this.validatedSteps.some((item) => (item + 1) === step.id)) {
          if (this.activeIndex !== (step.id - 1)) {
            this.getQuerySelector('.p-steps-item:nth-of-type(' + (step.id) + ')').classList.add('p-state-completed');
          } else {
            this.getQuerySelector('.p-steps-item:nth-of-type(' + (step.id) + ')').classList.remove('p-state-completed');
          }
        }
      });
    }, 1);
  }

  setStepperStepHeight() {
    const stepperSteps = this.getQuerySelectorAll('.p-steps-item');
    const stepHeight = (step: number) => {
      const stepperContentEl = this.getQuerySelector('#stepperContent' + step);
      if (stepperContentEl) {
        return stepperContentEl.offsetHeight / 2;
      }
    };
    setTimeout(function () {
      for (const index in stepperSteps) {
        if (stepperSteps.hasOwnProperty(index)) {
          const stepId = parseInt(index, 10);
          if (stepId === 0) {
            (stepperSteps[stepId] as HTMLElement).style['margin-top'] = stepHeight(stepId + 1) + 'px';
            (stepperSteps[stepId] as HTMLElement).style.height = '10px';
          } else {
            const cal = stepHeight(stepId + 1) + stepHeight(stepId) + 24;
            (stepperSteps[stepId] as HTMLElement).style.height = (cal - 5) + 'px';
          }
        }
      }
    }, 1);
    setTimeout(() => {
      this.setStepperStepHeight();
    }, 100);
  }

  ngOnChanges(changes: any) {
    if (!this.steps) {
      return;
    }
    for (const prop in changes) {
      if (prop === 'activeIndex') {
        this.activeIndex = changes[prop].currentValue;
        this.steps.toArray().forEach((step: StepperTabComponent, index: number) => {
          const selected = index === this.activeIndex;
          step.label = this.stepperTabs[index].label;
          step.subText = this.stepperTabs[index].subText;
          step.description = this.stepperTabs[index].description;
          step.active = selected;
          if (step.crossStep < this.crossStep) {
            step.crossStep = this.crossStep;
          }
          step.initializeConfirmBox();
        });
      }
    }
    this.setStepperStepHeight();
  }

  handlePrevious() {
    this.goToStep(this.activeIndex - 1, this.activeIndex);
    setTimeout(() => {
      this.inputFocus.focusFirstInput();
    }, 100);
  }

  handleNext() {
    if (this.isStepValid()) {
      if (this.crossStep <= this.activeIndex + 1) {
        this.crossStep = this.activeIndex + 2;
      }
      this.goToStep(this.activeIndex + 1, this.activeIndex);
      setTimeout(() => {
        this.inputFocus.focusFirstInput();
      }, 100);
    } else {
      this.inputFocus.onFormSubmit();
    }
  }

  isStepValid(stepIndex = null): boolean {
    if (stepIndex === null) {
      stepIndex = this.activeIndex;
    }
    const activeStep = this.steps.toArray().find(step => step.id === (stepIndex + 1));
    const valid = this.validationService.isStepValid(activeStep);
    if (activeStep) {
      activeStep.isValidStep = valid;
    }
    return valid;
  }

  isValidForm() {
    let fistStepInvalid = null;
    this.steps.toArray().forEach((step: StepperTabComponent) => {
      const stepIndex = step.id - 1;
      if (!this.validationService.isStepValid(step)) {
        if (fistStepInvalid === null) {
          fistStepInvalid = stepIndex;
        }
        this.validatedSteps = this.validatedSteps.filter(item => item !== stepIndex);
        step.isValidStep = false;
      } else {
        if (step.crossStep >= step.id) {
          this.validatedSteps.push(stepIndex);
          step.isValidStep = true;
        }
      }
    });

    if (fistStepInvalid !== null) {
      this.openStepper(fistStepInvalid, this.activeIndex);
      setTimeout(() => {
        this.inputFocus.onFormSubmit();
      }, 100);
      return false;
    }
    return true;
  }

  goToStep(index: number, previousStep = -1) {
    if (previousStep !== -1 && this.isStepValid(previousStep)) {
      if (!this.validatedSteps.some((item) => item === previousStep)) {
        this.validatedSteps.push(previousStep);
      }
    } else if (!this.isStepValid(previousStep)) {
      this.validatedSteps = this.validatedSteps.filter(item => item !== previousStep);
    }
    this.openStepper(index, previousStep);
  }

  openStepper(index, previousStep) {
    this.ngOnChanges({
      activeIndex: {
        currentValue: index,
        previousValue: previousStep,
        isFirstChange: () => false
      }
    });
    this.updateSideTimeline();
    this.activeIndexChange.emit(index);
  }

  clickSubmitBtn() {
    this.isSubmitBtnClicked = true;
    setTimeout(() => {
      this.isSubmitBtnClicked = false;
    }, 1000);

    if (this.isValidForm()) {
      this.submit.emit();
      this.updateSideTimeline();
    }
  }

  getQuerySelector(selector: string) {
    const elm = this.elementRef.nativeElement.querySelector(selector);
    return elm;
  }

  getQuerySelectorAll(selector: string) {
    const elm = this.elementRef.nativeElement.querySelectorAll(selector);
    return elm;
  }
}
