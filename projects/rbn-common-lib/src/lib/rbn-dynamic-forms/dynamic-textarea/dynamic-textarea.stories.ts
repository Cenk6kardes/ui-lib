import { moduleMetadata } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicTextarea',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicTextarea = () => {
  const  fields: FormlyFieldConfig[] = [
    {
      key: 'idcomments',
      type: 'rbn-textarea',
      templateOptions: {
        label: text('Comments', 'Comments'),
        placeholder: text('Placeholder', 'Placeholder')
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
