import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';


@Component({
  selector: 'rbn-message-toggle-hidden',
  templateUrl: './message-toggle-hidden.component.html',
  styleUrls: ['./message-toggle-hidden.component.scss']
})
export class MessageToggleHiddenComponent {

  @Input() key;
  @Input() message: Message;

  constructor() { }

  clearMessage() {
    this.key = '';
    this.message = null;
  }
}
