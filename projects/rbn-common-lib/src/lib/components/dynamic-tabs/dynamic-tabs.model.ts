import { MenuItem } from 'primeng/api';

export interface DropdownOption {
  id: string;
  name: string;
  disabled?: boolean;
}

export interface TabMenuItem extends MenuItem {
  displayRefresh?: boolean;
  apiUrls?: string[];
}
