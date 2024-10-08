import { moduleMetadata } from '@storybook/angular';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicFileInput',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicFileInput = () => {
  const fields: FormlyFieldConfig[] = [{
    key: 'file',
    type: 'rbn-file-input',
    templateOptions: {
      label: text('label', 'File input'),
      required: boolean('required', true),
      onChange: (files) => {
        action('onChange')(files);
      },
      onRemove: () => {
        action('onRemove')('Removed!');
      }
    }
  }];
  return {
    component: DynamicFormComponent,
    props: {
      fields: fields,
      model: {file: {name: 'TestFile.ts'}}
    }
  };
};
