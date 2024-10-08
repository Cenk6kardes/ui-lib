import { moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { useArgs } from '@storybook/client-api';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicCheckboxInputComponent } from './dynamic-checkbox-input.component';
import { NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';

export default {
  title: 'Rbn-dynamic-forms/DynamicCheckboxInputComponent',
  component: DynamicCheckboxInputComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ],
  argTypes: {
    model: { checkbox: { control: 'boolean' } },
    label: { control: 'text' }
  }
};

export const DynamicCheckbox = (args) => {
  const [{ model, label }, updateArgs] = useArgs();
  const toggleChecked = () => updateArgs({ checkbox: !model.checkbox });

  const fields: FormlyFieldConfig[] = [{
    'wrappers': ['rbn-form-group'],
    'templateOptions': { 'label': 'FM Dashboard' },
    'fieldGroup': [
      {
        'wrappers': ['rbn-form-chk-group'],
        'templateOptions': { 'label': 'Ownership Policy' },
        'fieldGroup': [
          {
            'key': 'dashboard.ownerPolicy.ownedEvents1',
            'type': 'rbn-checkbox',
            'templateOptions': {
              'label': 'Allow operations on owned events only'
            },
            'id': 'ownedEvents'
          },
          {
            'key': 'dashboard.eventListLimit.maxPerServer1',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'number',
              'label': 'Maximum per server',
              'integerRequired': true,
              'min': 1,
              'max': 200,
              'positionLabel': 'right'
            },
            'id': 'maxPerServer',
            'validators': {
              'validation': ['integer']
            }
          }
        ]
      },
      {
        'wrappers': ['rbn-form-chk-group'],
        'templateOptions': { 'label': 'Ownership Policy' },
        'fieldGroup': [
          {
            'key': 'dashboard.ownerPolicy.ownedEvents2',
            'type': 'rbn-checkbox',
            'templateOptions': {
              'label': 'Allow operations on owned events only'
            },
            'id': 'ownedEvents'
          },
          {
            'key': 'dashboard.eventListLimit.maxPerServer2',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'number',
              'label': 'Maximum per server',
              'integerRequired': true,
              'min': 1,
              'max': 200
            },
            'id': 'maxPerServer',
            'validators': {
              'validation': ['integer']
            }
          }
        ]
      }
    ]
  }];

  const dataInput = { ...args, fields };
  return {
    component: DynamicFormComponent,
    props: dataInput
  };
};

DynamicCheckbox.args = {
  model: { checkbox: true },
  label: 'Check Box Input'
};
