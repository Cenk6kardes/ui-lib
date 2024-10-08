import { Component, OnInit, Inject, Input } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { HeaderuserInterfaceService } from '../../../services/headeruser-interface.service';
import { Headeruser } from '../../../models/headeruser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rbn-headeruser',
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.scss']
})
export class HeaderuserComponent implements OnInit {

  showLogout = false;
  showInfo = false;
  @Input() showPref?: boolean;
  @Input() expiredPassword?: boolean;
  @Input() forcedToResetPassword?: boolean;
  items!: MenuItem[];
  username = '';
  infoHeader = '';
  prefHeader = '';
  infoContent!: string[];
  @Input() showTimeZone = false;
  @Input() timezone = 0; // local timezone, 1: UTC
  timezones: SelectItem[];
  pwderror = '';
  pwdexperror = 'Your password has expired. Please reset it.';
  pwdreseterror = 'Please reset your password.';
  expwd = '';
  newpwd = '';
  cnewpwd = '';
  validatorMessages: any;

  constructor(@Inject('HeaderuserInterfaceService') private userService: HeaderuserInterfaceService,
    private translateService: TranslateService) {
    this.timezones = [
      { label: 'Local', value: 0 },
      { label: 'UTC', value: 1 }
    ];
    this.translateService.get(['HEADER_PREF']).subscribe(res => {
      const validationTrans = res['HEADER_PREF'] || {};
      this.validatorMessages = {
        required: validationTrans.REQUIRED,
        match: validationTrans.MATCH
      };
    });
  }

  ngOnInit() {
    this.getData();
    const todaysDate = (new Date()).toTimeString();
    if (todaysDate.indexOf('(') > 0 && todaysDate.endsWith(')')) {
      const localzone = todaysDate.substring(todaysDate.indexOf('('));
      this.timezones[0].label = 'Local ' + localzone;
      this.timezones[1].label = 'Coordinated Universal Time';
    }
    this.clearFields();
  }

  OnChangeTimezone() {
    this.userService.setTimezone(this.timezone);
  }

  /* getTimezone() {
    this.userService.getTimezone().subscribe(
      (timezone: number) => {
        this.timezone = timezone;
      });
  } */
  clearFields() {
    this.pwderror = '';
    this.expwd = '';
    this.newpwd = '';
    this.cnewpwd = '';
  }

  cancelPwd() {
    this.showPref = false;
    this.clearFields();
  }

  changePwd() {
    // console.log('this.newpwd=', this.newpwd);
    // console.log('this.cnewpwd=', this.cnewpwd);
    if (!this.expwd || !this.newpwd || !this.cnewpwd) {
      this.pwderror = this.validatorMessages.required;
    } else if (this.newpwd !== this.cnewpwd) {
      this.pwderror = this.validatorMessages.match;
    } else {
      this.pwderror = '';
      const pwdData = {
        'currentPassword': this.expwd,
        'newPassword': this.newpwd,
        'confirmNewPassword': this.cnewpwd
      };
      this.userService.changePwd(pwdData).subscribe((response: any) => {
        // console.log('changePwd response=', response);
        this.showPref = false;
        window.location.reload();
      }, (err: any) => {
        console.log('changePwd err=', err);
        if (err && err.error && err.error.message) {
          this.pwderror = err.error.message;
        }
      });
    }
  }

  getData() {
    // TODO
    // This need to be refactored to support I18N
    // It is currently parsing strings added to menu by individual app. This will not
    // work with I18N
    this.userService.getUserActions().subscribe(
      (headeruser: Headeruser) => {
        this.items = headeruser.items;
        this.username = headeruser.username;
        this.infoHeader = headeruser.infoHeader;
        this.infoContent = headeruser.infoContent;
        if (this.items && this.items.length >= 1 && this.items[0].items !== undefined) {
          const actions = this.items[0].items;
          if (actions !== undefined) {
            for (const action of actions) {
              if (typeof action === 'object') {
                if (action.label && action.label.toLowerCase() === 'log out') {
                  action.command = (event) => {
                    this.showLogout = true;
                  };
                } else if (action.label && action.label.toLowerCase().indexOf('about') >= 0) {
                  action.command = (event) => {
                    this.showInfo = true;
                    this.getData();
                  };
                } else if (action.label && action.label.toLowerCase().indexOf('preference') >= 0) {
                  action.command = (event) => {
                    this.showPref = true;
                  };
                }
              }
            }
          }
        }
      });
  }
  logout() {
    this.showLogout = false;
    this.showInfo = false;
    this.showPref = false;
    this.pwdexperror = '';
    this.pwderror = '';
    this.userService.logout();
  }
}
