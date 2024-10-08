import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Observable, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { GetInfoInterfaceService } from '../../../services/login-interface.service';
import { LoginModule } from '../login.module';


describe('LoginComponent', () => {
  const loginService = jasmine.createSpyObj('loginService', ['login', 'parsePasswordChange', 'getErrorMessage',
    'changePassword', 'parseError', 'isChangePasswordSuccess', 'isLoginSuccess']);
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const res: HttpResponse<any> = new HttpResponse({
    body: {
      project: 'EMS', version: '11.01.00A021', banner: 'ribbon_banner_logo'
    }
  });

  class MockInfoInterfaceService implements GetInfoInterfaceService {
    getInformation(): Observable<HttpResponse<Object>> {
      const version = {
        version: '',
        project: 'VNF Manager',
        banner: ''
      };
      return of(new HttpResponse({ status: 200, body: version }));
    }

    parseProject(result: HttpResponse<any>): string {
      return result.body.project;
    }

    parseVersion(result: HttpResponse<any>): string {
      return result.body.version;
    }

    parseBanner(result: HttpResponse<any>): string {
      return result.body.banner;
    }
  }

  let originalTimeout: number;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        LoginModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: 'LoginInterfaceService', useValue: loginService },
        { provide: 'GetInfoInterfaceService', useClass: MockInfoInterfaceService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // mock GetInfoService and return httpResponse
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.hasPwdReset = true;
    component.displayCopyright = true;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  // should check Logo
  it('Html should have logo', () => {
    const logo = fixture.debugElement.query(By.css('.login-logo'));
    expect(logo).toBeTruthy();
  });

  // should check Project Type
  it('Html should have project type', () => {
    component.banner = 'TestProjectType';
    component.version = 'TestVersion';
    fixture.detectChanges();
    const projectType = fixture.debugElement.query(By.css('.login-banner')); // get project banner
    expect(projectType).toBeTruthy();
    expect(projectType.nativeElement.innerHTML).toEqual(' TestProjectType ');
  });

  it('Should render title in a h1 tag', () => {
    component.project = 'TestProjectType';
    component.version = 'TestVersion';
    fixture.detectChanges();
    const projectType = fixture.debugElement.query(By.css('.project-name'));  // get h1
    expect(projectType).toBeTruthy();
    expect(projectType.nativeElement.innerHTML).toEqual('TestProjectType');
  });

  // should check version
  it('Html should have version', () => {
    component.project = 'TestProjectType';
    component.version = 'TestVersion';
    fixture.detectChanges();
    const version = fixture.debugElement.query(By.css('.version'));  // get version tag
    expect(version).toBeTruthy();
    expect(version.nativeElement.innerHTML).toContain('TestVersion');
  });

  // should check Terms and Conditions
  it('html should have Terms and Conditions checkbox and link', () => {
    const checkBox = fixture.debugElement.query(By.css('.p-checkbox'));
    expect(checkBox).toBeTruthy();
  });

  // should check Copyright Info
  // it('should have Copyright Info', () => {
  //   const copyrightInfoEl = fixture.debugElement.query(
  //     By.css('.copyright span')
  //   );
  //   const fullYear =  new Date().getFullYear();
  //   const copyright = ' Copyright © 1999 - ' + fullYear + ', LOGIN.COPY_RIGHT';
  //   expect(copyrightInfoEl.nativeElement.innerHTML).toContain(copyright);
  // });

  // should check if username is not empty
  it('Check username is required', () => {
    const submitEl = fixture.debugElement.query(By.css('button'));
    submitEl.triggerEventHandler('click', null);
    expect(component.userform.controls['Username'].valid).toBeFalsy();
  });

  // should check valid usernam or password
  it('Form should be invalid', () => {
    // declarate value for form
    component.userform.controls['Username'].setValue('');
    component.userform.controls['Password'].setValue('');
    component.checked = false;
    fixture.detectChanges();
    const submitEl = fixture.debugElement.query(By.css('button'));
    submitEl.triggerEventHandler('click', null);
    expect(component.userform.valid).toEqual(false);
  });

  // should check valid usernam or password
  it('Form should be valid', () => {
    // declarate value for form
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('admin123');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.checked = true;
    fixture.detectChanges();
    expect(component.userform.valid).toEqual(true);
  });
  // login event
  // it('should call login method and emit resulf of login', () => {

  //   // mock loginService and return correct value
  //   loginService.login.and.returnValue(throwError({status: 200, url: 'testUrl'}));
  //   // declarate value for form
  //   component.userform.controls['Username'].setValue('admin');
  //   component.userform.controls['Password'].setValue('admin123');
  //   component.userform.controls['NewPassword'].setValue('admin');
  //   component.userform.controls['NewPasswordConfirm'].setValue('admin');
  //   component.checked = true;
  //   const submitEl = fixture.debugElement.query(By.css('button')); // click button
  //   submitEl.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  //   component.LogInEvent.subscribe((result: any) => {
  //     expect(result).toEqual('admin'); // emit username of user
  //   });
  // });

  // should hide terms
  it('should hide terms', () => {
    component.project = 'TestProjectType';
    component.version = 'TestVersion';
    fixture.detectChanges();
    let terms = fixture.debugElement.query(By.css('.terms-and-conditions'));
    expect(terms).toBeTruthy();
    component.showTerms = false;
    fixture.detectChanges();
    terms = fixture.debugElement.query(By.css('.terms-and-conditions'));
    expect(terms).toBeNull();
  });

  // should hide version
  it('should hide version', () => {
    component.project = 'TestProjectType';
    component.version = 'TestVersion';
    fixture.detectChanges();
    let version = fixture.debugElement.query(By.css('.version'));
    expect(version).toBeTruthy();
    component.showVersion = false;
    fixture.detectChanges();
    version = fixture.debugElement.query(By.css('.version'));
    expect(version).toBeNull();
  });

  it('should validate new password fields', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.Validate();
    expect(component.isError).toBeTruthy();
  });


  it('should validate min length of password', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('12');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.Validate();
    expect(component.isError).toBeTruthy();
  });

  it('should validate required of new password', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('1234');
    component.changePassword = true;
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.Validate();
    expect(component.isError).toBeTruthy();
  });

  it('should validate minLength of new password', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('1234');
    component.userform.controls['NewPassword'].setValue('12');
    component.changePassword = true;
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.Validate();
    expect(component.isError).toBeTruthy();
  });

  it('should validate max length of password', () => {
    component.messages = { PASSWORD_SHORTER: 'Please enter no more than {0} characters' };
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('testtesttesttesttesttesttest');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.Validate();
    expect(component.isError).toBeTruthy();
  });

  it('should validate that new passwords must match', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('test');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('adminTest');
    component.changePassword = true;
    const value = component.Validate();
    expect(value).toBeFalsy();
  });

  it('should validate field Terms and Conditions checkbox and link', () => {
    loginService.getErrorMessage.and.returnValue(of({ message: 'error' }));
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('test');
    component.userform.controls['NewPassword'].setValue('admin');
    component.userform.controls['NewPasswordConfirm'].setValue('admin');
    component.changePassword = true;
    const value = component.Validate();
    expect(value).toBeFalsy();
  });

  it('should call isEMSProject Failed', () => {
    const value = component.isEMSProject();
    expect(value).toEqual(undefined);
  });

  it('should call focusPassword', () => {
    component.isCapsLockOn = true;
    component.message = 'error caplock';
    component.focusPassword('');
    expect(component.isError).toEqual(true);
  });

  it('should call outFocusPassword', () => {
    component.isCapsLockOn = true;
    component.message = 'error caplock';
    component.outFocusPassword();
    expect(component.isError).toEqual(true);
  });

  it('should call showError', () => {
    loginService.getErrorMessage.and.returnValue(of({ body: { message: 'error' } }));
    component.isCapsLockOn = true;
    component.showError();
    expect(component.message).toEqual('undefined<br/>');
  });

  it('should call pressEnter', () => {
    spyOn(component, 'login');
    loginService.getErrorMessage.and.returnValue(of({ body: { message: 'error' } }));
    component.pressEnter();
    expect(component.login).toHaveBeenCalled();
  });

  it('should call abortChangePassword', () => {
    component.abortChangePassword();
    expect(component.changePassword).toBeFalsy();
    expect(component.message).toEqual('');
  });

  it('should call showError', () => {
    loginService.getErrorMessage.and.returnValue(throwError('Error'));
    component.showError();
    expect(component.message).toEqual(undefined);
  });

  it('should call showError', () => {
    component.changePassword = true;
    loginService.getErrorMessage.and.returnValue(throwError('Error'));
    component.showError();
    expect( component.userform.controls['NewPassword'].value).toEqual('');
    expect( component.userform.controls['NewPasswordConfirm'].value).toEqual('');
  });

  it('should set validators', () => {
    fixture.detectChanges();
    component.pwdValidator = 'required';
    component.ngOnInit();
    expect(component.userform.controls['Password'].value).toEqual('');
  });

  it('should be Observable', () => {
    fixture.detectChanges();
    component.customErrorMessage = of('test');
    component.ngOnInit();
    expect(component.isError).toBeTruthy();
  });

  it('should call Onchanges', () => {
    fixture.detectChanges();
    component.hasPwdReset = true;
    component.ngOnChanges();
    expect(component.changePassword).toBeTruthy();
  });

  it('should show error message CapsLock', () => {
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', {key: 'A', modifierCapsLock: true});
    component.isFocus = true;
    component.handleKeyboardEvent(event);
    expect(component.isCapsLockOn).toBeTrue();
    expect(component.isError).toBeTrue();
  });

  it('should hide error message CapsLock', () => {
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', {key: 'A'});
    component.isFocus = true;
    component.handleKeyboardEvent(event);
    expect(component.isCapsLockOn).toBeFalse();
    expect(component.isError).toBeFalse();
  });

  it('should show error message username invalid', () => {
    fixture.detectChanges();
    component.userform.controls['Username'].setValue('');
    component.Validate();
    expect(component.isError).toBeTrue();
  });

  it('should call change password', () => {
    spyOn(component.LogInEvent, 'emit');
    fixture.detectChanges();
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('admin');
    component.userform.controls['NewPassword'].setValue('admin2');
    component.userform.controls['NewPasswordConfirm'].setValue('admin2');
    component.isLogging = false;
    component.changePassword = true;
    component.showTerms = false;
    component.checked = true;
    loginService.changePassword.and.returnValue(of(true));
    loginService.isChangePasswordSuccess.and.returnValue(of(true));
    component.login();
    expect(component.isError).toBeFalse();
    expect(component.LogInEvent.emit).toHaveBeenCalled();
  });

  it('should call login', () => {
    spyOn(component.LogInEvent, 'emit');
    fixture.detectChanges();
    component.userform.controls['Username'].setValue('admin');
    component.userform.controls['Password'].setValue('admin');
    component.isLogging = false;
    component.showTerms = false;
    component.checked = true;
    loginService.login.and.returnValue(of(true));
    loginService.isLoginSuccess.and.returnValue(of(true));
    component.login();
    expect(component.isError).toBeFalse();
    expect(component.LogInEvent.emit).toHaveBeenCalled();
  });

});
