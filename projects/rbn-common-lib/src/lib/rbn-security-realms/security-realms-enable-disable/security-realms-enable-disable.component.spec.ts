import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRealmsEnableDisableComponent } from './security-realms-enable-disable.component';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';

import { SecurityRealms } from '../securityRealms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RbnSecurityRealmsModule } from '../rbn-security-realms.module';

export const testData: SecurityRealms = {
  name: 'Realm1',
  type: 'LDAP',
  sequence: 1,
  properties: [
    {
      keypair_attribute: '',
      keypair_value: ''
    }
  ],
  enabled: true
};

describe('SecurityRealmsEnableDisableComponent', () => {
  let component: SecurityRealmsEnableDisableComponent;
  let fixture: ComponentFixture<SecurityRealmsEnableDisableComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  const securityRealmService = jasmine.createSpyObj('securityRealmService', ['updateSecurityRealm']);
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
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnSecurityRealmsModule
      ],
      declarations: [SecurityRealmsEnableDisableComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: 'SecurityRealmsInterfaceService', useValue: securityRealmService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (http) {
      http.expectOne('./assets/i18n/en.json').flush({
        ADMIN: {
          ENABLE_SECURITY_REALM: 'Enable Security Realm',
          ENABLE_SECURITY_REALM_SURE: 'Are you sure you want to enable this Security Realm',
          DISABLE_SECURITY_REALM: 'Disable Security Realm',
          DISABLE_SECURITY_REALM_SURE: 'Are you sure you want to disable this Security Realm',
          ENABLE: 'Enable',
          DISABLE: 'Disable'
        }
      });
      http.expectOne('./assets/i18n/rbn_en.json').flush({
        COMMON: {
          YES: 'Yes',
          NO: 'No',
          CANCEL: 'Cancel',
          ACTION_CANNOT_BE_UNDONE: 'This action cannot be undone'
        }
      });
    }
    if (translateSevice) {
      translateSevice.addLangs(['en']);
      translateSevice.setDefaultLang('en');
    }
    fixture = TestBed.createComponent(SecurityRealmsEnableDisableComponent);
    component = fixture.componentInstance;
    component.isShowContent = true;
    // component.isDisableSelected = false;
    component.realm = testData;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have header title for securityRealm-enable Panel', () => {
    component.isEnableSelected = true;
    fixture.detectChanges();
    // get header title element
    const header = fixture.debugElement.query(By.css('.p-dialog-header .p-dialog-title'));
    expect(header.nativeElement.textContent).toEqual(' Enable Security Realm');
  });

  it('should have message confirm enable securityRealm', () => {
    // get header element
    component.isEnableSelected = true;
    component.realm = testData;
    fixture.detectChanges();
    const output = fixture.debugElement.query(By.css('#securityRealm-enable .p-dialog-content span'));
    expect(output.nativeElement.textContent).toEqual(
      ' Are you sure you want to enable this Security Realm' + ' ' + component.realm.name + ' ?'
    );
  });

  it('should call event close when click on cancel button', () => {
    // get close button
    component.isEnableSelected = true;
    fixture.detectChanges();
    spyOn(component, 'closeDialog');
    const button = fixture.debugElement.query(By.css('#securityRealm-enable p-footer button:nth-child(1)'));
    button.nativeElement.click();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should call securityRealmDelete function when click on enable button', () => {
    component.isEnableSelected = true;
    component.realm = testData;
    spyOn(component, 'enableSecurityRealm');
    fixture.detectChanges();
    // get delete button element
    const button = fixture.debugElement.queryAll(By.css('#securityRealm-enable p-footer button'));
    button[1].nativeElement.click(); // 0: cancel button. 1: destroy button
    fixture.detectChanges();
    expect(component.enableSecurityRealm).toHaveBeenCalled();
    expect(component.isEnableSelected).toEqual(true);
    // expect(component.realm.enabled).toEqual(true);
  });

  it('should call enableSecurityRealm success', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    const data = { ...testData };
    data['actions'] = ['delete'];
    data['ngModel'] = 'test';
    component.realm = data;
    securityRealmService.updateSecurityRealm.and.returnValue(of({}));
    component.enableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(true);
  });

  it('should call enableSecurityRealm fail status=403', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.realm = testData;
    securityRealmService.updateSecurityRealm.and.returnValue(throwError({ status: 403 }));
    component.enableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(false);
  });

  it('should call enableSecurityRealm fail status!=403', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.realm = testData;
    securityRealmService.updateSecurityRealm.and.returnValue(throwError({}));
    component.enableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(true);
  });

  it('should have title button enable', () => {
    component.isEnableSelected = true;
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-enable p-footer button:nth-child(2)'));
    expect(button.nativeElement.textContent).toEqual('Yes');
  });

  it('should have title button cancel', () => {
    component.isEnableSelected = true;
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-enable p-footer button:nth-child(1)'));
    expect(button.nativeElement.textContent).toEqual('No');
  });

  it('should have header title for securityRealm-disable Panel', () => {
    component.isDisableSelected = true;
    fixture.detectChanges();
    // get header title element
    const header = fixture.debugElement.query(By.css('.p-dialog-header .p-dialog-title'));
    expect(header.nativeElement.textContent).toEqual(' Disable Security Realm');
  });

  it('should have message confirm disable securityRealm', () => {
    // get header element
    component.isDisableSelected = true;
    component.realm = testData;
    fixture.detectChanges();
    const output = fixture.debugElement.query(By.css('#securityRealm-disable .p-dialog-content span'));
    expect(output.nativeElement.textContent).toEqual(
      ' Are you sure you want to disable this Security Realm' + ' ' + component.realm.name + ' ?'
    );
  });

  it('should call event close when click on cancel button', () => {
    // get close button
    component.isDisableSelected = true;
    fixture.detectChanges();
    spyOn(component, 'closeDialog');
    const button = fixture.debugElement.query(By.css('#securityRealm-disable p-footer button:nth-child(1)'));
    button.nativeElement.click();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should call closeDialog', () => {
    // get close button
    component.closeDialog();
    expect(component.isShowContent).toBeFalsy();
  });

  it('should call securityRealmDelete function when click on disable button', () => {
    component.isDisableSelected = true;
    const data = testData;
    data.enabled = false;
    component.realm = data;
    fixture.detectChanges();
    spyOn(component, 'disableSecurityRealm');
    // get delete button element
    const button = fixture.debugElement.query(By.css('#securityRealm-disable p-footer button:nth-child(2)'));
    button.nativeElement.click(); // 0: cancel button. 1: destroy button
    fixture.detectChanges();
    expect(component.disableSecurityRealm).toHaveBeenCalled();
    expect(component.isDisableSelected).toEqual(true);
    expect(component.realm.enabled).toEqual(false);
  });

  it('should have title button disable', () => {
    component.isDisableSelected = true;
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-disable p-footer button:nth-child(2)'));
    expect(button.nativeElement.textContent).toEqual('Yes');
  });

  it('should have title button cancel', () => {
    component.isDisableSelected = true;
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-disable p-footer button:nth-child(1)'));
    expect(button.nativeElement.textContent).toEqual('No');
  });

  it('should call disableSecurityRealm success', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.realm = testData;
    securityRealmService.updateSecurityRealm.and.returnValue(of({}));
    component.disableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(true);
  });

  it('should call disableSecurityRealm fail status=403', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.realm = testData;
    securityRealmService.updateSecurityRealm.and.returnValue(throwError({ status: 403 }));
    component.disableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(false);
  });

  it('should call disableSecurityRealm fail status!=403', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.realm = testData;
    securityRealmService.updateSecurityRealm.and.returnValue(throwError({}));
    component.disableSecurityRealm();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(true);
  });

  it('should call securityRealmCloseDialogEnableDisable', () => {
    spyOn(component.emitCloseEnableDisable, 'emit');
    component.securityRealmCloseDialogEnableDisable();
    expect(component.emitCloseEnableDisable.emit).toHaveBeenCalledWith(false);
  });
});

