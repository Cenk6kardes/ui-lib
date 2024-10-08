import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { Component, AfterViewInit } from '@angular/core';

import { RbnMessageService } from '../../../services/rbn-message.service';
import { RbnCommonLibModule } from '../../../../public_api';

@Component({
  selector: 'rbn-toast-message',
  template: ''
})
class ToastComponent implements AfterViewInit {
  constructor(private messageService: RbnMessageService) { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.messageService.showSuccess('Success');
      this.messageService.showInfo('Info Message');
      this.messageService.showError('Error Message');
      this.messageService.showWarn('Warning Message');
    }, 500);
  }
}
export default {
  title: 'Components/NotificationsPage',
  decorators: [
    moduleMetadata({
      declarations: [ToastComponent],
      imports: [RbnCommonLibModule, BrowserAnimationsModule]
    })
  ]
};

export const Notifications = () => ({
  template: '<rbn-notifications></rbn-notifications><rbn-toast-message></rbn-toast-message>'
});
