import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { SimpleChange } from '@angular/core';

import { ProfileInfoComponent } from './profile-info.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { IProfileInfoData, IProfileInfoShowing } from '../profile.model';
import { FormToolbarEmit } from '../../form-toolbar/form-toolbar.model';
import { ProfileModule } from '../profile.module';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;
  let translateSevice: TranslateService | undefined;

  const mockDefaultData: IProfileInfoData = {
    general: { username: 'username', fullname: 'Full Name', description: 'Description' },
    timezone: { local: true, coordinated: true, another: false }
  };
  const mockShowingConfigs: IProfileInfoShowing = {
    general: true,
    changePassword: {
      expiredPassword: false,
      forcedToResetPassword: false
    },
    timezone: true
  };
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    translateSevice = undefined;
    http = undefined;
    window.sessionStorage.clear();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileInfoComponent, ChangePasswordComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ProfileModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (translateSevice) {
      translateSevice.setDefaultLang('en');
      if (http) {
        http.expectOne('./assets/i18n/en.json').flush({
          'VALIDATION': {
            'REQUIRED': 'Required!',
            'MINLENGTH_CHARACTERS': 'Should have at least {0} characters.',
            'MINLENGTH_CHARACTER': 'Should have at least {0} character.',
            'MINLENGTH_ITEMS': 'Should have at least {0} items.',
            'MINLENGTH_ITEM': 'Should have at least {0} item.',
            'MAXLENGTH_CHARACTERS': 'This value should be less than or equal {0} characters.',
            'MAXLENGTH_CHARACTER': 'This value should be less than or equal {0} characters.',
            'MAXLENGTH_ITEMS': 'This value should be less than or equal {0} items.',
            'MAXLENGTH_ITEM': 'This value should be less than or equal {0} item.',
            'MIN': 'This value should be more than or equal to {0}.',
            'MAX': 'This value should be less than or equal to {0}.',
            'PATTERN': 'This value must match {0}.',
            'EMAIL': 'This value must match email format.',
            'PASSWORD': {
              'REQUIRED': 'Can be {min} to {max} characters in length',
              'BEGIN_LETTER': 'Must begin with a letter',
              'CONTAIN_UPER_LOWER': 'Contains both uppercase and lowercase',
              'CONTAIN_NUMBER': 'Contains numbers (0-9)',
              'NO_SPECIAL_CHARACTER': 'No special characters',
              'NOT_MATCH': 'This value must match {field}.',
              'PASSWORD_INVALID': 'Password is invalid'
            }
          }
        });
        http.expectOne('./assets/i18n/rbn_en.json').flush({
          'PROFILE_INFO': {
            'HEADER': 'Edit profile',
            'CHANGEPWD': 'Change Password',
            'EXTPWD': 'Current password',
            'EXPWD_ERROR': 'Your password has expired. Please reset it.',
            'RESET_PWD_ERROR': 'Please reset your password.',
            'GENERAL': 'General',
            'USER_NAME': 'User Name',
            'FULL_Name': 'Full Name',
            'DESCRIPTION': 'Description',
            'SET_TIMEZONE_OF_SYS': 'Set the timezone of the system',
            'LOCAL': 'Local (Eastern Daylight Time)',
            'COORDINATED_UNI_TIME': 'Coordinated Universal Time',
            'ANOTHER_TIMEZONE': 'Another timezone',
            'TIMEZONE': 'Timezone',
            'DO_YOU_WANT_TO_SAVE_THE_NEW_CHANGE': 'Do you want to save the new changes',
            'CONFIRMATION': 'Confirmation'
          }
        });
      }
    }
    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    component.defaultData = mockDefaultData;
    component.showingConfigs = mockShowingConfigs;
    component.showProfileInfo = true;
    const change = {
      defaultData: new SimpleChange(mockDefaultData, mockDefaultData, true),
      showingConfigs: new SimpleChange(mockShowingConfigs, mockShowingConfigs, true),
      showProfileInfo: new SimpleChange(true, true, true)
    };
    component.ngOnChanges(change);
    fixture.detectChanges();
  });

  afterEach(() => {
    component.showProfileInfo = false;
    component.showingConfigs = undefined;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set string validate when call valiMessage', () => {
    const rs = component.valiMessage('minlength', 'username');
    expect(rs).toEqual('This value should be more than or equal to 3.');
  });

  it('should call initGeneralForm when call resetForm with value generalForm', () => {
    spyOn(component, 'initGeneralForm');
    component.resetForm('generalForm');
    expect(component.initGeneralForm).toHaveBeenCalled();
  });

  it('should call initTimezonelForm when call resetForm with value timezoneForm', () => {
    spyOn(component, 'initTimezonelForm');
    component.resetForm('timezoneForm');
    expect(component.initTimezonelForm).toHaveBeenCalled();
  });

  it('should call formSubmit when call onButtonClick', () => {
    spyOn(component, 'formSubmit');
    component.onButtonClick(FormToolbarEmit.primary, 'generalForm');
    expect(component.formSubmit).toHaveBeenCalled();
  });

  it('should call resetForm when call onButtonClick', () => {
    spyOn(component, 'resetForm');
    component.onButtonClick(FormToolbarEmit.secondary, 'generalForm');
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should set showConfirmation true when call closeDialog', () => {
    component.generalValuesChanges = {
      username: 'usernaame',
      fullname: 'Full Name',
      description: 'Description'
    };
    component.passwordValuesChanges = {
      expwd: 'x123X',
      pwd: 'x123Xx'
    };
    component.timezoneValuesChanges = {
      another: false,
      coordinated: false,
      local: true
    };
    component.closeDialog();
    expect(component.showConfirmation).toBeTruthy();
  });

  it('should emit profileInfoEmit true when call onComfirmation', () => {
    spyOn(component.profileInfoEmit, 'emit');
    component.generalValuesChanges = {
      username: 'usernaame',
      fullname: 'Full Name',
      description: 'Description'
    };
    component.passwordValuesChanges = {
      expwd: 'x123X',
      pwd: 'x123Xx'
    };
    component.timezoneValuesChanges = {
      another: false,
      coordinated: false,
      local: true
    };
    component.onComfirmation(true);
    expect(component.profileInfoEmit.emit).toHaveBeenCalled();
  });

  it('should emit profileInfoEmit true when call onPassworDataEmit', () => {
    spyOn(component.profileInfoEmit, 'emit');
    const mockEvent = {
      data: {expwd: 'x1234X', pwd: 'x1234X'},
      submit: true
    };
    component.onPassworDataEmit(mockEvent);
    expect(component.profileInfoEmit.emit).toHaveBeenCalled();
  });

  it('should emit profileInfoEmit when call formSubmit with generalForm', () => {
    spyOn(component.profileInfoEmit, 'emit');
    component.formSubmit('generalForm');
    expect(component.profileInfoEmit.emit).toHaveBeenCalled();
  });

  it('should emit profileInfoEmit when call formSubmit with timezoneForm', () => {
    spyOn(component.profileInfoEmit, 'emit');
    component.formSubmit('timezoneForm');
    expect(component.profileInfoEmit.emit).toHaveBeenCalled();
  });

  it('should set showConfirmation true when call closeDialog', () => {
    spyOn(component.profileInfoEmit, 'emit');
    component.generalValuesChanges = {
      username: 'usernaame',
      fullname: 'Full Name',
      description: 'Description'
    };
    component.passwordValuesChanges = {
      expwd: 'x123X',
      pwd: 'x123Xx'
    };
    component.timezoneValuesChanges = {
      another: false,
      coordinated: false,
      local: true
    };
    component.onComfirmation(true);
    expect(component.profileInfoEmit.emit).toHaveBeenCalled();
  });

  it('should set profileInfoData when call getProfileInfoChanges', () => {
    const mockRs = {
      general: {
        username: 'usernaame',
        fullname: 'Full Name',
        description: 'Description'
      },
      changePassword: {
        expwd: 'x123X',
        pwd: 'x123Xx'
      },
      timezone: {
        another: false,
        coordinated: false,
        local: true
      }
    };
    component.generalValuesChanges = {
      username: 'usernaame',
      fullname: 'Full Name',
      description: 'Description'
    };
    component.passwordValuesChanges = {
      expwd: 'x123X',
      pwd: 'x123Xx'
    };
    component.timezoneValuesChanges = {
      another: false,
      coordinated: false,
      local: true
    };
    const rs = component.getProfileInfoChanges();
    expect(rs).toEqual(mockRs);
  });
});
