import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Types, TFrom, Severity } from '../../../models/toast';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { NotificationsComponent } from './notifications.component';
import { MessageService } from 'primeng/api';
import { NotificationsModule } from '../notifications.module';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let originalTimeout: number;

  const data = {
    type: Types.CLOSE_ITEM,
    message: {
      data: {
        from: TFrom.SERVER
      },
      sticky: true,
      closable: true,
      severity: Severity.SUCCESS
    }
  };
  const msgServ = jasmine.createSpyObj('msgServ', {
    onEventSendMessage: of(data),
    addAll: of(true),
    SendMessage: of(true),
    clear: of(true)
  });
  const messages = [
    {
      closable: false,
      data: { from: 'server' },
      detail: 'This is an success message 1',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Success!'
    },
    {
      closable: false,
      data: { from: 'server' },
      detail: 'This is an success message 2',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Success!'
    }
  ];
  const message = {
    closable: false,
    data: { from: 'server' },
    detail: 'This is an success message 1',
    life: 5000,
    severity: 'success',
    showAction: true,
    sticky: true,
    summary: 'Success!'
  };
  const containerViewChild = {
    nativeElement: {
      style: {
        zIndex: 1
      }
    }
  };


  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    window.sessionStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationsModule
      ],
      declarations: [NotificationsComponent],
      providers: [
        { provide: RbnMessageService, useValue: msgServ },
        { provide: MessageService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    component.showLevelMsg = false;
  });

  it('should create from server', () => {
    window.sessionStorage.clear();
    component.showLevelMsg = true;
    msgServ.onEventSendMessage.and.returnValue(of(data));
    window.sessionStorage.setItem(component.keyStorage, JSON.stringify([data.message]));
    expect(component).toBeTruthy();
  });

  it('should create close all', () => {
    window.sessionStorage.clear();
    const closeData = {
      type: Types.CLOSE_ALL,
      message: {
        data: {
          from: TFrom.SERVER
        },
        sticky: true,
        closable: true,
        severity: Severity.SUCCESS
      }
    };
    msgServ.onEventSendMessage.and.returnValue(of(closeData));
    window.sessionStorage.setItem(component.keyStorage, JSON.stringify([closeData.message]));
    expect(component).toBeTruthy();
  });

  it('should create from local', () => {
    window.sessionStorage.clear();
    component.showLevelMsg = true;
    const localData = {
      type: Types.CLOSE_ITEM,
      message: {
        data: {
          from: TFrom.LOCAL
        },
        sticky: true,
        closable: true,
        severity: Severity.SUCCESS
      }
    };
    msgServ.onEventSendMessage.and.returnValue(of(localData));
    window.sessionStorage.setItem(component.keyStorage, JSON.stringify([localData.message]));
    expect(component).toBeTruthy();
  });

  it('should call toggleMsg', () => {
    window.sessionStorage.setItem(component.keyStorage, JSON.stringify([data.message]));
    component.isEnableToastMsg = true;
    component.toggleMsg();
    expect(component.showLevelMsg).toBeTruthy();
  });

  it('should call disableMessages', () => {
    spyOn(component, 'onEventOffLevelMsg');
    component.showLevelMsg = true;
    component.disableMessages();
    expect(component.onEventOffLevelMsg).toHaveBeenCalled();
  });

  it('should call enableMessages', () => {
    component.enableMessages();
    expect(component.isEnableToastMsg).toBeTruthy();
  });

  it('should call setNumberMsg', () => {
    component.setNumberMsg([data.message]);
    expect(component.numberMessage).toEqual(1);
  });

  it('should call resetNumberMsg', () => {
    component.resetNumberMsg();
    expect(component.numberMessage).toEqual(0);
  });

  it('should call onClearAll', () => {
    component.onClearAll();
    expect(msgServ.SendMessage).toHaveBeenCalled();
  });

  it('should call closeToasts', () => {
    component.closeToasts(data);
    expect(msgServ.SendMessage).toHaveBeenCalled();
  });

  it('should call onEventOffLevelMsg', () => {
    spyOn(component, 'getMsg');
    component.onEventOffLevelMsg();
    expect(component.getMsg).toHaveBeenCalled();
  });

  it('should call ngInit', () => {
    component.ngOnInit();
    expect(window.sessionStorage).toBeTruthy();
  });

  it('should change messages', () => {
    component.toast.messages = messages;
    component.onEventOffLevelMsg();
    expect(component.toast.messages[0].closable).toBeTrue();
    expect(component.showLevelMsg).toBeFalse();
  });

  it('should call customCloseToasts()', () => {
    component.toast.messages = messages;
    component.customCloseToasts(message);
    const index = component.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    expect(index).toEqual(-1);
  });

  it('should call getZIndex', () => {
    component.toast.containerViewChild = containerViewChild;
    const rs = component.getToastZIndex();
    expect(rs).toEqual(1);
  });

  it('should call resetNumberMsg', () => {
    spyOn(component, 'resetNumberMsg');
    const arr = [];
    component.setNumberMsg(arr);
    expect(component.resetNumberMsg).toHaveBeenCalled();
  });
});
