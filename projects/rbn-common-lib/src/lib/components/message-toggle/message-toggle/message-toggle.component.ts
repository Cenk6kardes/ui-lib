import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { TFrom, Types } from '../../../models/toast';
import { MessageToggle, Severity } from '../../../models/toast';
import { RbnMessageService } from '../../../services/rbn-message.service';


@Component({
  selector: 'rbn-message-toggle',
  templateUrl: './message-toggle.component.html',
  styleUrls: ['./message-toggle.component.scss']
})
export class MessageToggleComponent implements DoCheck, AfterViewInit, OnDestroy {

  @Input() toastKey;
  @Input() contentId = 'pToastMessageContent';
  @Input() showLatestMessage = false; // display the latest message on top
  @Output() messages = new EventEmitter();

  @ViewChild(Toast, { static: true }) toast!: Toast;
  TFrom = TFrom;

  messageSuccess: MessageToggle;
  messageError: MessageToggle;
  messageInfo: MessageToggle;
  messageWarn: MessageToggle;
  ISeverity = Severity;
  recentMessage: Message;
  observer: MutationObserver;

  constructor(private messageService: RbnMessageService, public el: ElementRef) {
    this.setValueMessage();
  }

  ngDoCheck(): void {
    if (this.toast !== undefined) {
      if (this.toast.messages) {
        this.resetValuetMessage();
        this.toast.messages.map((m, index) => {
          if (m.key === this.toastKey) {
            switch (m.severity) {
              case this.ISeverity.SUCCESS:
                this.sortMessage(m, index, this.messageSuccess.count);
                this.messageSuccess.count++;
                this.messageSuccess.messages.push(m);
                break;
              case this.ISeverity.ERROR:
                this.sortMessage(m, index, this.messageError.count);
                this.messageError.count++;
                this.messageError.messages.push(m);
                break;
              case this.ISeverity.INFO:
                this.sortMessage(m, index, this.messageInfo.count);
                this.messageInfo.count++;
                this.messageInfo.messages.push(m);
                break;
              case this.ISeverity.WARN:
                this.sortMessage(m, index, this.messageWarn.count);
                this.messageWarn.count++;
                this.messageWarn.messages.push(m);
                break;
              default:
                break;
            }
            this.recentMessage = m;
          }
        });

        this.setActionToggleMessage(this.messageSuccess.count, this.ISeverity.SUCCESS, this.messageSuccess.toggle);
        if (this.messageSuccess.count === 0) {
          this.messageSuccess.toggle = true;
        }
        this.setActionToggleMessage(this.messageError.count, this.ISeverity.ERROR, this.messageError.toggle);
        if (this.messageError.count === 0) {
          this.messageError.toggle = true;
        }
        this.setActionToggleMessage(this.messageInfo.count, this.ISeverity.INFO, this.messageInfo.toggle);
        if (this.messageInfo.count === 0) {
          this.messageInfo.toggle = true;
        }
        this.setActionToggleMessage(this.messageWarn.count, this.ISeverity.WARN, this.messageWarn.toggle);
        if (this.messageWarn.count === 0) {
          this.messageWarn.toggle = true;
        }
      }
      this.messages.emit(this.toast.messages);
    }
  }

