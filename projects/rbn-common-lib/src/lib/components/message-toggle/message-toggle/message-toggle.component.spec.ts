import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MessageToggleHiddenComponent } from '../message-toggle-hidden/message-toggle-hidden.component';

import { MessageService } from 'primeng/api';

import { MessageToggleComponent } from './message-toggle.component';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { MessageToggleModule } from '../message-toggle.module';

describe('MessageToggleComponent', () => {
  let component: MessageToggleComponent;
  let fixture: ComponentFixture<MessageToggleComponent>;

  const messageService = jasmine.createSpyObj('messageService', ['SendMessage']);
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
    },
    {
      closable: false,
      data: { from: 'server' },
      detail: 'This is an success message 3',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Success!'
    },
    {
      closable: false,
      data: { from: 'error' },
      detail: 'This is an success message 1',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Error!'
    },
    {
      closable: false,
      data: { from: 'error' },
      detail: 'This is an success message 2',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Error!'
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
  const messagesSuccess = [
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
    },
    {
      closable: false,
      data: { from: 'server' },
      detail: 'This is an success message 3',
      life: 5000,
      severity: 'success',
      showAction: true,
      sticky: true,
      summary: 'Success!'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageToggleComponent, MessageToggleHiddenComponent],
      imports: [
        MessageToggleModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RbnMessageService, useValue: messageService },
        { provide: MessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageToggleComponent);
    component = fixture.componentInstance;
    component.toast.messages = messages;
    fixture.detectChanges();
  });

  it('should message-toggle create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngDoCheck()', () => {
    const messageError = [
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
        detail: 'This is an success message 1',
        life: 5000,
        severity: 'warn',
        showAction: true,
        sticky: true,
        summary: 'Warn!'
      },
      {
        closable: false,
        data: { from: 'server' },
        detail: 'This is an success message 1',
        life: 5000,
        severity: 'error',
        showAction: true,
        sticky: true,
        summary: 'Error!'
      },
      {
        closable: false,
        data: { from: 'server' },
        detail: 'This is an success message 1',
        life: 5000,
        severity: 'info',
        showAction: true,
        sticky: true,
        summary: 'Info!'
      }
    ];
    component.toast.messages = messageError;
    spyOn(component, 'resetValuetMessage');
    spyOn(component, 'sortMessage');
    spyOn(component, 'setActionToggleMessage');
    component.ngDoCheck();
    expect(component.resetValuetMessage).toHaveBeenCalled();
    expect(component.sortMessage).toHaveBeenCalled();
    expect(component.setActionToggleMessage).toHaveBeenCalled();
  });

  it('should call customCloseToasts()', () => {
    component.customCloseToasts(message);
    const index = component.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    expect(index).toEqual(-1);
  });


  it('should call clearAllToggle()', () => {
    component.clearAllToggle(messagesSuccess);
    let index = -1;
    messagesSuccess.some((m) => {
      index = component.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(m));
      if (index !== -1) {
        return true;
      }
    });
    expect(index).toEqual(-1);
  });

  it('should call setToggleMessage in onToggleMessage()', () => {
    spyOn(component, 'setToggleMessage');
    component.onToggleMessage('success');
    expect(component.setToggleMessage).toHaveBeenCalled();
  });

  it('should call setToggleMessage in onToggleMessage()', () => {
    spyOn(component, 'setToggleMessage');
    component.onToggleMessage('error');
    expect(component.setToggleMessage).toHaveBeenCalled();
  });

  it('should call setToggleMessage in onToggleMessage()', () => {
    spyOn(component, 'setToggleMessage');
    component.onToggleMessage('info');
    expect(component.setToggleMessage).toHaveBeenCalled();
  });

  it('should call setToggleMessage in onToggleMessage()', () => {
    spyOn(component, 'setToggleMessage');
    component.onToggleMessage('warn');
    expect(component.setToggleMessage).toHaveBeenCalled();
  });

  it('should add classList when call setActionToggleMessage() with count > 1', () => {
    component.setActionToggleMessage(2, 'success', true);
    const arrEl = component.el.nativeElement.querySelectorAll('.p-toast-message-' + 'success');
    fixture.detectChanges();
    expect(arrEl[1].style.cssText).toContain('display: none;');
  });

  it('should add classList when call setActionToggleMessage() with count = 1', () => {
    component.setActionToggleMessage(1, 'success', false);
    const arrEl = component.el.nativeElement.querySelectorAll('.p-toast-message-' + 'success');
    expect(arrEl[1].classList).toContain('status-message-show');
  });

  it('should add classList when call setToggleMessage() with count = 1', () => {
    component.setToggleMessage('success', true);
    const arrEl = component.el.nativeElement.querySelectorAll('.p-toast-message-' + 'success');
    expect(arrEl[1].classList).toContain('status-message-show');
  });

  it('should call getZIndex', () => {
    const containerViewChild = {
      nativeElement: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setAttribute: () => { },
        style: {
          zIndex: 1
        }
      }
    };
    component.toast.containerViewChild = containerViewChild;
    const rs = component.getToastZIndex();
    expect(rs).toEqual(1);
  });

  it('should call sendMessage', () => {
    const event = {
      message: 'test'
    };
    messageService.SendMessage.and.returnValue(of(true));
    component.closeToasts(event);
    expect(messageService.SendMessage).toHaveBeenCalled();
  });
});
