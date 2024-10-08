import { DatePipe } from '@angular/common';
import { ElementRef, Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';


@Injectable()
export class MockElementRef {
  nativeElement: {};
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatePipe,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onStepperNext() should emit data to onstepperNext$ Subject',
    inject([ValidationService], (validationService) => {
      spyOn(validationService, 'onStepperNext');
      validationService.onStepperNext('test');

      validationService.onstepperNext$.subscribe((message) => {
        expect(message).toBe('test');
      });
      expect(validationService.onStepperNext).toHaveBeenCalled();
    }));

  it('onStepperNext() should emit data to onstepperNext$ Subject',
    inject([ValidationService], (validationService) => {
      spyOn(validationService, 'getStepperNext');
      validationService.getStepperNext();
      const stepperObj = [{
        label: 'Remote Destination Details',
        // subText: 'Remote subtext',
        description: 'Specify the destination details in the system',
        id: 1
      }];
      validationService.onstepperNext$.subscribe(stepper => {
        expect(stepper).toBe(stepperObj);
      });
      expect(validationService.getStepperNext).toHaveBeenCalled();
    }));

  it('should call isStepValid',
    inject([ValidationService], (validationService) => {
      const step = {
        elementRef: {
          nativeElement: {
            querySelectorAll: () => [{
              getAttribute: () => ['username']
            }]
          }
        }
      };
      spyOn(validationService, 'onStepperNext').and.callFake(() => null);
      validationService.isStepValid(step);
      expect(validationService.onStepperNext).toHaveBeenCalled();
    }));

  it('should call isStepValid with step = {} and return undefined',
    inject([ValidationService], (validationService) => {
      const step = null;
      spyOn(validationService, 'onStepperNext').and.callFake(() => null);
      const value = validationService.isStepValid(step);
      expect(value).toEqual(undefined);
    }));

  it('should call isStepValid with step.elementRef = {} and return undefined',
    inject([ValidationService], (validationService) => {
      const step = {
        elementRef: {}
      };
      spyOn(validationService, 'onStepperNext').and.callFake(() => null);
      const value = validationService.isStepValid(step);
      expect(value).toEqual(undefined);
    }));
});
