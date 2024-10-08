
import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { useArgs } from '@storybook/client-api';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { RbnCommonLibModule } from '../../../public_api';
import { withKnobs, text } from '@storybook/addon-knobs';


export default {
  title: 'Rbn-dynamic-forms/DynamicRadioBox',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicRadioBox = () => {
  const  fields: FormlyFieldConfig[] = [
    {
      key: 'radio',
      type: 'rbn-radiobox',
      templateOptions: {
        label: 'Radio',
        required: false,
        options: [
          { value: 1, label: 'Red' },
          { value: 2, label: 'Green' },
          { value: 3, label: 'Blue' },
          { value: 4, label: 'Purple' }
        ]
      }
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
