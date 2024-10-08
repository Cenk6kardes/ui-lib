import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  // List of supported events
  public NAVIGATE_EVENT = 'NAVIGATE';

  constructor() {}

  private instantiate() {
    if (!(window as any).eventbus) {
      (window as any).eventbus = document.createElement('buselement');
    }
  }

  addEventListener(event, callback) {
    this.instantiate();
    (window as any).eventbus.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.instantiate();
    (window as any).eventbus.removeEventListener(event, callback);
  }

  dispatchEvent(event, detail = {}) {
    this.instantiate();
    (window as any).eventbus.dispatchEvent(new CustomEvent(event, { detail }));
  }

}
