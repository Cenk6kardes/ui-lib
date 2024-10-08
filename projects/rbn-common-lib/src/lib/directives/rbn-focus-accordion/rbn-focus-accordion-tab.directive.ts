import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { AccordionTab } from 'primeng/accordion';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-accordionTab'
})
export class RbnFocusAccordionTabDirective implements AfterViewInit, OnChanges {
  @Input() public selected: boolean;

  constructor(
    private accordionElRef: ElementRef,
    private accordionTabEl: AccordionTab) {
  }
  ngAfterViewInit(): void {
    this.setStyleContentTab();
    this.accordionTabEl.selectedChange.subscribe(() => {
      this.setStyleContentTab();
    });
  }

  ngOnChanges(): void {
    this.setStyleContentTab();
  }

  setStyleContentTab() {
    const contentTab = this.accordionElRef.nativeElement.querySelector('.p-toggleable-content');
    if (!contentTab) {
      return;
    }

    if (this.accordionTabEl.selected) {
      contentTab.style.visibility = null;
    } else {
      contentTab.style.visibility = 'hidden';
    }
  }
}
