import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { Subject } from 'rxjs';
// Local imports
import { GeneralService, RbnCommonLibModule, ValidationService } from '../../../public_api';
// import { FormControlValidationDirective } from '../../directives/form-control-validation.directive';
// import { FormGroupValidationDirective } from '../../directives/form-group-validation.directive';
import { FieldErrorComponent } from './field-error/field-error.component';
import { StepperTabComponent } from './stepper-tab/stepper-tab.component';
import { StepperComponent } from './stepper.component';
import { StepperModule } from './stepper.module';


class GeneralServiceMock {
  getId(idString: string) {
    return idString.replace(/[^a-zA-Z0-9_]/g, '');
  }

  /**
  * The download the file from Analytics
  * @param url - Url : where file is located
  */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fileDownload(url) { }

  /**
   * Convert the epoc into Date
   *
   * @param epoc - date integer value
   * @param format - date format. ex: 'yyyy/MM/dd HH:mm:ss'
   */
  epocToDate(epoc, format) {
    return new Date();
  }
}
class ValidationServiceMock {
  private onstepperNext$: Subject<string[]> = new Subject<string[]>();

  /**
   * Checks if a step is valid by querying the steps HTML for invalid controls.
   *
   * @param step the step to validate
   * @returns true if the step is valid, false otherwise
   */
  isStepValid(step: StepperTabComponent): boolean {
    const invalidControls: string[] = [];
    if (!step && !step?.elementRef) {
      return;
    }
    const controls = step?.elementRef?.nativeElement?.querySelectorAll('.ng-invalid');
    if (!controls) {
      return;
    }
    controls.forEach(control => {
      const controlName = control.getAttribute('formcontrol') || control.getAttribute('formcontrolname');
      if (controlName) {
        invalidControls.push(controlName);
      }
    });

    const arrControls = Array.prototype.slice.call(controls);
    const invalidControlsTetst = arrControls?.filter(
      control => control.getAttribute('formcontrol') || control.getAttribute('formcontrolname')
    );
    this.onStepperNext(invalidControls);
    return invalidControls.length === 0;
  }

  /**
   * Broadcasts a list of all invalid controls to listening form control
   * validation directives to show error messages
   *
   * @param invalidControls list containing the names of all invalid controls
   */
  private onStepperNext(invalidControls: string[]) {
    if (invalidControls.length) {
      this.onstepperNext$.next(invalidControls);
    }
  }

  /**
   * Used by the form control validation directives to subscribe to
   * on stepper next events
   *
   * @returns the on stepper next observable
   */
  getStepperNext() {
    return this.onstepperNext$.asObservable();
  }
}

export default {
  title: 'Components/Stepper',
  components: StepperComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        StepsModule,
        StepperModule,
        RbnCommonLibModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], { useHash: true, relativeLinkResolution: 'legacy' })
      ],
      providers: [
        { provide: ValidationService, useClass: ValidationServiceMock },
        { provide: GeneralService, useClass: GeneralServiceMock }
      ],
      declarations: [
        // FormGroupValidationDirective,
        // FormControlValidationDirective
      ],
      entryComponents: [
        FieldErrorComponent
      ]
    })
  ],
  argTypes: {
    activeIndex: { control: 'number' },
    previousIndex: { control: 'number' },
    stepperTabs: { control: 'object' },
    items: { control: 'object' },
    steps: { control: 'object' }
  }
};

const validationMessages = {
  name: {
    required: 'required',
    minlength: 'The field should contain at least 5 letters. '
  }
};

const fb = new FormBuilder();

const stepperForm = fb.group({
  name: new FormControl('', [Validators.required, Validators.minLength(5)]),
  description: new FormControl(''),
  password: new FormControl('', Validators.required),
  rePassword: new FormControl('', Validators.required),
  fieldName: new FormControl('', Validators.required),
  fieldName1: new FormControl('', Validators.required),
  userPasswordDes: new FormControl('')
});

