import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ScreenReaderService } from './screen-reader.service';
import { WcagService } from './wcag.service';

describe('ScreenReaderService', () => {
  let service: ScreenReaderService;
  const wcagService = jasmine.createSpyObj<WcagService>('wcagService', ['getFieldName']);
  const liveAnnouncer = jasmine.createSpyObj<LiveAnnouncer>('liveAnnouncer', ['announce']);
  const translateService = jasmine.createSpyObj<TranslateService>('translateService', ['get']);
  const translateServiceMock = {
    use: translateService.get,
    get: translateService.get.and.returnValue(of(
      {
        'DEFAULT': 'This field'
      }))
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: WcagService, useValue: wcagService },
        { provide: LiveAnnouncer, useValue: liveAnnouncer }
      ]
    });
    service = TestBed.inject(ScreenReaderService);
    service.isAnnounceErrMsg = true;
  });

  it('should be call func announce', () => {
    const field = document.createElement('input');
    const err = 'Required';
    service.announce(field, err);
    expect(wcagService.getFieldName).toHaveBeenCalled();
  });

  it('should be call func announceWithCount', () => {
    const mess = 'This field required';
    service.announceWithCount(mess);
    setTimeout(() => {
      expect(liveAnnouncer.announce).toHaveBeenCalled();
    }, 100);
  });
});
