import { MessageService, Message } from 'primeng/api';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';

import { TFrom, Severity, MessageType, AlertType } from '../models/toast';
// Singleton Service
@Injectable({
  providedIn: 'root'
})
export class RbnMessageService {
  private subject = new Subject<any>();
  private info = '';
  private warn = '';
  private error = '';
  private success = '';
  private alertType = '';
  private summaryAlert = {
    info: null,
    warning: null,
    error: null,
    success: null
  };
  timeLife = 5000;
  isEnableMsg = true;
  sticky = true; // sticky options for error message

  // MessageService is in root injector, so shared across app and rbn-common-lib
  constructor(private translate: TranslateService, private messageService: MessageService) {
    this.translate.get('rbn.messageservice').subscribe((rs: any) => {
      this.info = rs.info;
      this.warn = rs.warn;
      this.error = rs.error;
      this.success = rs.success;
      this.summaryAlert = {
        info: rs.info,
        warning: rs.warn,
        error: rs.error,
        success: rs.success
      };
      this.setAlerType();
      this.setSticky();
    });
  }

  setAlerType(type = AlertType.LARGE) {
    this.alertType = type;
    if (this.alertType === AlertType.LARGE) {
      this.summaryAlert = {
        info: this.info,
        warning: this.warn,
        error: this.error,
        success: this.success
      };
    } else {
      this.summaryAlert = {
        info: null,
        warning: null,
        error: null,
        success: null
      };
    }
  }

  setSticky(sticky = true) {
    this.sticky = sticky;
  }

  showInfo(detail: string, summary?: string, key?: string, stickyHeader = false) {
    if (this.isEnableMsg) {
      this.messageService.add({
        severity: Severity.INFO, summary: summary ? summary : this.summaryAlert.info,
        detail: detail, life: this.timeLife, closable: false, sticky: stickyHeader, data: { from: TFrom.SERVER },
        key: key ? key : undefined
      });
    }
  }

  showWarn(detail: string, summary?: string, key?: string, stickyHeader = false) {
    if (this.isEnableMsg) {
      this.messageService.add({
        severity: Severity.WARN, summary: summary ? summary : this.summaryAlert.warning,
        detail: detail, life: this.timeLife, closable: false, sticky: stickyHeader, data: { from: TFrom.SERVER },
        key: key ? key : undefined
      });
    }
  }

  showError(detail: string, summary?: string, key?: string, stickyHeader = this.sticky) {
    if (this.isEnableMsg) {
      this.messageService.add({
        severity: Severity.ERROR, summary: summary ? summary : this.summaryAlert.error,
        detail: detail, life: this.timeLife, closable: false, sticky: stickyHeader, data: { from: TFrom.SERVER }, key: key ? key : undefined
      });
    }
  }

  showSuccess(detail: string, summary?: string, key?: string, stickyHeader = false) {
    if (this.isEnableMsg) {
      this.messageService.add({
        severity: Severity.SUCCESS, summary: summary ? summary : this.summaryAlert.success,
        detail: detail, life: this.timeLife, closable: false, sticky: stickyHeader, data: { from: TFrom.SERVER },
        key: key ? key : undefined
      });
    }
  }

  addAll(msg: Message[] = []) {
    if (this.isEnableMsg) {
      this.messageService.addAll(msg);
    }
  }

  onEventSendMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  SendMessage(messages: MessageType) {
    this.subject.next(messages);
  }

  // clear all
  clear() {
    this.messageService.clear();
  }
}
