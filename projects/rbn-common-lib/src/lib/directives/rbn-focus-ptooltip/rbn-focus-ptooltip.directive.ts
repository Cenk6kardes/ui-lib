import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[pTooltip]'
})
export class PTooltipDirective implements AfterViewInit, OnChanges {
  @Input('pTooltip') tooltipText: string;
  toolTipElm: HTMLElement;
  specificTags = ['P-DROPDOWN', 'P-INPUTSWITCH', 'P-MULTISELECT'];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tooltipText && changes.tooltipText.currentValue) {
      this.handleAddAriaLabel();
    }
  }

  @HostListener('focus')
  onFocus() {
    this.toolTipElm.dispatchEvent(new MouseEvent('mouseenter'));
  }

  @HostListener('focusout')
  onFocusOut() {
    this.toolTipElm.dispatchEvent(new MouseEvent('mouseleave'));
  }

  ngAfterViewInit(): void {
    this.toolTipElm = this.el.nativeElement;

    if (this.specificTags.includes(this.toolTipElm.tagName)) {
      const innerInputElm = this.toolTipElm.querySelector('input');
      if (innerInputElm) {
        this.renderer.listen(innerInputElm, 'focus', () => this.onFocus());
        this.renderer.listen(innerInputElm, 'focusout', () => this.onFocusOut());
      }
    } else {
      this.renderer.setAttribute(this.toolTipElm, 'tabIndex', '0');
    }
  }

  handleAddAriaLabel() {
    const element = this.el.nativeElement;
    if (this.specificTags.includes(element.tagName)) {
      const innerInputElm = element.querySelector('input');
      if (innerInputElm) {
        innerInputElm.ariaLabel = this.tooltipText;
      }
    } else {
      element.ariaLabel = this.tooltipText;
    }
  }
}
