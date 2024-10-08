import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicObject',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicObject = () => {
  const fields: FormlyFieldConfig[] = [
    {
      key: 'dynamicObject',
      type: 'rbn-object',
      templateOptions: {
        label: 'Information',
        description: 'Description'
      },
      fieldGroup: [
        {
          type: 'rbn-input',
          key: 'string',
          templateOptions: {
            label: 'Name'
          }
        },
        {
          type: 'rbn-singleselect',
          key: 'gender',
          templateOptions: {
            label: 'Gender',
            options: [
              {label: 'Female', value: 1},
              {label: 'Male', value: 0}
            ]
          }
        }
      ]
    }
  ];
  return {
    component: DynamicFormComponent,
    props: {
      fields: fields,
      model: {}
    }
  };
};
