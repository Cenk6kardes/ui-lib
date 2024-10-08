import { MenuItem } from 'primeng/api';
import { ISearchGlobal } from './common-table';

export interface IPageTop {
  logo: {
    action?: any,
    image?: string,
    productName?: string,
    productNameSup?: string,
    noneUppercase?: boolean
  };
  productInfo?: {
    productTitle?: string,
    productDescription?: string
  };
  profiles: MenuItem[];
  profileIcon?: {
    name: string,
    noneBackground: boolean;
  };
  externalIcon?: {
    icon: string,
    label?: string,
    command?: Function;
    title?: string;
  }[];
  externalSearch?: ISearchGlobal;
  hasSearchOverLay?: boolean;
  searchList?: ISearchList[];
}

export interface ISearchList {
  title: string;
  [key: string]: any;
}

export interface IStatusIndicators {
  title: string,
  status: Status
}

export enum Status {
  SUCCESS = 'Success',
  FAULT = 'Fault',
  UNKNOWN = 'Unknown'
}
