import { moduleMetadata } from '@storybook/angular';
import { withKnobs, number } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Headeruser } from '../../../models/headeruser';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { HeaderuserComponent } from './headeruser.component';
import { RbnCommonLibModule } from '../../../../public_api';
import { HeaderuserInterfaceService } from '../../../services/headeruser-interface.service';
import { AlertType } from '../../../models/toast';

class HeaderuserService implements HeaderuserInterfaceService {
  headeruser = {};
  constructor() {
    this.headeruser = this.getUserActions();
  }

  changeUserInfo(): Observable<any> {
    return of();
  }

  getUserActions(): Observable<Headeruser> {
    const infoHeader = 'Rbn Common Test';
    const infoContent = [
      'Version: 0.0.1',
      'Running at IP: localhost',
      'Build Number:  0.0.1',
      'UI Common Lib Version: 8.0.87',
      'UI Build Number: unknown'
    ];
    const items = [
      {
        label: 'sysadmin',
        icon: 'pi pi-pw pi-user',
        items: [
          {
            label: 'Preference',
            icon: 'pi pi-pw'
          },
          {
            label: 'About',
            icon: 'pi pi-pw'
          },
          {
            label: 'Log out',
            icon: 'pi pi-pw'
          }
        ]
      }
    ];
    const username = 'sysadmin';
    const logoutUrl = 'http://localhost:4300/logout';
    const headeruser = new Headeruser(items, username, logoutUrl, infoHeader, infoContent);
    return of(headeruser);
  }

  getTimezone(): Observable<number> {
    return of();
  }

  changePwd(): Observable<number> {
    return of();
  }

  setTimezone(timezone = 0) {
    return timezone;
  }

  logout() {
    return;
  }
}

@Component({
  selector: 'rbn-fake-message',
  template: ''
})
class FakeMessageComponent implements AfterViewInit {
  constructor(private rbnMessageService: RbnMessageService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.rbnMessageService.setAlerType(AlertType.BASIC);
      this.rbnMessageService.showSuccess('Success');
      this.rbnMessageService.showInfo('Info Message');
      this.rbnMessageService.showError('Error Message');
      this.rbnMessageService.showWarn('Warning Message');
    }, 500);
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'rbn-fake-large-message',
  template: ''
})
class FakeMessageLargeComponent implements AfterViewInit {
  constructor(private rbnMessage: RbnMessageService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.rbnMessage.setAlerType(AlertType.LARGE);
      this.rbnMessage.showSuccess('Success');
      this.rbnMessage.showInfo('Info Message');
      this.rbnMessage.showError('Error Message');
      this.rbnMessage.showWarn('Warning Message');
    }, 300);
  }
}
const HeaderuserServiceObj = new HeaderuserService();

export default {
  title: 'Components/HeaderUser',
  component: HeaderuserComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [FakeMessageComponent, FakeMessageLargeComponent],
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ],
      providers: [
        { provide: 'HeaderuserInterfaceService', useValue: HeaderuserServiceObj }
      ]
    })
  ],
  props: {
    timezone: 0
  }
};

export const HeaderUser = () => ({
  template: '<rbn-headeruser [timezone]="timezone"></rbn-headeruser><rbn-fake-large-message></rbn-fake-large-message>',
  props: {
    timezone: number('Time zone', 0)
  }
});

export const HeaderUserBasicAlert = () => ({
  template: '<rbn-headeruser [timezone]="timezone"></rbn-headeruser><rbn-fake-message></rbn-fake-message>',
  props: {
    timezone: number('Time zone', 0)
  }
});
