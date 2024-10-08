import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ILogoutCustomMessage } from '../profile.model';

@Component({
  selector: 'rbn-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  @Input() showLogout = false;
  @Input() customMsg: ILogoutCustomMessage | undefined;
  @Input() idLogoutPopup = '';

  @Output() confirmLogout = new EventEmitter();

  loadingTranslate = true;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.translate.get('COMMON').subscribe(trans => {
      if (!this.customMsg) {
        this.customMsg = {
          title: trans.LOGOUT,
          content: trans.LOGOUT_MG,
          titleAccept: trans.YES,
          titleReject: trans.NO
        };
      } else {
        if (!this.customMsg.title) {
          this.customMsg.title = trans.LOGOUT;
        }
        if (!this.customMsg.content) {
          this.customMsg.content = trans.LOGOUT_MG;
        }
        if (!this.customMsg.titleAccept) {
          this.customMsg.titleAccept = trans.YES;
        }
        if (!this.customMsg.titleReject) {
          this.customMsg.titleReject = trans.NO;
        }
      }
      this.loadingTranslate = false;
    });
  }

  onConfirmLogout($event) {
    this.confirmLogout.emit($event);
  }
}
