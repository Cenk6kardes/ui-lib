/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { RbnMessageService } from '../../../services/rbn-message.service';
import { MessageComponent } from './message.component';
import { MessageModule } from '../message.module';


class MockRbnMessageService {
  clear() { }
  SendMessage() { }
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let mockRbnMessageService: MockRbnMessageService;
  let clearSpy;
  let sendMessageSpy;

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

  const containerViewChild = {
    nativeElement: {
      style: {
        zIndex: 1
      }
    }
  };

  beforeEach(async () => {
    mockRbnMessageService = new MockRbnMessageService();
    await TestBed.configureTestingModule({
      declarations: [
        MessageComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MessageModule
      ],
      providers: [
        { provide: RbnMessageService, useValue: mockRbnMessageService },
        { provide: MessageService }
      ]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    component.toast.messages = messages;
    clearSpy = spyOn(mockRbnMessageService, 'clear');
    sendMessageSpy = spyOn(mockRbnMessageService, 'SendMessage');
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clear all', () => {
    component.onClearAll();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should call sendMessage', () => {
    const event = {
      message: 'test'
    };
    component.closeToasts(event);
    expect(sendMessageSpy).toHaveBeenCalled();
  });

  it('should call isDisplayClearAll', () => {
    const rs = component.isDisplayClearAll();
    expect(rs).toBeTrue();
  });

  it('should call customCloseToasts()', () => {
    component.customCloseToasts(message);
    const index = component.toast.messages.findIndex(n => JSON.stringify(n) === JSON.stringify(message));
    expect(index).toEqual(-1);
  });

  it('should call getZIndex', () => {
    component.toast.containerViewChild = containerViewChild;
    const rs = component.getToastZIndex();
    expect(rs).toEqual(1);
  });
});
