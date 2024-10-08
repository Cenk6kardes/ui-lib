import { Component, Input } from '@angular/core';

@Component({
  selector: 'rbn-notification-global',
  templateUrl: './notification-global.component.html',
  styleUrls: ['./notification-global.component.scss']
})
export class NotificationGlobalComponent {

  @Input() totalNotification = 0;
  @Input() onClickNotification: any;

  constructor() { }

}
