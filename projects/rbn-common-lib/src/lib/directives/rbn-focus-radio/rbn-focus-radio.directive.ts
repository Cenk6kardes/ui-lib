import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rbn-focus-radio-group]'
})

export class RbnRadioBtnDirective implements AfterViewInit {
  @Input() ariaLabelledby = '';

  constructor(
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    this.el.nativeElement.role = 'radiogroup';
    if (this.ariaLabelledby) {
      this.el.nativeElement.setAttribute('aria-labelledby',this.ariaLabelledby);
    }
  }
}
