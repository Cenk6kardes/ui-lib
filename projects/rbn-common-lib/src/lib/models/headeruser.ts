import { MenuItem } from 'primeng/api';

export class Headeruser {
  items: MenuItem[];
  username = '';
  logoutUrl = '';
  infoHeader = '';
  infoContent: string[];

  constructor(items: MenuItem[], username: string, logoutUrl: string, infoHeader: string, infoContent: string[]) {
    this.items = items;
    this.username = username;
    this.logoutUrl = logoutUrl;
    this.infoHeader = infoHeader;
    this.infoContent = infoContent;
  }
}
