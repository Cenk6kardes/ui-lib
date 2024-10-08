import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Rbn-dynamic-forms/DynamicArray',
  component: DynamicFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicArray = () => {
  const fields: FormlyFieldConfig[] =
  [
    {
      key: 'formArray',
      type: 'rbn-array',
      templateOptions: {
        label: 'Title',
        minItems: 1,
        maxItems: 2,
        removeText: 'Remove',
        addTooltip: 'Add another investment',
        removeTooltip: 'Remove investment',
        required: true,
        description: 'You must add at least a device',
        style: 'list-array-field',
        wrapItem: true
      },
      fieldArray: {
        fieldGroup: [
          {
            type: 'rbn-input',
            key: 'email',
            templateOptions: {
              label: 'Email',
              required: true
            }
          },
          {
            key: 'radiobox',
            type: 'rbn-radiobox',
            templateOptions: {
              label: 'Gender',
              options: [
                { label: 'Male', value: 1},
                { label: 'Female', value: 2}
              ]
            }
          }
        ]
      }
    }
  ];

  return {
    component: DynamicFormComponent,
    props: {
      model: {
        formArray: [
          { email: 'test@rbn.com', radiobox: 1 }
        ]
      },
      options: {},
      fields
    }
  };
};
