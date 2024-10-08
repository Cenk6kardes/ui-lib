
import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { RbnCommonLibModule } from '../../../public_api';

export default {
  title: 'Rbn-dynamic-forms/DynamicSingleselect',
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

export const DynamicSingleselect = () => {
  const fields: FormlyFieldConfig[] = [
    {
      key: 'flavor',
      type: 'rbn-singleselect',
      templateOptions: {
        label: text('Flavor', 'Flavor'),
        placeholder: text('Placeholder', 'Select item'),
        required: boolean('Required', false),
        options: [
          { value: 1, label: 'Vanilla' },
          { value: 2, label: 'Cherry' },
          { value: 3, label: 'Grape' },
          { value: 4, label: 'Peach' }
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
