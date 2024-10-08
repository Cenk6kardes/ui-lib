import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';

import { SecurityRealmsComponent } from './security-realms.component';
import { NavigateCommonService } from '../services/navigate-common.service';
import { RbnSecurityRealmsModule } from '../rbn-security-realms.module';

class MockTranslateService {
  get() {
    const obs = from([{
      ADMIN: {
        REORDER: 'All',
        SEQUENCE: 'Hostname/IP',
        REALM: 'Port',
        TYPE: 'Password',
        STATUS: 'Status',
        ACTIONS: 'Database Type',
        ENABLE: 'Enabled',
        DELETE: 'Delete',
        DISABLE: 'Disabled'
      },
      ENABLED: 'Enabled',
      DISABLED: 'Disabled'
    }]);
    return obs;
  }
  addLangs() {
    return;
  }
  setDefaultLang() {
    return;
  }
}

const newReams = {
  name: 'name',
  type: 'type',
  sequence: 1,
  enabled: 'Enabled'
};

describe('SecurityRealmsComponent', () => {
  let component: SecurityRealmsComponent;
  let fixture: ComponentFixture<SecurityRealmsComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  const realmService = jasmine.createSpyObj('realmService', {
    getRealms: () => ({}),
    reorderSecurityRealm: () => ({})
  });
  const navService = jasmine.createSpyObj('navService', ['navigateToForm']);
  let mockTranslateService: MockTranslateService;

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
    mockTranslateService = new MockTranslateService();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RbnSecurityRealmsModule
      ],
      declarations: [SecurityRealmsComponent],
      providers: [
        MessageService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: NavigateCommonService, useValue: navService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: 'SecurityRealmsInterfaceService', useValue: realmService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityRealmsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRealms on ngOnInit', () => {
    spyOn(component, 'getRealms');
    component.ngOnInit();
    expect(component.getRealms).toHaveBeenCalled();
  });

  it('should call getRealms when eventCloseEnableDisable with event = true', () => {
    spyOn(component, 'closeDialog');
    component.eventCloseEnableDisable(true);
    expect(component.closeDialog).toHaveBeenCalled();
    expect(component.isShowEnableDisable).toBeFalsy();
  });

  it('should create action list with enable when status = false', () => {
    const actions = component.createActionsDropdown(false);
    expect(actions[0].value).toEqual('enable');
    expect(actions[1].value).toEqual('delete');
  });

  it('should create action list with disable when status = true', () => {
    const actions = component.createActionsDropdown(true);
    expect(actions[0].value).toEqual('disable');
    expect(actions[1].value).toEqual('delete');
  });

  it('should call createActionsDropdown when getRealms', () => {
    spyOn(component, 'createActionsDropdown');
    spyOn(component, 'initDropdownData');
    spyOn(component, 'cleanDataTableFilter');
    realmService.getRealms.and.returnValue(of({ body: [{ 'name': 'test realm', enabled: false }] }));
    component.getRealms();
    expect(component.data.length).toEqual(1);
  });

  it('should navigate to Form when onLinkClick', () => {
    component.onLinkClick('select row');
    expect(navService.navigateToForm).toHaveBeenCalled();
  });

  it('should call getRealms when refreshData', () => {
    spyOn(component, 'getRealms');
    component.refreshData();
    expect(component.getRealms).toHaveBeenCalled();
  });

  it('should navigate to Form when add', () => {
    component.addRealm();
    expect(navService.navigateToForm).toHaveBeenCalled();
  });

  it('should call refreshData when onEventRowReorder success', (done) => {
    spyOn(component, 'refreshData');
    component.data = [{ name: 'aaa' }] as any;
    realmService.reorderSecurityRealm.and.returnValue(of({ body: [] }));
    component.onEventRowReorder();
    setTimeout(() => {
      expect(component.refreshData).toHaveBeenCalled();
      window.clearInterval(0);
      done();
    }, 1001);
  });

  it('should set data when closeDialog', () => {
    spyOn(component, 'getRealms');
    spyOn(component, 'resetFilter');
    spyOn(component, 'resetAllDropDownActions');
    component.closeDialog(true);
    expect(component.selectedRow).toBeUndefined();
    expect(component.getRealms).toHaveBeenCalled();
    expect(component.resetFilter).toHaveBeenCalled();
    expect(component.resetAllDropDownActions).toHaveBeenCalled();
  });

  it('should call getRealms when eventCloseDelete with event = true', () => {
    spyOn(component, 'closeDialog');
    component.eventCloseDelete(true);
    expect(component.closeDialog).toHaveBeenCalled();
    expect(component.isShowDelete).toBeFalsy();
  });

  it('should call refreshData when onEventRowReorder error', (done) => {
    spyOn(component, 'refreshData');
    component.data = [{ name: 'aaa' }] as any;
    realmService.reorderSecurityRealm.and.returnValue(throwError({ error: { status: 400 } }));
    component.onEventRowReorder();
    setTimeout(() => {
      expect(component.refreshData).toHaveBeenCalled();
      window.clearInterval(0);
      done();
    }, 1001);
  });

  it('should set selectedRow = rowData when onChangeActions', () => {
    const data = {
      rowData: newReams,
      event: { value: 'disable' },
      rowIndex: 0
    };
    component.onChangeActions(data);
    expect(component.selectedRow).toEqual(data.rowData);
  });

  it('should call resetActionsMode when existed event.value when onChangeActions', () => {
    spyOn(component, 'resetActionsMode');
    const data = {
      rowData: newReams,
      event: { value: '' },
      rowIndex: 0
    };
    component.onChangeActions(data);
    expect(component.resetActionsMode).toHaveBeenCalled();
  });

  it('should set mode disable when onChangeActions with event.value = disable', () => {
    spyOn(component, 'resetActionsMode');
    const data = {
      rowData: newReams,
      event: { value: 'disable' },
      rowIndex: 0
    };
    component.onChangeActions(data);
    expect(component.isShowEnableDisable).toBeTruthy();
    expect(component.isDisableSelected).toBeTruthy();
  });

  it('should set mode enable when onChangeActions with event.value = enable', () => {
    spyOn(component, 'resetActionsMode');
    const data = {
      rowData: newReams,
      event: { value: 'enable' },
      rowIndex: 0
    };
    component.onChangeActions(data);
    expect(component.isShowEnableDisable).toBeTruthy();
    expect(component.isEnableSelected).toBeTruthy();
  });

  it('should set mode delete when onChangeActions with event.value = delete', () => {
    spyOn(component, 'resetActionsMode');
    const data = {
      rowData: newReams,
      event: { value: 'delete' },
      rowIndex: 0
    };
    component.onChangeActions(data);
    expect(component.isShowDelete).toBeTruthy();
  });

  it('should call dataDropdown', () => {
    console.log(component.translateResults.ENABLED);
    const item = { test: true as any };
    component.dataDropdown([{ label: 'Enabled', value: 'enabled' }], item, 'test');
    expect(item.test).toEqual('Enabled');
  });
});

