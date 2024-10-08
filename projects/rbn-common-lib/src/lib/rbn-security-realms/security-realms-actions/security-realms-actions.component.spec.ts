import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { SecurityRealmsActionsComponent } from './security-realms-actions.component';
import { NavigateCommonService } from '../services/navigate-common.service';
import { RbnSecurityRealmsModule } from '../rbn-security-realms.module';

export const newReams = {
  name: 'name',
  type: 'type',
  sequence: 1,
  enabled: 'Enabled'
};

export const data = {
  body: {
    name: 'name',
    properties: [
      {
        keypair_attribute: 'keypair_attribute',
        keypair_value: 'keypair_attribute'
      }]
  }
};

export const ldap = {
  body: ['LDAP']
};

describe('SecurityRealmsActionsComponent', () => {
  let component: SecurityRealmsActionsComponent;
  let fixture: ComponentFixture<SecurityRealmsActionsComponent>;
  let originalTimeout: number;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
    translateSevice = undefined;
  });

  const securRealmsService = jasmine.createSpyObj('securRealmsService',
    ['getDetailsSecurityRealmByName', 'getRealmsTypes', 'getDetailsSecurityRealm', 'addSecurityRealm', 'updateSecurityRealm']
  );
  const navService = jasmine.createSpyObj('navService', ['navBackToTable']);
  // const activeRoute = new ActivatedRouteMock;
  const activeRoute = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    data: { subscribe: (fn: (value: any) => void) => { } }
  };

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnSecurityRealmsModule
      ],
      declarations: [
        SecurityRealmsActionsComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: NavigateCommonService, useValue: navService },
        { provide: 'SecurityRealmsInterfaceService', useValue: securRealmsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (http) {
      http.expectOne('./assets/i18n/en.json').flush({
        ADMIN: {
          SECURITY_REALM_ACTION: {
            TITLE_ADD: 'Add Security Realm',
            TITLE_EDIT: 'Edit Security Realm'
          }
        }
      });
      http.expectOne('./assets/i18n/rbn_en.json').flush({
        COMMON: {
          CANCEL: 'Cancel',
          SAVE: 'Save'
        }
      });
    }
    if (translateSevice) {
      translateSevice.addLangs(['en']);
      translateSevice.setDefaultLang('en');
    }
    fixture = TestBed.createComponent(SecurityRealmsActionsComponent);
    component = fixture.componentInstance;
    securRealmsService.getRealmsTypes.and.returnValue(of(ldap));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call event cancelActions when click on cancel button', () => {
    fixture.detectChanges();
    spyOn(component, 'cancelActions');
    // get button element
    const button = fixture.debugElement.queryAll(By.css('button'));
    button[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.cancelActions).toHaveBeenCalled();
  });

  it('should call event onSubmit when click on Save button', () => {
    fixture.detectChanges();
    spyOn(component, 'onSubmit');
    // get button element
    const button = fixture.debugElement.queryAll(By.css('button'));
    button[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should set realmPropertiesPresent equal true when onChangeRealmType and isEdit=undefined', () => {
    activeRoute.data = {
      subscribe: (fn: (value: any) => void) => fn({
        realm: data.body
      })
    };
    component.ngOnInit();
    spyOnProperty(component, 'settingBlock', 'get').and.returnValue([]);
    securRealmsService.getDetailsSecurityRealm.and.returnValue(of(data));
    component.propertiesMapping = data.body.properties;
    fixture.detectChanges();
    component.onChangeRealmType({
      value: {
        value: 'test'
      }
    }, undefined as any, 'realName');
    // expect(component.realmPropertiesPresent).toBeTruthy();
    expect(component.propertiesMapping).toEqual(data.body.properties);
  });

  it('should set realmPropertiesPresent equal true when onChangeRealmType and isEdit=true', () => {
    activeRoute.data = {
      subscribe: (fn: (value: any) => void) => fn({
        realm: data.body
      })
    };
    component.ngOnInit();
    securRealmsService.getDetailsSecurityRealmByName.and.returnValue(of(data));
    component.propertiesMapping = data.body.properties;
    fixture.detectChanges();
    component.onChangeRealmType(true, true, 'realName');
    // expect(component.realmPropertiesPresent).toBeTruthy();
    expect(component.propertiesMapping).toEqual(data.body.properties);
  });

  it('should call navBackToTable when cancelActions ', () => {
    component.cancelActions();
    expect(navService.navBackToTable).toHaveBeenCalled();
  });

  it('should set isRealmTypeSelected equal false and call setTouched function when onSubmit', () => {
    component.ngOnInit();
    spyOn(component, 'setTouched');
    component.onSubmit();
    expect(component.isRealmTypeSelected).toBeFalsy();
    expect(component.setTouched).toHaveBeenCalledWith(true);
  });

  it('should set isRealmTypeSelected equal false when onSubmit', () => {
    component.securityRealmForm = {
      valid: true
    };
    component.onSubmit();
    expect(component.isRealmTypeSelected).toBeFalsy();
  });

  it('should setValueRealmAction function', () => {
    securRealmsService.addSecurityRealm.and.returnValue(of(data));
    spyOn(component, 'setValueRealmAction');
    component.securityRealmForm = {
      valid: true
    };
    component.selectedTypeValue = 'type';
    component.realm_action = newReams;
    component.onSubmit();
    expect(component.setValueRealmAction).toHaveBeenCalled();
  });

  it('should setValueRealmAction when setValueRealmAction', () => {
    activeRoute.data = {
      subscribe: (fn: (value: any) => void) => fn({
        realm: data.body
      })
    };
    component.ngOnInit();
    component.realm = newReams;
    component.realm_action = newReams;
    component.setValueRealmAction();
    expect(component.realm_action.type).toEqual(component.selectedTypeValue);
  });

  it('should return SequenceRank when call getSequenceRank', () => {
    component.ngOnInit();
    const rs = component.getSequenceRank;
    expect(rs).toEqual(component.securityRealmForm.controls.SequenceRank);
  });

  it('should call setValueInput ', () => {
    component.ngOnInit();
    const name = 'realmName';
    const type = 'realmType';
    component.realmTypes = [{ value: type }];
    spyOn(component, 'onChangeRealmType');
    component.setValueInput(name, type, 1, false);
    expect(component.selectedRealmType).toEqual(component.realmTypes[0]);
    expect(component.onChangeRealmType).toHaveBeenCalled();
    expect(component.realmPropertiesPresent).toBeTruthy();
  });

  it('should call setTouched', () => {
    component.ngOnInit();
    component.setTouched(true);
    expect(component.securityRealmForm.controls.SecurityRealmName.touched).toBeTruthy();
  });

  it('should call onCheckSecurRealmName', () => {
    component.ngOnInit();
    component.securityRealmForm.controls.SecurityRealmName.errors = {
      required: true
    };
    component.securityRealmForm.controls.SecurityRealmName.touched = true;
    component.onCheckSecurRealmName();
    expect(component.securityRealmForm.controls.SecurityRealmName.dirty).toBeTruthy();
  });

  it('should call ngOnInit with realm undefined', () => {
    activeRoute.data = {
      subscribe: (fn: (value: any) => void) => fn({
        realm: undefined
      })
    };
    component.realm = undefined;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.header_securityRealm).toEqual('Add Security Realm');
  });

  it('should call cancelActions on breadcrumb', () => {
    spyOn(component, 'cancelActions');
    component.ngOnInit();
    fixture.detectChanges();
    const breadcrumb = fixture.debugElement.query(By.css('.p-breadcrumb li .p-menuitem-link'));
    breadcrumb.nativeElement.click();
    fixture.detectChanges();
    expect(component.cancelActions).toHaveBeenCalled();
  });

  it('should call getDetailsSecurityRealm an return propertiesMapping undefined', () => {
    const mockData = { ...data };
    mockData.body.properties = undefined;
    activeRoute.data = {
      subscribe: (fn: (value: any) => void) => fn({
        realm: mockData.body
      })
    };
    const formArray: FormArray = new FormArray([]);
    formArray.push(new FormGroup({
      name: new FormControl('', Validators.required)
    }));
    spyOnProperty(component, 'settingBlock', 'get').and.returnValue(formArray);
    fixture.detectChanges();
    securRealmsService.getDetailsSecurityRealm.and.returnValue(of(mockData));
    fixture.detectChanges();
    component.onChangeRealmType({
      value: {
        value: 'test'
      }
    }, undefined as any, 'realName');
    expect(component.propertiesMapping).toEqual(undefined);
  });

  it('should call getDetailsSecurityRealm, isEdit=true and return propertiesMapping undefined', () => {
    const mockData = { ...data };
    mockData.body.properties = undefined;
    securRealmsService.getDetailsSecurityRealmByName.and.returnValue(of(mockData));
    fixture.detectChanges();
    component.propertiesMapping = mockData.body.properties;
    component.onChangeRealmType(true, true, 'realName');
    fixture.detectChanges();
    expect(component.propertiesMapping).toEqual(mockData.body.properties);
  });

  it('should call onSubmit and selectedTypeValue has value', () => {
    component.securityRealmForm = new FormGroup({
      'SecurityRealmName': new FormControl('', Validators.required),
      'RealmType': new FormControl('', Validators.required),
      'SequenceRank': new FormControl('', Validators.required),
      'mappings': new FormArray([])
    });
    component.selectedTypeValue = 'test';
    component.realm_action = newReams;
    component.onSubmit();
    expect(component.isRealmTypeSelected).toBeTruthy();
  });

  it('should call onSubmit and throwError', () => {
    const error = {
      message: 'Error'
    };
    component.isEdit = true;
    component.realm = newReams;
    securRealmsService.updateSecurityRealm.and.returnValue(throwError(error));
    spyOn(component, 'setValueRealmAction');
    component.securityRealmForm = {
      valid: true
    };
    component.selectedTypeValue = 'type';
    component.realm_action = newReams;
    component.onSubmit();
    expect(component.setValueRealmAction).toHaveBeenCalled();
  });
});
