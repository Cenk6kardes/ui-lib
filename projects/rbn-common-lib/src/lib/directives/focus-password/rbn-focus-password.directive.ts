import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { Password } from 'primeng/password';

import { WcagService } from '../../services/wcag.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-password'
})
export class RbnFocusPasswordDirective implements AfterViewInit {

  constructor(private password: Password, private el: ElementRef, private wcagService: WcagService) {
  }

  ngAfterViewInit(): void {
    const iconEl = this.el.nativeElement.querySelectorAll('.p-input-icon-right > i');
    if (this.password.toggleMask && iconEl && iconEl.length > 0) {
      for (let i = 0; i < iconEl.length; i++) {
        iconEl[i].setAttribute('tabindex', 0);
      }
      this.wcagService.setClickForElement(iconEl);
    }
  }
}

