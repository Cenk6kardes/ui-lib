export interface SideNav {
  label?: string;
  icon?: string;
  link?: string;
  items?: Array<SideNav>;
  expand?: boolean;
  isActive?: boolean;
  function?: any;
  html?: string;
  isFirstLoad?: boolean;
}
