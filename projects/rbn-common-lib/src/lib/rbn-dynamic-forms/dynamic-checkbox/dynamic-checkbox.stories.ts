import { moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { useArgs } from '@storybook/client-api';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { DynamicCheckboxComponent } from './dynamic-checkbox.component';
import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicCheckbox',
  component: DynamicCheckboxComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ]
    })
  ],
  argTypes: {
    model: { checkbox: { control: 'boolean' } },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

export const DynamicCheckbox = (args) => {
  const [{ model, label, description }, updateArgs] = useArgs();
  const toggleChecked = () => updateArgs({model: { checkbox: model.checkbox }});

  const fields: FormlyFieldConfig[] = [{
    key: 'checkbox',
    type: 'rbn-checkbox',
    templateOptions: {
      label: label,
      change: toggleChecked,
      description: description
    }
  }];

  const dataInput = { ...args, fields };
  return {
    component: DynamicFormComponent,
    props: dataInput
  };
};

DynamicCheckbox.args = {
  model: { checkbox: true },
  label: 'Check Box',
  description: 'Check Box description'
};
