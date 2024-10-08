export interface IColsPickList {
  field: string;
  header: string;
  type?: FilterTypesPickList;
  bodyTextType?: BodyTextType;
  typeHide?: TypeHide;
  sort?: boolean;
}

export enum FilterTypesPickList {
  InputText = 1
}

export enum BodyTextType {
  Dropdown = 1,
  Text = 2,
  Multiselect = 3
}

export enum TypeHide {
  SOURCE = 'SOURCE',
  TARGET = 'TARGET',
  ALL = 'ALL'
}

export interface ILabelPickList {
  labelSource?: string;
  labelTarget?: string;
}

export interface IPaginatorConfig {
  id: TypePickList;
  numberRowPerPage: number;
  totalRecords?: number;
  rowsPerPageOptions?: number[];
  isUsingAppendTo?: boolean;
  resetPage?: boolean;
}

export interface IPageChangeEvent {
  // Index of first record
  first: number;
  // Index of the new page
  page: number;
  // Total number of pages
  pageCount: number;
  // Number of rows to display in new page
  rows: number;
  // Id Paginator
  id: string;
}

export enum TypePickList {
  SOURCE = 'SOURCE',
  TARGET = 'TARGET'
}




