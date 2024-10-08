export interface SideBar {
  path: string;
  data?: Data;
  children?: Array<SideBar>;
  icon?: string;
  route?: RoutePath;
  routeType?: string;
  expanded?: boolean;
  favIcon?: string;
  fullPath?: string;
  title?: string;
  sidebarLabel?: string;
  topLevel?: boolean;
  display?: string;
  id?: string;
  parentOfSelected?: boolean;
  disabled?: boolean;
  tag?: Tag;
  abbr?: string;
}

interface Data {
  menu: Menu;
}

interface Menu {
  title: string;
  sidebarLabel: string;
  icon?: string;
  topLevel?: boolean;
}

interface RoutePath {
  paths: string;
  fullPath: string;
}

export interface Tag {
  type: string;
  label?: string;
  color?: string;
  backgroundColor?: string;
  expiry?: number;
}

export enum RouteType {
  WebComponent = 'WC',
  IFrame = 'IFRAME',
  Internal = 'INTERNAL'
}

export enum TagType {
  New = 'NEW',
  Alpha = 'ALPHA',
  Beta = 'BETA',
  Custom = 'CUSTOM'
}
