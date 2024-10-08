import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRealmsDeleteComponent } from './security-realms-delete.component';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SecurityRealms } from '../securityRealms';
// import { SecurityRealmsService } from '../../services/security-realms.service';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { RbnSecurityRealmsModule } from '../rbn-security-realms.module';

export const securityRealm_delete: SecurityRealms = {
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

describe('SecurityRealmsDeleteComponent', () => {
  let component: SecurityRealmsDeleteComponent;
  let fixture: ComponentFixture<SecurityRealmsDeleteComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  const securityRealmService = jasmine.createSpyObj('securityRealmService', ['deleteSecurityRealm']);

  let originalTimeout: number;
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

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RbnSecurityRealmsModule
      ],
      declarations: [SecurityRealmsDeleteComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: 'SecurityRealmsInterfaceService', useValue: securityRealmService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (http) {
      http.expectOne('./assets/i18n/en.json').flush({
        ADMIN: {
          DELETE_SECURITY_REALM: 'Delete',
          DESTORY_SECURITY_REALM: 'Are you sure you want to delete the Security Realm',
          DELETE: 'Delete'
        }
      });
      http.expectOne('./assets/i18n/rbn_en.json').flush({
        COMMON: {
          YES: 'Yes',
          NO: 'No',
          CANCEL: 'Cancel',
          DELETE: 'Delete',
          ACTION_CANNOT_BE_UNDONE: 'This action cannot be undone'
        }
      });
    }
    if (translateSevice) {
      translateSevice.addLangs(['en']);
      translateSevice.setDefaultLang('en');
    }
    fixture = TestBed.createComponent(SecurityRealmsDeleteComponent);
    component = fixture.componentInstance;
    component.isShowContent = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have header title for securityRealm-delete Panel', () => {
    fixture.detectChanges();
    // get header title element
    const header = fixture.debugElement.query(By.css('#securityRealm-delete .p-dialog-title'));
    expect(header.nativeElement.textContent).toEqual(' Delete');
  });

  it('should have message confirm delete securityRealm', () => {
    // get header element
    fixture.detectChanges();
    const header1 = fixture.debugElement.query(By.css('#securityRealm-delete .p-dialog-content div i'));
    expect(header1.nativeElement.innerText).toEqual('This action cannot be undone');
  });

  it('should have icon close', () => {
    // get icon element
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('#securityRealm-delete span.pi-times'));
    expect(icon).toBeTruthy();
  });

  it('should call event close when clicked on cross icon in popup', () => {
    // get icon element
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('#securityRealm-delete span.pi-times'));
    icon.nativeElement.click();
    fixture.detectChanges();
    expect(component.isShowContent).toEqual(false);
  });

  it('should call event close when click on cancel button', () => {
    // get close button
    fixture.detectChanges();
    spyOn(component, 'onClickCancel');
    const button = fixture.debugElement.query(By.css('#securityRealm-delete p-footer button:nth-child(1)'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.onClickCancel).toHaveBeenCalled();
  });

  it('should call onClickCancel', () => {
    // get icon element
    component.onClickCancel();
    expect(component.isShowContent).toEqual(false);
  });

  it('should call securityRealmCloseDialogDelete', () => {
    spyOn(component.emitCloseDelete, 'emit');
    component.securityRealmCloseDialogDelete();
    expect(component.emitCloseDelete.emit).toHaveBeenCalledWith(false);
  });

  it('should call securityRealmDelete function when click on delete button', () => {
    spyOn(component, 'deleteSecurityRealm');
    // get delete button element
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#securityRealm-delete p-footer button:nth-child(2)'));
    button.nativeElement.click(); // 0: cancel button. 1: destroy button
    fixture.detectChanges();
    expect(component.deleteSecurityRealm).toHaveBeenCalled();
  });

  it('should have title button delete', () => {
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-delete p-footer button:nth-child(2)'));
    expect(button.nativeElement.textContent).toEqual('Yes');
  });

  it('should have title button cancel', () => {
    fixture.detectChanges();
    // get button element
    const button = fixture.debugElement.query(By.css('#securityRealm-delete p-footer button:nth-child(1)'));
    expect(button.nativeElement.textContent).toEqual('No');
  });

  it('should call emitCloseDelete success', () => {
    spyOn(component.emitCloseDelete, 'emit');
    component.realm = securityRealm_delete;
    securityRealmService.deleteSecurityRealm.and.returnValue(of({}));
    component.deleteSecurityRealm();
    expect(component.emitCloseDelete.emit).toHaveBeenCalledWith(true);
  });

  it('should call emitCloseDelete fail', () => {
    spyOn(component.emitCloseDelete, 'emit');
    component.realm = securityRealm_delete;
    securityRealmService.deleteSecurityRealm.and.returnValue(throwError({}));
    component.deleteSecurityRealm();
    expect(component.emitCloseDelete.emit).toHaveBeenCalledWith(false);
  });
});

