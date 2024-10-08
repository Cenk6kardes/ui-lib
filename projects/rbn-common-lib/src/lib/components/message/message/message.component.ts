import { Component, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { TFrom, Types } from '../../../models/toast';
import { RbnMessageService } from '../../../services/rbn-message.service';

@Component({
  selector: 'rbn-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @ViewChild(Toast, { static: true }) toast!: Toast;
  TFrom = TFrom;

  constructor(private messageService: RbnMessageService) { }

  onClearAll() {
    this.messageService.clear();
  }

  customCloseToasts(message: Message) {
    const index = this.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    if (index !== -1) {
      this.toast.messages.splice(index, 1);
    }
  }

  isDisplayClearAll() {
    return this.toast && this.toast.messages && this.toast.messages.length > 0;
  }

  closeToasts(e: any) {
    this.messageService.SendMessage({ type: Types.CLOSE_ITEM, message: e.message });
  }

  getToastZIndex() {
    const zIndex = this.toast.containerViewChild?.nativeElement.style?.zIndex;
    return zIndex;
  }
}
