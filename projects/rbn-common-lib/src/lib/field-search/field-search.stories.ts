import { FieldSearchComponent } from './field-search.component';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchConfig, FieldType } from './search-criteria.interface';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { SearchCriteriaModule } from './search-criteria.module';
import { withKnobs, number, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Field-Search/FieldSearch',
  component: FieldSearchComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        SearchCriteriaModule,
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ]
};

const searchConfigData: SearchConfig = {
  bracketsEnable: false,
  buttonOptions: {
    label: 'Add Criteria',
    tooltip: 'Add Criteria'
  },
  expressionField: {
    label: 'Operator',
    name: 'operator'
  },
  expressionStrValues: [
    { label: 'Contains', value: 'contains', type: 'input' },
    { label: 'Contains 1', value: 'contains1', type: 'input' },
    { label: 'Contains 2', value: 'contains2', type: 'input' },
    { label: 'Contains 3', value: 'contains3', type: 'input' }
  ],
  hideLogical: true,
  otherFields: [
    {
      data: [
        { label: 'Body', value: 'body' },
        { label: 'Body 1', value: 'body 1' }
      ],
      dataType: 'string',
      label: 'Scope',
      name: 'scope',
      required: true,
      type: FieldType.Dropdown
    }
  ],
  parameterField: {
    dataType: 'string',
    label: 'Parameter',
    name: 'parameter',
    type: FieldType.Input
  },
  required: true,
  valuesField: {
    name: 'value',
    label: 'Value',
    dataType: 'string',
    type: FieldType.Input
  }
};

const searchFormData = new FormArray([
  new FormGroup({
    operator: new FormControl('statswith'),
    parameter: new FormControl('parameter 1'),
    scope: new FormControl('body'),
    value: new FormControl('value 1')
  })
]);

const searchCriteriaFormData = new FormGroup({
  operator: new FormControl('ne'),
  parameter: new FormControl('parameter 1'),
  scope: new FormControl('body'),
  value: new FormControl('value 1')
});

export const FieldSearch = () => {
  const dataInput = {
    searchForm: searchFormData,
    searchConfig: object('searchConfig', searchConfigData)
  };
  return {
    template: `
      <rbn-field-search
        [searchConfig]="searchConfig"
        [searchForm]="searchForm">
      </rbn-field-search>
    `,
    props: dataInput
  };
};
