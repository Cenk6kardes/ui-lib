export interface AttributeCard {
  title: string;
  type: string;
  data?: Attribute[];
  action?: AttributeCardAction;
}

export interface Attribute {
  key: string;
  label: string;
  value: any;
  id?: string;
  type?: AttributeType;
  action?: AttributeLinkAction;
}

export interface AttributeCardAction {
  button?: ButtonAction;
  dropdown?: DropdownAction;
}

export interface AttributeLinkAction {
  navigateTo?: string;
  outlet?: string;
}

export interface ButtonAction {
  id: string;
  label: string;
}

// Dropdown to be enhanced
export interface DropdownAction {
  id: string;
}

export enum AttributeType {
  LINK = 'link',
  DATE = 'date',
  DATE_TIME = 'rbn-datetimepicker'
}