export const Stepper = () => {

  const dataInput = {
    onSubmit: () => {
      console.log('Form submitted');
    },
    onCancel: () => {
      console.log('Form cancelled');
    },
    activeIndexChange: action('activeIndexChange'),
    form: stepperForm,
    validationMessages: validationMessages,
    stepperTabs: [
      {
        label: 'User Details',
        description: 'Specify the User name, Password and description for the new user.',
        id: 0
      },
      {
        label: 'User and Password Status',
        description: 'Extra information here...',
        id: 1
      },
      {
        label: 'User Groups',
        description: 'Extra information here...',
        id: 2
      }
    ]
  };
  return {
    template: `
    <form autocomplete="off" [formGroup]="form" [validationMessages]="validationMessages">
    <rbn-stepper class="vertical-wizard"
    [form]="stepperForm"
    [stepperTabs]="stepperTabs"
    (submit)="onSubmit()"
    (cancel)="onCancel()">
      <rbn-stepper-tab>
        <div class="p-grid">
          <div class="p-col-12 p-md-6">
            <label for="name" title="User Name">User Name: <span class="mandatory">*</span></label>
            <div><input type="text" pInputText id="name" autofocus formControlName="name" placeholder="User Name"
              class="p-inputtext p-corner-all p-state-default p-widget" /></div>
          </div>
          <div class="p-col-12 p-md-6">
            <label for="description" title="Description">Description:</label>
            <input type="text" pInputText id="description" formControlName="description" placeholder="Description"
              class="p-inputtext p-corner-all p-state-default p-widget" />
          </div>

          <div class="p-md-6 p-col-12">
            <label for="password" title="password">Password: <span class="mandatory">*</span></label>
            <input type="password" pInputText id="password" placeholder="Password" 
              class="p-inputtext p-corner-all p-state-default p-widget p-mb-1" formControlName="password"/>
          </div>

          <div class="p-md-6 p-col-12">
            <label for="rePassword" for="rePassword" title="rePassword">Re-Enter Password: <span class="mandatory">*</span></label>
            <input type="password" pInputText id="rePassword" placeholder="Re-Enter Password" 
              class="p-inputtext p-corner-all p-state-default p-widget p-mb-1" formControlName="rePassword"/>
          </div>
        </div>
      </rbn-stepper-tab>
      <rbn-stepper-tab>
        <div class="p-grid">
          <div class="p-col-12 p-md-4">
            <label for="fieldName" title="Field Name"> Field Name: <span class="mandatory">*</span></label>
            <input type="text" pInputText id="fieldName" autofocus formControlName="fieldName" placeholder="Field Name" 
              class="p-inputtext p-corner-all p-state-default p-widget" />
          </div>
        <div class="p-col-12 p-md-4">
          <label for="fieldName1" title="Field Name">Field Name: <span class="mandatory">*</span></label>
          <input type="text" pInputText id="fieldName1" formControlName="fieldName1" placeholder="Field Name"
            class="p-inputtext p-corner-all p-state-default p-widget" />
        </div>
        <div class="p-col-12 p-md-4">
          <label for="userPasswordDes" title="Description">Description:</label>
          <input type="text" pInputText id="userPasswordDes" formControlName="userPasswordDes" placeholder="Description"
            class="p-inputtext p-corner-all p-state-default p-widget" />
        </div>
      </div>
      </rbn-stepper-tab>
      <rbn-stepper-tab>
        <rbn-stepper-confirm-box [for]="1">
          <div class="p-col-10 confirm-item" *ngIf="form['controls']['name'].value">
            <div class="confirm-title">Destination name:</div>
            <div class="confirm-value">{{ form['controls']['name'].value }}</div>
          </div>
          <div class="p-col-10 confirm-item" *ngIf="form['controls']['description'].value">
            <div class="confirm-title">Destination description:</div>
            <div class="confirm-value">{{ form['controls']['description'].value }}</div>
          </div>
        </rbn-stepper-confirm-box>
        <rbn-stepper-confirm-box [for]="2">
          <div class="p-col-10 confirm-item" *ngIf="form['controls']['fieldName'].value">
            <div class="confirm-title">Location name:</div>
            <div class="confirm-value">{{ form['controls']['fieldName'].value }}</div>
          </div>
          <div class="p-col-10 confirm-item" *ngIf="form['controls']['fieldName1'].value">
            <div class="confirm-title">Location description:</div>
            <div class="confirm-value">{{ form['controls']['fieldName1'].value }}</div>
          </div>
        </rbn-stepper-confirm-box>
      </rbn-stepper-tab>
    </rbn-stepper>
  </form>`,
    props: dataInput
  };
};
