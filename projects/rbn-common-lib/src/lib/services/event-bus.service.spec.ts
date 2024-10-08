import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventBusService } from './event-bus.service';


describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register event and dispatch', fakeAsync(() => {
    const eventHandler = jasmine.createSpy('eventHandler');
    const detail = new CustomEvent(service.NAVIGATE_EVENT, {
      detail: {
        route: 'fm',
        id: '123456'
      }
    });
    service.addEventListener(service.NAVIGATE_EVENT, eventHandler);
    tick();
    (window as any).eventbus.dispatchEvent(new CustomEvent('NAVIGATE', detail));
    tick();

    expect(eventHandler).toHaveBeenCalled();
  }));
});
