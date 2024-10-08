import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable } from '@angular/core';
import { WcagService } from './wcag.service';

@Injectable({
  providedIn: 'root'
})
export class ScreenReaderService {
  trans: any;
  counter = 0;
  isAnnouncedLoading = false;
  customizedAnnouceElm: any;
  isAnnounceErrMsg = false;

  constructor(private liveAnnouncer: LiveAnnouncer, private wcagService: WcagService) {
    this.initCustomizedAnnouce();
  }

  announce(field: any, err: string): void {
    if (!err || !this.isAnnounceErrMsg) {
      return;
    }
    const error = err.trim().charAt(0).toLowerCase() + err.trim().slice(1);
    const fieldName = this.wcagService.getFieldName(field);
    const message = `${fieldName}: ${error}`;
    this.liveAnnouncer.announce(message);
  }


  // announce message orderly without overriding
  announceWithCount(message: string, duration = 500): void {
    setTimeout(() => {
      this.liveAnnouncer.announce(message);
      this.counter--;
    }, duration * this.counter);

    this.counter++;
  }

  // using in case announceWithCount() not working
  initCustomizedAnnouce(): void {
    if (!document.getElementById('customizedAnnouce')) {
      this.customizedAnnouceElm = document.createElement('div') as any;
      this.customizedAnnouceElm.setAttribute('id', 'customizedAnnouce');
      this.customizedAnnouceElm.setAttribute('aria-live', 'polite');
      this.customizedAnnouceElm.setAttribute('aria-atomic', true);
      this.customizedAnnouceElm.classList.add('cdk-live-announcer-element', 'cdk-visually-hidden');
      document.body.appendChild(this.customizedAnnouceElm);
    }
  }

  customizedAnnouce(message: string) {
    if (this.customizedAnnouceElm) {
      this.customizedAnnouceElm.innerHTML = message;
    }
  }
}
