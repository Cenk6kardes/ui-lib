import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { PasswordModule } from 'primeng/password';
import { By } from '@angular/platform-browser';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { PasswordValidationComponent } from './password-validation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventEmitter, SimpleChange } from '@angular/core';
import { of } from 'rxjs';

describe('PasswordValidationComponent', () => {
  let component: PasswordValidationComponent;
  let fixture: ComponentFixture<PasswordValidationComponent>;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;
  const translateService = jasmine.createSpyObj<TranslateService>('translateService', ['instant', 'get']);
  const translateServiceMock = {
    currentLang: 'en',
    onLangChange: new EventEmitter<LangChangeEvent>(),
    use: translateService.get,
    get: translateService.get.and.returnValue(of({
      'REQUIRED': 'Can be {min} to {max} characters in length',
      'CONTAIN_SPECIAL_CHARACTER': 'Contains special characters',
      'PASSWORD': {
        'NEWPWD': 'New password'
      }
    })),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

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
      declarations: [PasswordValidationComponent],
      imports: [
        PasswordModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        ReactiveFormsModule
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordValidationComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset data', () => {
    fixture.detectChanges();
    component.resetData();
    const element = fixture.debugElement.queryAll(By.css('.password-confirm-content .p-inputtext'));
    expect(element[0].nativeElement.textContent).toEqual('');
    expect(element[1].nativeElement.textContent).toEqual('');
  });

  it('should alert message password not match', () => {
    const newpwd = component.passwordForm.controls['newpwd'];
    const cnewpwd = component.passwordForm.controls['cnewpwd'];
    fixture.detectChanges();
    newpwd.setValue('Test102');
    cnewpwd.setValue('Test123');
    const message = fixture.debugElement.query(By.css('.error'));
    expect(message).toBeTruthy();
  });

  it('should call emit', () => {
    spyOn(component.passwordData, 'emit');
    fixture.detectChanges();
    const newpwd = component.passwordForm.controls['newpwd'];
    const cnewpwd = component.passwordForm.controls['cnewpwd'];
    newpwd.setValue('Test102');
    cnewpwd.setValue('Test102');
    expect(component.passwordData.emit).toHaveBeenCalled();
  });

  it('should call ngOnChanges with requiredSpecialCharacter changes', () => {
    component.pwNoSpecialCharacter = false;
    component.requiredSpecialCharacter = true;
    component.validatorMessages = {
      containSpecialCharacter: ''
    };
    fixture.detectChanges();
    component.ngOnChanges({
      pwNoSpecialCharacter: new SimpleChange(null, false, true),
      requiredSpecialCharacter: new SimpleChange(true, true, false)
    });
    expect(component.validatorMessages.containSpecialCharacter).toEqual('Contains special characters (!@#$%^&*)');
  });

  it('should call ngOnChanges and has Special Character List', () => {
    component.pwNoSpecialCharacter = false;
    component.requiredSpecialCharacter = true;
    component.specialCharacterList = new RegExp(/^[@@]+$/);
    component.validatorMessages = {
      containSpecialCharacter: ''
    };
    component.ngOnChanges({
      pwNoSpecialCharacter: new SimpleChange(null, false, true),
      requiredSpecialCharacter: new SimpleChange(null, true, true),
      specialCharacterList: new SimpleChange(null, new RegExp(/^[@@]+$/), true)
    });
    fixture.detectChanges();
    expect(component.validatorMessages.containSpecialCharacter).toEqual('Contains special characters (@@)');
  });

  it('should call ngOnChanges and change min and max length', () => {
    component.minLength = 10;
    component.maxLength = 40;
    component.validatorMessages = {
      required: ''
    };
    component.ngOnChanges({
      minLength: new SimpleChange(null, 10, true),
      maxLength: new SimpleChange(null, 40, true)
    });
    fixture.detectChanges();
    expect(component.validatorMessages.required).toEqual('Can be 10 to 40 characters in length');
  });

  it('should call ngOnChanges with overridePwConfig', () => {
    component.overridePwConfig = {
      pwNoSpecialCharacter: false,
      requiredSpecialCharacter: true,
      minLength: 17
    };
    component.minLength = 17;
    component.pwNoSpecialCharacter = false;
    component.requiredSpecialCharacter = true;
    component.validatorMessages = {
      required: '',
      containSpecialCharacter: ''
    };
    component.ngOnChanges({
      overridePwConfig: new SimpleChange(null, {
        pwNoSpecialCharacter: false,
        requiredSpecialCharacter: true,
        minLength: 17
      }, true)
    });
    fixture.detectChanges();
    expect(component.validatorMessages.required).toEqual('Can be 17 to 32 characters in length');
    expect(component.validatorMessages.containSpecialCharacter).toEqual('Contains special characters (!@#$%^&*)');
  });
});
