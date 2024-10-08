import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { WcagService } from '../../services/wcag.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-panelMenu'
})
export class RbnFocusPanelMenuDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef, private wcagService: WcagService) {
  }

  ngAfterViewInit(): void {
    const panelmenu = this.elementRef.nativeElement.querySelector('.p-panelmenu');
    const focusableElements = DomHandler.getFocusableElements(panelmenu);
    if (focusableElements && focusableElements.length > 0) {
      this.wcagService.setClickForElement(focusableElements, false);
      panelmenu.addEventListener('click', this.handleClick);
      panelmenu.paramPanelMenu = panelmenu;
      panelmenu.wcagService = this.wcagService;
    }
  }

  handleClick(event) {
    const wcagService = event?.currentTarget.wcagService as WcagService;
    const panelmenu = event?.currentTarget.paramPanelMenu as HTMLElement;
    const focusableElements = DomHandler.getFocusableElements(panelmenu);

    if (focusableElements && focusableElements.length > 0) {
      wcagService.setClickForElement(focusableElements, false);
    }
  }
}

