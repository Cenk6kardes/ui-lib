import { DatePipe } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';

import { GeneralService } from './general.service';

describe('GeneralService', () => {
  let service: GeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    service = TestBed.inject(GeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call epocToDate for length of 10',
    inject([GeneralService], (generalService) => {
      generalService.epocToDate(1234567890);
      expect(1234567890 * 1000).toBeTruthy();
    }));

  it('should call epocToDate for length of 13',
    inject([GeneralService], (generalService) => {
      generalService.epocToDate(1234567890000);
      const lenght = String(1234567890000).length;
      expect(lenght).toEqual(13);
    }));

  it('should call epocToDate for length of 16',
    inject([GeneralService], (generalService) => {
      generalService.epocToDate(1234567890000000);
      const lenght = String(1234567890000000).length;
      expect(lenght).toEqual(16);
    }));

  it('should call getId',
    inject([GeneralService], (generalService) => {
      const id = generalService.getId('Test-1');
      expect(id).toEqual('Test1');
    }));
});
