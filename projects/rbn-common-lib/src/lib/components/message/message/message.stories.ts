import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RbnCommonLibModule } from '../../../../public_api';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { AlertType } from '../../../models/toast';

@Component({
  selector: 'rbn-button-show-message',
  template: '<button pButton type="button" label="Show Message" style="color: white" (click)="onClickMessage()"></button>'
})
class ToastComponent {
  typeMessage = 1;
  constructor(private messageService: RbnMessageService) { }
  onClickMessage() {
    switch (this.typeMessage) {
      case 1: {
        this.messageService.showSuccess('This is a success message.');
        this.messageService.setAlerType(AlertType.BASIC);
        break;
      }
      case 2: {
        this.messageService.showInfo('This is a large informational message from the system that need more description space for display');
        break;
      }
      case 3: {
        this.messageService.showError('This is an error message.');
        this.messageService.setAlerType(AlertType.LARGE);
        break;
      }
      case 4: {
        this.messageService.showWarn('This is a large warning message from the system that need more description space for display');
        this.typeMessage = 0;
        break;
      }
      default:
        this.messageService.showSuccess('This is a success message.');
        this.typeMessage = 0;
    }
    this.typeMessage++;
  }
}
export default {
  title: 'Components/MessagePage',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [ToastComponent],
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule,
        ButtonModule,
        ToastModule
      ]
    })
  ]
};

export const Message = () => ({
  template: '<rbn-button-show-message></rbn-button-show-message><rbn-message></rbn-message>'
});
