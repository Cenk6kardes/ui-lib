import { AfterViewInit, Directive, Renderer2 } from '@angular/core';
import { TabView } from 'primeng/tabview';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-tabPanel'
})
export class RbnFocusTabviewDirective implements AfterViewInit {

  constructor(private tabView: TabView, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.setVisibleTabPanel(this.tabView.activeIndex);
    this.tabView.activeIndexChange.subscribe(activeIndex => {
      this.setVisibleTabPanel(activeIndex);
    });
    setTimeout(() => {
      this.tabView?.tabs?.forEach((tab, index) => {
        const selector = `li:nth-child(${index + 1}) .p-tabview-nav-link`;
        const tabLinkHeader = this.tabView.el.nativeElement?.querySelector(selector);
        // the aria-selected not reconized undefied
        if (tabLinkHeader) {
          tabLinkHeader.ariaSelected = !!tab.selected;
        }
      });
    });
  }

  setVisibleTabPanel(activeIndex = 0): void {
    const tabs = this.tabView.el?.nativeElement?.querySelectorAll('p-tabpanel') as NodeList;
    if (tabs && tabs.length > 0) {
      tabs.forEach((tab, index) => {
        this.renderer.setStyle(tab, 'visibility', index === activeIndex ? 'visible' : 'hidden');
      });
    }
  }
}
