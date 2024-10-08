import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Toast } from 'primeng/toast';
import { Message } from 'primeng/api';

import { RbnMessageService } from '../../../services/rbn-message.service';
import { Types, TFrom } from '../../../models/toast';

@Component({
  selector: 'rbn-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  @Input() maxNumberMsgDisplay = 999;
  numberMessage = 0;
  showLevelMsg = false;
  arrLocalMsg: any = [];
  keyStorage = 'rbn_notifications';
  subscription: Subscription;
  isEnableToastMsg = true;

  @ViewChild(Toast, { static: true }) toast!: Toast;
  TFrom = TFrom;

  constructor(private messageService: RbnMessageService) {
    setTimeout(() => {
      this.messageService.setSticky(false);
    }, 500);
    this.subscription = this.messageService.onEventSendMessage().subscribe(rs => {
      switch (rs.type) {
        case Types.CLOSE_ITEM:
          {
            if (rs.message.data && rs.message.data.from === TFrom.SERVER) {
              this.arrLocalMsg = [];
              const temSetArr = sessionStorage.getItem(this.keyStorage);
              if (temSetArr) {
                this.arrLocalMsg = JSON.parse(temSetArr);
              }
              rs.message.data.from = TFrom.LOCAL;
              rs.message.sticky = true;
              rs.message.closable = true;
              this.arrLocalMsg.push(rs.message);
              sessionStorage.setItem(this.keyStorage, JSON.stringify(this.arrLocalMsg));
              this.setNumberMsg(this.arrLocalMsg);
              if (this.showLevelMsg === true) {
                this.messageService.addAll([rs.message]);
              }
              const arr = this.getMsg();
              if (arr.length === 0) {
                this.showLevelMsg = false;
              }
            } else
            if (rs.message.data && rs.message.data.from === TFrom.LOCAL) {
              const temArr = sessionStorage.getItem(this.keyStorage);
              if (temArr) {
                const parseTemArr = JSON.parse(temArr);
                for (let i = 0; i < parseTemArr.length; i++) {
                  if (JSON.stringify(parseTemArr[i]) === JSON.stringify(rs.message)) {
                    parseTemArr.splice(i, 1);
                    break;
                  }
                }
                if (parseTemArr.length === 0) {
                  sessionStorage.removeItem(this.keyStorage);
                  this.resetNumberMsg();
                  this.showLevelMsg = false;
                } else {
                  sessionStorage.setItem(this.keyStorage, JSON.stringify(parseTemArr));
                  this.setNumberMsg(parseTemArr);
                }
              }
            }
          }
          break;
        case Types.CLOSE_ALL:
          {
            this.messageService.clear();
            sessionStorage.removeItem(this.keyStorage);
            this.resetNumberMsg();
            this.showLevelMsg = false;
          }
          break;
        default:
          break;
      }
    });
  }

  ngOnInit() {
    sessionStorage.removeItem(this.keyStorage);
  }

  toggleMsg() {
    if (this.isEnableToastMsg === true) {
      const temArr = sessionStorage.getItem(this.keyStorage);
      if (temArr) {
        this.showLevelMsg = !this.showLevelMsg;
        if (this.showLevelMsg === true) {
          const parseTemArr = JSON.parse(temArr);
          this.messageService.addAll(parseTemArr);
          this.showLevelMsg = true;
        } else {
          this.onEventOffLevelMsg();
        }
      }
    }
  }

  onEventOffLevelMsg() {
    const arrMsg = this.getMsg();
    if (arrMsg) {
      for (let i = 0; i < arrMsg.length; i++) {
        arrMsg[i].data.from = TFrom.LOCAL;
        arrMsg[i].sticky = true;
        arrMsg[i].closable = true;
      }
      sessionStorage.setItem(this.keyStorage, JSON.stringify(arrMsg));
      this.messageService.clear();
      this.showLevelMsg = false;
      this.setNumberMsg(arrMsg);
    }
  }

  setNumberMsg(arrMsg: any = []) {
    if (arrMsg.length === 0) {
      this.resetNumberMsg();
    } else {
      this.numberMessage = arrMsg.length;
    }
  }

  resetNumberMsg() {
    this.numberMessage = 0;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    sessionStorage.removeItem(this.keyStorage);
  }

  onClearAll() {
    this.messageService.SendMessage({ type: Types.CLOSE_ALL });
  }

  closeToasts(e: any) {
    this.messageService.SendMessage({ type: Types.CLOSE_ITEM, message: e.message });
  }

  getMsg() {
    return this.toast.messages;
  }

  customCloseToasts(message: Message) {
    const index = this.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    if (index !== -1) {
      this.toast.messages.splice(index, 1);
    }
  }

  disableMessages() {
    this.messageService.timeLife = 0;
    this.isEnableToastMsg = false;
    if (this.showLevelMsg === true) {
      this.onEventOffLevelMsg();
    }
  }

  enableMessages() {
    this.messageService.timeLife = 15000;
    this.isEnableToastMsg = true;
  }

  isDisplayClearAll() {
    return this.toast && this.toast.messages && this.toast.messages.length > 1;
  }

  getToastZIndex() {
    const zIndex = this.toast.containerViewChild?.nativeElement.style?.zIndex;
    return zIndex;
  }
}
