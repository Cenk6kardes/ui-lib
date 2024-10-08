import { moduleMetadata } from '@storybook/angular';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicInput',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicInput = () => ({
  component: DynamicFormComponent,
  props: {
    fields: [
      {
        key: 'name',
        type: 'rbn-input',
        templateOptions: {
          label: text('label', 'Name'),
          required: boolean('required', true),
          placeholder: text('placeholder', 'Placeholder'),
          description: 'description for input'
        }
      }
    ],
    model: {}
  }
});

