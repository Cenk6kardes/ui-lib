import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormToolbarEmit } from '../../form-toolbar/form-toolbar.model';

import { ProfileModule } from '../profile.module';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        ProfileModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emitPasswordData is primary when call onButtonClick', () => {
    spyOn(component, 'emitPasswordData');
    component.onButtonClick(FormToolbarEmit.primary);
    expect(component.emitPasswordData).toHaveBeenCalled();
  });

  it('should emitPasswordData is secondary when call onButtonClick', () => {
    spyOn(component, 'resetPasswordForm');
    component.onButtonClick(FormToolbarEmit.secondary);
    expect(component.resetPasswordForm).toHaveBeenCalled();
  });

  it('should call updateFormControlValue() when getPasswordData true', () => {
    spyOn(component, 'updateFormControlValue');
    component.getPasswordData(true);
    expect(component.updateFormControlValue).toHaveBeenCalled();
  });

  it('should set pwdData false when getPasswordData false', () => {
    spyOn(component, 'updateFormControlValue');
    component.getPasswordData(false);
    expect(component.pwdData).toBeFalsy();
  });

  it('should set empty input when call resetPasswordForm', () => {
    component.passwordForm.controls.expwd.setValue('123');
    component.passwordForm.controls.pwd.setValue('123');
    component.resetPasswordForm();
    expect(component.passwordForm.get('expwd').value).toBeNull();
    expect(component.passwordForm.get('pwd').value).toBeNull();
  });

  it('should set inValidForm to true when passwordForm invalid', () => {
    component.passwordForm.controls.expwd.setValue('');
    component.passwordForm.controls.pwd.setValue('');
    const res = component.setDisableBtnSave();
    expect(res).toBeTruthy();
  });
});
