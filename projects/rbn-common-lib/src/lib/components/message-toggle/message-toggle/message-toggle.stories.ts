import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RbnCommonLibModule } from '../../../../public_api';
// import { RbnMessageToggleService } from '../../../services/rbn-message-toggle.service';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { AlertType } from '../../../models/toast';

@Component({
  selector: 'rbn-button-show-message',
  template: `<button pButton type="button" label="Show Message Success" style="color: white" (click)="onClickMessage()"></button><br><br>
  <button pButton type="button" label="Show Message Error" style="color: white" (click)="onClickMessageError()"></button><br><br>
  <button pButton type="button" label="Show Message Info" style="color: white" (click)="onClickMessageInfo()"></button><br><br>
  <button pButton type="button" label="Show Message Warn" style="color: white" (click)="onClickMessageWarn()"></button>`
})
class ToastComponent {
  typeMessage = 1;
  messageSuccess = 1;
  messageError = 1;
  messageInfo = 1;
  messageWarn = 1;
  constructor(private messageService: RbnMessageService) {
  }
  onClickMessageInfo() {
    this.messageService.showInfo('This is an error message ' + this.messageInfo, 'Title' + this.messageInfo);
    this.messageInfo++;
  }
  onClickMessageWarn() {
    this.messageService.showWarn('This is an error message ' + this.messageWarn);
    this.messageWarn++;
  }
  onClickMessageError() {
    this.messageService.showError('This is an error message ' + this.messageError);
    this.messageError++;
  }
  onClickMessage() {
    this.messageService.showSuccess('This is an success message ' + this.messageSuccess);
    this.messageSuccess++;
  }
}
export default {
  title: 'Message-Toggle/MessageToggle',
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

export const MessageToggle = () => ({
  template: '<rbn-button-show-message></rbn-button-show-message><rbn-message-toggle></rbn-message-toggle>'
});
