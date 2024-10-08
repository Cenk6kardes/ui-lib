import { HttpResponse } from '@angular/common/http';
import {
  Component, EventEmitter, HostListener,
  Inject, Input, NgZone, OnChanges,
  OnDestroy, OnInit, Output, TemplateRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { interval, isObservable, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetInfoInterfaceService, LoginInterfaceService } from '../../../services/login-interface.service';


@Component({
  selector: 'rbn-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bannerLocation?: 'left' | 'right' = 'right';
  @Input() showTerms = true;
  @Input() showVersion = true;
  @Input() pwdValidator?: any | undefined;
  @Input() maxPasswordLength = 20;
  @Input() hasPwdReset = false;
  @Input() displayCopyright = false;
  @Input() groupUrl = 'https://rbbn.com';
  @Input() customErrorMessage: Observable<string>;
  @Input() groupName = '';
  @Input() showGroup = false; // Hidden by default
  @Input() sessionMessage = '';
  @Input() serviceFailMessage = '';
  @Input() skipMinMaxValidation = false;
  @Input() idp = '';
  @Input() forgotPasswordLink: TemplateRef<any> | undefined;
  @Input() helpLink = '';
  @Output() LogInEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() idpLogin: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelChangePasswordEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() hideLoginFieldInChangePwd = false; // hide username vs password in change password form
  @Input() statusMessage = '';
  @Input() loginButtonLabel = '';
  @Input() checked = false;

  userform: FormGroup;
  message = '';
  project = 'Unknown';
  version = 'Unknown';
  banner = '';
  isError = false;
  isLogging = true;
  messages: any = {};
  isCapsLockOn = false;
  isFocus = false;
  changePassword = false;
  fullyear = new Date().getFullYear();
  private _destroySubject = new Subject<void>();

  constructor(private fb: FormBuilder, public translate: TranslateService,
    @Inject('LoginInterfaceService') private loginService: LoginInterfaceService,
    @Inject('GetInfoInterfaceService') private getInfoService: GetInfoInterfaceService,
    private zone: NgZone) {
    // get all notifications from JSON to use in loginComponent
    this.translate.get('MESSAGE_LOGIN').subscribe((res: string) => {
      this.messages = res;
    });
  }

  ngOnInit() {
    this.initForm();
    this.setDefaultInforProject();
    this.getVersionAndProject();
    if (this.pwdValidator && this.pwdValidator === 'required') {
      this.userform.controls['Password'].setValidators(Validators.compose([Validators.required]));
    }
    // console.log('this.pwdValidator=', this.pwdValidator, this.showVersion, this.showTerms, this.maxPasswordLength);

    if (isObservable(this.customErrorMessage)) {
      this.customErrorMessage.subscribe((error: string) => {
        if (error) {
          this.isError = true;
          this.message = error;
        }
      });
    }
  }

  ngOnChanges() {
    this.changePassword = this.hasPwdReset;
  }

  initForm() {
    if (this.skipMinMaxValidation) {
      this.userform = this.fb.group({
        'Username': new FormControl('', Validators.required),
        'Password': new FormControl('', Validators.required),
        'NewPassword': new FormControl('', Validators.required),
        'NewPasswordConfirm': new FormControl('', Validators.required)
      });
    } else {
      this.userform = this.fb.group({
        'Username': new FormControl('', Validators.required),
        'Password': new FormControl('', Validators.compose(
          [Validators.required, Validators.minLength(3), Validators.maxLength(this.maxPasswordLength)])),
        'NewPassword': new FormControl('', Validators.compose(
          [Validators.required, Validators.minLength(3), Validators.maxLength(this.maxPasswordLength)])),
        'NewPasswordConfirm': new FormControl('', Validators.compose(
          [Validators.required, Validators.minLength(3), Validators.maxLength(this.maxPasswordLength)]))
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    if (capsOn) {
      this.isCapsLockOn = true;
      if (this.isFocus) {
        this.isError = true; // show error notification
        this.message = this.messages.CAPSLOCK; // get error message from JSON
      }
    } else {
      if (event.key !== 'Enter') {
        this.isError = false; // show error notification
      }
      this.isCapsLockOn = false;
    }
  }

  Validate() {
    // Check the empty username field
    if (!this.userform.controls['Username'].valid) {
      // display error message
      this.isError = true;
      this.message = this.messages.USERNAME_REQUIRED;
      return false;
    }
    // check password
    if (this.userform.controls['Password'].errors != null) {
      // Check the empty password field
      if (this.userform.controls['Password'].errors['required']) {
        this.isError = true;
        this.message = this.messages.PASSWORD_REQUIRED;
        return false;
      }

      // Check length of password
      // check min length
      if (this.userform.controls['Password'].errors['minlength']) {
        this.isError = true;
        this.message = this.messages.PASSWORD_LONGER;
        return false;
      }
      // check max length
      if (this.userform.controls['Password'].errors['maxlength']) {
        this.isError = true;
        this.message = this.messages.PASSWORD_SHORTER.replace('{0}', this.maxPasswordLength);
        return false;
      }
    }
    // check new password fields
    if (this.changePassword) {
      if (this.userform.controls['NewPassword'].errors != null) {
        // Check the empty new password field
        if (this.userform.controls['NewPassword'].errors['required']) {
          this.isError = true;
          this.message = this.messages.PASSWORD_REQUIRED;
          return false;
        }
        // Check length of new password
        if (this.userform.controls['NewPassword'].errors['minlength']) {
          this.isError = true;
          this.message = this.messages.PASSWORD_LONGER;
          return false;
        }
      }
      // Check that new passwords match
      if (this.userform.controls['NewPassword'].value !== this.userform.controls['NewPasswordConfirm'].value) {
        this.isError = true;
        this.message = this.messages.PASSWORD_MISMATCH;
        return false;
      }
    }
    // Check field Terms and Conditions checkbox and link
    if ((this.showTerms === true) && (this.checked === false)) {
      this.isError = true;
      this.message = this.messages.TERMS;
      return false;
    }
    // data input is valid
    return true;
  }

  // check key press is enter
  pressEnter() {
    this.login();
  }
  // focus password
  focusPassword(e: any) {
    // const key = KeyboardEvent.getModifierState("CapsLock");
    this.isFocus = true;
    if (this.isCapsLockOn) {
      this.isError = true; // show error notification
      this.message = this.messages.CAPSLOCK; // get error message from JSON
    }
  }
  // outFocus password
  outFocusPassword() {
    this.isFocus = false;
    if (this.isCapsLockOn) {
      this.isError = true;
    }
  }

  // password change aborted, return to normal user login
  abortChangePassword() {
    this.changePassword = false;
    this.cancelChangePasswordEvent.emit();
    // remove showing error message
    this.message = '';
  }

  // Logic of login component
  // login
  login() {
    if (this.Validate() === true && this.isLogging === false) {
      this.isLogging = true; // show loading gif
      this.isError = false;
      if (this.changePassword) {
        // change password login
        this.loginService.changePassword(
          this.userform.controls['Username'].value,
          this.userform.controls['Password'].value,
          this.userform.controls['NewPassword'].value,
          this.userform.controls['NewPasswordConfirm'].value
        ).subscribe((res: HttpResponse<any>) => {
          if (this.loginService.isChangePasswordSuccess(res)) {
            this.isError = false; // hide error notification
            this.isLogging = false; // hide progress spinner
            this.message = this.messages.SUCCESS; // get success message from JSON
            this.LogInEvent.emit(res);
          } else {
            this.showError();
          }
        }, (err: HttpResponse<any>) => {
          this.showError(err);
        });
      } else {
        // login
        this.loginService.login(this.userform.controls['Username'].value, this.userform.controls['Password'].value)
          .subscribe((res: HttpResponse<any>) => {
            if (this.loginService.isLoginSuccess(res)) {
              this.isError = false; // hide error notification
              this.isLogging = false; // hide progress spinner
              this.message = this.messages.SUCCESS; // get success message from JSON
              this.LogInEvent.emit(res);
            } else {
              this.showError();
            }
          }, (err: HttpResponse<any>) => {
            this.showError(err);
          });
      }
    }
  }

  // get current version and project name
  getVersionAndProject() {
    this.isLogging = true; // show loading gif
    this.isError = false;
    this.message = '';
    this.getInfoService.getInformation().subscribe((current: HttpResponse<any>) => {
      this.isLogging = false; // hide loading gif
      // get version and project from body of HttpResponse
      this.project = this.getInfoService.parseProject(current);
      this.version = this.getInfoService.parseVersion(current);
      this.banner = this.getInfoService.parseBanner(current);
      this._destroySubject.next(); // stop interval
    }, (err: HttpResponse<any>) => {
      this.setDefaultInforProject();
      this.isError = true; // show error notification
      this.message = this.serviceFailMessage ? this.serviceFailMessage
        : this.messages.INFO_SERVICE_FAILS; // get error message from Input or JSON
      this.isLogging = false; // hide loading gif
      this._destroySubject.next(); // stop interval
      this.getVersionAndProjectInterval();
    });
  }

  isEMSProject(): any {
    this.getInfoService.getInformation().subscribe((current: HttpResponse<any>) => {
      if (this.getInfoService.parseProject(current) === 'EMS') {
        return true;
      } else {
        return false;
      }
    }, (err: HttpResponse<any>) => false);
  }

  // get custom error message
  showError(error?: HttpResponse<any>) {
    this.loginService.getErrorMessage(error).subscribe((message: HttpResponse<any>) => {
      if (this.isCapsLockOn) {
        this.message = this.loginService.parseError(message) + '<br/>' + this.message;
      } else {
        this.message = this.loginService.parseError(message);
      }
      this.changePassword = this.loginService.parsePasswordChange(message);
      if (this.changePassword) {
        // reset NewPassword and NewPasswordConfirm on opening Change Password from the 2nd time onwards
        this.userform.controls['NewPassword'].reset();
        this.userform.controls['NewPasswordConfirm'].reset();
      }
    }, (err: HttpResponse<any>) => {
      this.message = this.messages.INCORRECT;
      this.isError = true; // show error notification
      this.isLogging = false; // hide progress spinner
    }, () => {
      this.isError = true; // show error notification
      this.isLogging = false; // hide progress spinner
    });
  }

  getVersionAndProjectInterval() {
    return this.zone.runOutsideAngular(() => interval(10000).pipe(takeUntil(this._destroySubject)).subscribe(() => {
      this.zone.run(() => {
        this.getVersionAndProject();
      });
    }));
  }

  setDefaultInforProject() {
    this.version = 'Unknown';
    this.project = 'Unknown';
    this.banner = '';
  }

  ngOnDestroy() {
    this._destroySubject.next(); // stop interval
  }

  thirdPartyLogin() {
    this.idpLogin.emit();
  }
}
