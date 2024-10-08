import { action } from '@storybook/addon-actions';
import { LoginComponent } from './login.component';
import { RbnCommonLibModule } from '../../../../public_api';
import { moduleMetadata } from '@storybook/angular';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';

import { GetInfoInterfaceService, LoginInterfaceService } from '../../../services/login-interface.service';

class LoginService implements LoginInterfaceService {
  messages: any = {};
  userInfo: any = {};

  login(username: string, password: string) {
    return of(new HttpResponse());
  }
  changePassword(username: string, password: string, newpassword: string, newpassword2: string): Observable<HttpResponse<any>> {
    return of(new HttpResponse());
  }

  isLoginSuccess(res: HttpResponse<any>) {
    return true;
  }

  isChangePasswordSuccess(res: HttpResponse<any>) {
    return true;
  }

  getErrorMessage() {
    return of(new HttpResponse());
  }

  parseError(res: HttpResponse<any>) {
    return '';
  }

  parsePasswordChange(res: HttpResponse<any>) {
    return true;
  }
}

class GetInformationService implements GetInfoInterfaceService {
  getInformation() {
    return of(new HttpResponse());
  }

  parseProject() {
    return '';
  }

  parseVersion() {
    return '';
  }

  parseBanner() {
    return '';
  }
}
export default {
  title: 'Components/LoginPage',
  component: LoginComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule
      ],
      providers: [
        { provide: 'LoginInterfaceService', useClass: LoginService },
        { provide: 'GetInfoInterfaceService', useClass: GetInformationService }
      ]
    })
  ],
  props: {}
};

export const Login = () => ({
  template: `<rbn-login [showTerms]="showTerms" [showVersion]="showVersion" [hasPwdReset]="hasPwdReset"
  [maxPasswordLength]="maxPasswordLength" [displayCopyright]="true" [idp]="idp"
  (LogInEvent)="LogInEvent($event)" [forgotPasswordLink]="forgotPasswordLink" (idpLogin)="idpLogin($event)">
  [hideLoginFieldInChangePwd]="hideLoginFieldInChangePwd"
  </rbn-login>
  <ng-template #forgotPasswordLink >
    <style>
      .forget-password {
        font-size: 12px;
        float: right;
        cursor: pointer;
        color: #1D1F21;
      }
      .forget-password:hover {
        color: #008EFA;
      }
    </style>
    <a class="forget-password">
      Forget your password?
    </a>
  </ng-template>
  `,
  props: {
    showTerms: boolean('Show terms', false),
    showVersion: boolean('Show version', false),
    hasPwdReset: boolean('Reset password', false),
    maxPasswordLength: number('Maximum password length', 20),
    showGroup: boolean('Show group', false),
    groupName: text('Group Name', 'PROTECT-DS'),
    displayCopyright: boolean('Display copyright', false),
    LogInEvent: action('LogInEvent'),
    serviceFailMessage: text('Service Fail Message', 'EMS Service not ready. Retrying...'),
    idp: text('thirdParty', 'Login with Facebook'),
    idpLogin: action('idpLogin'),
    hideLoginFieldInChangePwd: boolean('hideLoginFieldInChangePwd', false)
  }
});
