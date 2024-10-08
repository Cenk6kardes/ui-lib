import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypeOfMessage } from '../models/panel-mesages';

@Component({
  selector: 'rbn-panel-messages',
  templateUrl: './panel-messages.component.html',
  styleUrls: ['./panel-messages.component.scss']
})
export class PanelMessagesComponent {
  enumTypeOfMessage = TypeOfMessage;
  @Input() title = '';
  @Input() content = '';
  @Input() typeOfMessage: string = TypeOfMessage.INFO;
  @Input() isClosable = false;
  @Output() closePanelMessages = new EventEmitter();

  constructor() { }

  closeMessages() {
    this.closePanelMessages.emit();
  }
}
