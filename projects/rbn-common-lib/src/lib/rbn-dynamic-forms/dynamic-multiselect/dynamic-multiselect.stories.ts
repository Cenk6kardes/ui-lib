import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';

import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { RbnCommonLibModule } from '../../../public_api';

export default {
  title: 'Rbn-dynamic-forms/DynamicMultiselect',
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

export const DynamicMultiselect = () => {
  const fields: FormlyFieldConfig[] = [
    {
      key: 'multiselect',
      type: 'rbn-multiselect',
      templateOptions: {
        label: text('label', 'Multi-select'),
        placeholder: text('placeholder', 'Choose'),
        required: boolean('required', true),
        options: [
          {label: 'Iron Man', value: 'iron_man'},
          {label: 'Captain America', value: 'captain_america'},
          {label: 'Black Widow', value: 'black_widow'},
          {label: 'Hulk', value: 'hulk'},
          {label: 'Captain Marvel', value: 'captain_marvel'}
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
