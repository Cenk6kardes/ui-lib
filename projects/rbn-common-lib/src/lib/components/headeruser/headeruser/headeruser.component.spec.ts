import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Headeruser } from '../../../models/headeruser';
import { HeaderuserComponent } from './headeruser.component';
import { HttpLoaderFactory } from '../../../shared/http-loader';

describe('HeaderuserComponent', () => {
  let component: HeaderuserComponent;
  let fixture: ComponentFixture<HeaderuserComponent>;

  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  const items = [
    {
      label: 'sysadmin',
      icon: 'pi pi-pw pi-user',
      items: [{
        label: 'About',
        icon: 'pi pi-pw'
      }, {
        label: 'Help',
        icon: 'pi pi-pw',
        command: () => {
          alert('TBD');
        }
      }, {
        label: 'Log out',
        icon: 'pi pi-pw'
      }]
    }
  ];

  const header: Headeruser = {
    items: items,
    username: 'user',
    logoutUrl: '',
    infoHeader: '',
    infoContent: ['content1']
  };

  const timezones = [
    { label: 'Local', value: 0 },
    { label: 'UTC', value: 1 }
  ];

  const service = jasmine.createSpyObj('HeaderuserInterfaceService', {
    setTimezone: of(true),
    getUserActions: of(header),
    logout: of(true),
    changePwd: of(true)
  });

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HeaderuserComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: 'HeaderuserInterfaceService', useValue: service },
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderuserComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component, 'getData');
    expect(component).toBeTruthy();
  });

  it('should call logout', () => {
    fixture.detectChanges();
    component.logout();
    expect(component.showLogout).toBeFalsy();
    expect(component.showInfo).toBeFalsy();
    expect(component.showPref).toBeFalsy();
    expect(service.logout).toHaveBeenCalled();
  });

  it('should call OnChangeTimezone', () => {
    component.OnChangeTimezone();
    expect(service.setTimezone).toHaveBeenCalled();
  });

  it('should call cancelPwd', () => {
    spyOn(component, 'clearFields');
    component.cancelPwd();
    expect(component.clearFields).toHaveBeenCalled();
  });

  it('should set pwderror when call changePwd with empty data', () => {
    component.expwd = '';
    component.newpwd = '';
    component.cnewpwd = '';
    component.validatorMessages = {
      required: 'All fields are required.'
    };
    component.changePwd();
    expect(component.pwderror).toEqual(component.validatorMessages.required);
  });

  it('should pwderror when call changePwd with expwd !== newpwd', () => {
    component.expwd = 'testvalue';
    component.newpwd = 'testvalue1';
    component.cnewpwd = 'testvalue2';
    component.validatorMessages = {
      match: 'Password confirmation must match Password.'
    };
    component.changePwd();
    expect(component.pwderror).toEqual(component.validatorMessages.match);
  });

  // it('should call changepw successfully', () => {
  //   component.expwd = 'testvalue';
  //   component.newpwd = 'testvalue1';
  //   component.cnewpwd = 'testvalue1';
  //   fixture.detectChanges();
  //   component.changePwd();
  //   expect(component.pwderror).toEqual('');
  //   expect(component.showPref).toEqual(false);
  //   expect(service.changePwd).toHaveBeenCalled();
  // });

});


