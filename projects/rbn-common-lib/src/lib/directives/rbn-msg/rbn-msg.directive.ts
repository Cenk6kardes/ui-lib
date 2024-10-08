import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { ScreenReaderService } from '../../services/screen-reader.service';
import { WcagService } from '../../services/wcag.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rbn-msg]'
})

export class RbnMsgDirective implements AfterViewInit, OnDestroy {
  @Input() for = '';
  hasError = true;

  constructor(
    private el: ElementRef,
    private screenReaderService: ScreenReaderService,
    private wcagService: WcagService) {
  }

  ngOnDestroy(): void {
    this.hasError = false;
  }

  ngAfterViewInit() {
    const msg = this.el.nativeElement?.innerText;
    if (this.for) {
      let forEle = this.el.nativeElement?.ownerDocument?.getElementById(this.for);
      forEle = this.wcagService.getFocusableElm(forEle);
      forEle?.addEventListener('focus', () => {
        if (this.hasError) {
          this.screenReaderService.announce(forEle, msg);
        }
      });
      this.screenReaderService.announce(forEle, msg);
    } else {
      this.screenReaderService.announceWithCount(msg);
    }
  }
}
