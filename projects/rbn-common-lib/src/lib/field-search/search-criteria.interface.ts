export interface SearchField {
  label: string;
  name: string;
  dataType?: string;
  type?: FieldType;
  required?: boolean;
  data?: SearchFieldData[] | {
    [props: string]: SearchFieldData[]
  };
  referencesField?: string;
}

export interface SearchFieldData {
  label: string;
  value: any;
  type?: string;
  referencesValue?: string;
  isRequiredValue?: boolean;
}

export enum FieldType {
  Input = 'input',
  Dropdown = 'dropdown',
  MultiSelect = 'multiselect'
}

export enum InputType {
  Text = 'text',
  Number = 'number'
}

export enum DataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Attribute = 'attribute',
  Enum = 'enum',
  MultiSelect = 'multiselect'
}

export interface SearchConfig {
  parameterField: SearchField;
  expressionField?: SearchField;
  valuesField?: SearchField;
  otherFields?: SearchField[];
  expressionStrValues?: SearchFieldData[];
  expressionNumValues?: SearchFieldData[];
  conditionValues?: SearchFieldData[];
  required?: boolean;
  bracketsEnable?: boolean;
  enumFieldItem?: object;
  buttonOptions?: ButtonOptions;
  hideLogical?: boolean;
}

export interface ButtonOptions {
  label?: string;
  tooltip?: string;
  showLabel?: boolean;
}

