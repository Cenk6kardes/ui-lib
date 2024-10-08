import { DynamicButtonComponent } from './dynamic-button/dynamic-button.component';
import { DynamicTextareaComponent } from './dynamic-textarea/dynamic-textarea.component';
import { DynamicFileInputComponent } from './dynamic-file-input/dynamic-file-input.component';
import { DynamicCheckboxComponent } from './dynamic-checkbox/dynamic-checkbox.component';
import { DynamicRadioboxComponent } from './dynamic-radiobox/dynamic-radiobox.component';
import { DynamicSingleselectComponent } from './dynamic-singleselect/dynamic-singleselect.component';
import { DynamicMultiselectComponent } from './dynamic-multiselect/dynamic-multiselect.component';
import { DynamicArrayComponent } from './dynamic-array/dynamic-array.component';
import { DynamicObjectComponent } from './dynamic-object/dynamic-object.component';
import { DynamicSwitchComponent } from './dynamic-switch/dynamic-switch.component';
import { DynamicDatetimepickerComponent } from './dynamic-datetimepicker/dynamic-datetimepicker.component';
import { DynamicCheckboxInputComponent } from './dynamic-checkbox-input/dynamic-checkbox-input.component';
import { DynamicLabelComponent } from './dynamic-label/dynamic-label.component';
import { DynamicFileUploadsComponent } from './dynamic-file-uploads/dynamic-file-uploads.component';
import { DynamicMessagesComponent } from './dynamic-messages/dynamic-messages.component';
import { DynamicShowPasswordComponent } from './dynamic-show-password/dynamic-show-password.component';

export const RbnFormControlTypes = [
  {
    name: 'rbn-button',
    component: DynamicButtonComponent
  },
  {
    name: 'rbn-input',
    extends: 'input',
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-number',
    extends: 'rbn-input',
    defaultOptions: {
      templateOptions: {
        type: 'number'
      }
    }
  },
  {
    name: 'rbn-textarea',
    component: DynamicTextareaComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-file-input',
    component: DynamicFileInputComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-file-uploads',
    component: DynamicFileUploadsComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-messages',
    component: DynamicMessagesComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-checkbox',
    component: DynamicCheckboxComponent
  },
  {
    name: 'rbn-radiobox',
    component: DynamicRadioboxComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-singleselect',
    component: DynamicSingleselectComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-multiselect',
    component: DynamicMultiselectComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-array', component: DynamicArrayComponent
  },
  {
    name: 'rbn-object', component: DynamicObjectComponent
  },
  {
    name: 'rbn-switch',
    component: DynamicSwitchComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-datetimepicker',
    component: DynamicDatetimepickerComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-label',
    component: DynamicLabelComponent
  },
  {
    name: 'rbn-label-field',
    component: DynamicLabelComponent,
    wrappers: ['rbn-wrapper-field']
  },
  {
    name: 'rbn-show-password',
    component: DynamicShowPasswordComponent,
    wrappers: ['rbn-wrapper-field']
  }
];

