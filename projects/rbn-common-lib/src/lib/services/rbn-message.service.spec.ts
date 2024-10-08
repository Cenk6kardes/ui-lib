/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Message, MessageService } from 'primeng/api';
import { from } from 'rxjs';
import { AlertType } from '../models/toast';
import { RbnMessageService } from './rbn-message.service';


class MockTranslateService {
  get() {
    const obs = from([{ info: 'INFO', warn: 'WARN', error: 'ERR', success: 'SUCC' }]);
    return obs;
  }
}

class MockMessageService {
  add(message: { severity: string, summary: string, detail: string }) { }
  clear() { }
  addAll() { }
}


describe('MessagingService', () => {
  let rbnMessageService!: RbnMessageService;
  let mockTranslateService: MockTranslateService;
  let mockMessageService: MockMessageService;
  let spy: any;

  beforeEach(() => {
    mockTranslateService = new MockTranslateService();
    mockMessageService = new MockMessageService();

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        RbnMessageService,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    });
    // Inject both the service-to-test and its (spy) dependency
    rbnMessageService = TestBed.inject(RbnMessageService);

    // translateServiceSpy = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    expect(service).toBeTruthy();
  });

  it('should call native message service with Error', () => {
    spy = spyOn(mockMessageService, 'add');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.showError('detailssss');
    expect(mockMessageService.add).toHaveBeenCalled();

  });

  it('should call native message service with Warning', () => {
    spy = spyOn(mockMessageService, 'add');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.showWarn('detailssss');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(mockMessageService.add).toHaveBeenCalled();

  });

  it('should call native message service with Info', () => {
    spy = spyOn(mockMessageService, 'add');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.showInfo('detailssss');
    expect(mockMessageService.add).toHaveBeenCalled();
  });

  it('should call native message service with Success', () => {
    spy = spyOn(mockMessageService, 'add');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.showSuccess('detailssss');
    expect(mockMessageService.add).toHaveBeenCalled();

  });

  it('should call native message service with clear', () => {
    spy = spyOn(mockMessageService, 'clear');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.clear();
    expect(mockMessageService.clear).toHaveBeenCalled();
  });

  it('should call native message service with Success type BASIC', () => {
    spy = spyOn(mockMessageService, 'add');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    service.setAlerType(AlertType.BASIC);
    service.showSuccess('detailssss');
    expect(mockMessageService.add).toHaveBeenCalled();
  });

  it('should call addAll', () => {
    spy = spyOn(mockMessageService, 'addAll');
    const service: RbnMessageService = TestBed.inject(RbnMessageService);
    const message: Message = {
      detail: 'Test1'
    };
    service.addAll([message]);
    expect(mockMessageService.addAll).toHaveBeenCalled();
  });
});
