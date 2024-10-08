import { moduleMetadata } from '@storybook/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RbnCommonLibModule } from '../../../public_api';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

export default {
  title: 'Rbn-dynamic-forms/DynamicPanel',
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicPanel = () => {
  const fields: FormlyFieldConfig[] = [
    {
      key: 'footer',
      wrappers: ['rbn-form-panel'],
      templateOptions: {
        label: 'Title',
        disableSaveBtn: false
      },
      fieldGroup: [
        {
          key: 'id',
          type: 'rbn-input',
          templateOptions: {
            required: true,
            label: 'ID'
          }
        },
        {
          key: 'idcomment',
          type: 'rbn-textarea',
          templateOptions: {
            required: true,
            label: 'Comment'
          }
        },
        {
          key: 'trapsync',
          type: 'rbn-checkbox',
          templateOptions: {
            label: 'Enable Trap Sync'
          }
        },
        {
          key: 'color',
          type: 'rbn-radiobox',
          templateOptions: {
            label: 'Color',
            required: true,
            options: [
              { value: 1, label: 'Red' },
              { value: 2, label: 'Green' },
              { value: 3, label: 'Blue' },
              { value: 4, label: 'Purple' }
            ]
          }
        },
        {
          key: 'flavor',
          type: 'rbn-singleselect',
          templateOptions: {
            label: 'Flavor',
            placeholder: 'Placeholder',
            required: false,
            options: [
              { value: 1, label: 'Vanilla' },
              { value: 2, label: 'Cherry' },
              { value: 3, label: 'Grape' },
              { value: 4, label: 'Peach' }
            ]
          }
        },
        {
          key: 'Input',
          type: 'rbn-button',
          templateOptions: {
            text: 'Rotate Access Token'
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