  ngAfterViewInit(): void {
    if (this.toast?.containerViewChild?.nativeElement) {
      const containerViewChild = this.toast.containerViewChild.nativeElement as HTMLElement;
      this.observerDOMToast(containerViewChild);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setActionToggleMessage(count, severity, status) {
    const arrEl = this.el.nativeElement.querySelectorAll('.p-toast-message-' + severity);
    if (count > 1) {
      if (status) {
        arrEl.forEach((el, index) => {
          if (arrEl.length <= count) {
            // Add message
            if (this.showLatestMessage) {
              // show btn toggle at the end message
              if (index === arrEl.length - 1) {
                el.classList.add('toggle-message');
              } else {

                if (el.classList.contains('toggle-message')) {
                  // remove toggle-message class of another class
                  el.classList.remove('toggle-message');
                }

                if (el.classList.contains('toggle-message-show')) {
                  // remove toggle-message-show class of another class
                  el.classList.remove('toggle-message-show');
                }

                // another message is hided
                el.setAttribute('style', 'display: none;');
              }

            } else {
              // show btn toggle at the first message
              if (index === 0) {
                el.classList.add('toggle-message');
              } else {
                // another message is hided
                el.setAttribute('style', 'display: none;');
              }
            }

          } else {
            // Close message
            if (this.showLatestMessage) {
              // Close latest message
              if (index === arrEl.length - 2) {
                el.classList.add('toggle-message');
                if (el.getAttribute('style') === 'display: none;') {
                  if (el.classList.contains('status-message-hide')) {
                    el.classList.replace('status-message-hide', 'status-message-show');
                  } else {
                    el.classList.add('status-message-show');
                  }
                }
              }
            } else {
              // Close message haven't show latest message
              if (index === 1) {
                el.classList.add('toggle-message');
                if (el.getAttribute('style') === 'display: none;') {
                  if (el.classList.contains('status-message-hide')) {
                    el.classList.replace('status-message-hide', 'status-message-show');
                  } else {
                    el.classList.add('status-message-show');
                  }
                }
              } else if (index > 1) {
                el.setAttribute('style', 'display: none;');
              }
            }
          }
        });
      }

    } else {
      if (this.showLatestMessage && this.toast.messages.length === 1) {
        // Close latest message when toast have two messages
        const el = arrEl && arrEl[0];
        if (el) {
          if (el.getAttribute('style') === 'display: none;') {
            if (el.classList.contains('status-message-hide')) {
              el.classList.replace('status-message-hide', 'status-message-show');
            } else {
              el.classList.add('status-message-show');
            }
          }
        }
      } else {
        if (arrEl.length !== count && count === 1) {
          const el = arrEl[1];
          if (el) {
            if (el.classList.contains('status-message-hide')) {
              el.classList.replace('status-message-hide', 'status-message-show');
            } else {
              el.classList.add('status-message-show');
            }
          }
        }
      }
    }
  }

  countTypeMessage(messages: Message[], type: string) {
    let count = 0;
    messages.forEach((m: Message) => {
      if (m.severity === type) {
        count++;
      }
    });
    return count;
  }

  sortMessage(m: Message, index, count): void {
    if (this.showLatestMessage) {
      const countType = this.countTypeMessage(this.toast.messages, m.severity);
      // show button action at the latest message
      m['showAction'] = true;
      if (count < countType - 1) {
        // reset the value show button action for all remaining message
        m['showAction'] = false;
      }
      if (count !== 0) {
        if (m.severity !== this.toast.messages[index - 1].severity) {
          this.toast.messages.splice(index, 1);
          this.toast.messages.splice(index - 1, 0, m);
        }
      }
    } else {
      if (count === 0) {
        m['showAction'] = true;
      } else {
        m['showAction'] = false;
        if (m.severity !== this.toast.messages[index - 1].severity) {
          this.toast.messages.splice(index, 1);
          this.toast.messages.splice(index - 1, 0, m);
        }
      }
    }
  }

  setValueMessage() {
    const message = {
      count: 0,
      messages: [],
      toggle: true
    };
    this.messageSuccess = { ...message };
    this.messageError = { ...message };
    this.messageInfo = { ...message };
    this.messageWarn = { ...message };
  }

  resetValuetMessage() {
    this.messageSuccess.count = 0;
    this.messageSuccess.messages = [];
    this.messageError.count = 0;
    this.messageError.messages = [];
    this.messageInfo.count = 0;
    this.messageInfo.messages = [];
    this.messageWarn.count = 0;
    this.messageWarn.messages = [];
    this.messages.emit(this.toast.messages);
  }


  customCloseToasts(message: Message) {
    const index = this.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    if (index !== -1) {
      this.toast.messages.splice(index, 1);
    }
    this.messages.emit(this.toast.messages);
  }

  closeToasts(e: any) {
    this.messageService.SendMessage({ type: Types.CLOSE_ITEM, message: e.message });
  }

  getToastZIndex() {
    const zIndex = this.toast.containerViewChild?.nativeElement.style?.zIndex;
    return zIndex;
  }

  onToggleMessage(severity): void {
    switch (severity) {
      case this.ISeverity.SUCCESS:
        this.setToggleMessage(severity, this.messageSuccess.toggle);
        this.messageSuccess.toggle = !this.messageSuccess.toggle;
        break;
      case this.ISeverity.ERROR:
        this.setToggleMessage(severity, this.messageError.toggle);
        this.messageError.toggle = !this.messageError.toggle;
        break;
      case this.ISeverity.INFO:
        this.setToggleMessage(severity, this.messageInfo.toggle);
        this.messageInfo.toggle = !this.messageInfo.toggle;
        break;
      case this.ISeverity.WARN:
        this.setToggleMessage(severity, this.messageWarn.toggle);
        this.messageWarn.toggle = !this.messageWarn.toggle;
        break;
      default:
        break;
    }
  }

  setToggleMessage(severity, status): void {
    const arrEl = this.el.nativeElement.querySelectorAll('.toast-message-toggle .p-toast-message-' + severity);
    arrEl.forEach((el, index) => {
      if (status) {
        if (el.classList.contains('toggle-message-show')) {
          el.classList.replace('toggle-message-show', 'toggle-message-hide');
        } else {
          if (el.classList.contains('toggle-message')) {
            el.classList.add('toggle-message-hide');
          } else {
            if (el.classList.contains('status-message-hide')) {
              el.classList.replace('status-message-hide', 'status-message-show');
            } else {
              el.classList.add('status-message-show');
            }
          }
        }
      } else {
        if (el.classList.contains('toggle-message-hide')) {
          // show the message
          el.classList.replace('toggle-message-hide', 'toggle-message-show');
        } else {
          if (this.showLatestMessage) {
            if (el.classList.contains('status-message-show') && index !== arrEl.length - 1) {
              // show the message
              el.classList.replace('status-message-show', 'status-message-hide');
            }
          } else {
            if (el.classList.contains('status-message-show') && index !== 0) {
              // hide the message with index !== 0
              el.classList.replace('status-message-show', 'status-message-hide');
            }
          }
        }
      }
    });
  }

  clearAllToggle(arr: Message[]) {
    arr.forEach((m) => {
      this.customCloseToasts(m);
    });
  }

  observerDOMToast(targetNode) {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observer.observe(targetNode, { childList: true, subtree: true });
  }

  mutationCallback = () => {
    if (this.toast?.containerViewChild?.nativeElement) {
      const containerViewChild = this.toast.containerViewChild.nativeElement as HTMLElement;
      containerViewChild.style.height = '';
      const scrollHeight = containerViewChild.scrollHeight > 0 ? containerViewChild.scrollHeight + 'px' : '';
      containerViewChild.style.height = scrollHeight;
    }
  };
}
