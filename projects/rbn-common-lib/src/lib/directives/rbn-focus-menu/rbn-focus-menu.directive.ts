import { AfterViewInit, Directive, HostListener, Renderer2 } from '@angular/core';

import { Menu } from 'primeng/menu';
import { DomHandler } from 'primeng/dom';

import { WcagService } from '../../services/wcag.service';
import { Keydown, Keyup } from '../../models/keyboard';
import { ActiveElementHandler } from '../../shared/active-element-handler';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-menu'
})
export class RbnFocusMenuDirective implements AfterViewInit {

  constructor(private wcagService: WcagService, private el: Menu, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    if (this.el && !this.el.popup) {
      const element = this.el.containerViewChild.nativeElement;
      this.renderer.listen(element, Keyup.Tab, () => {
        const focusableElements = DomHandler.getFocusableElements(element);
        this.wcagService.setClickForElement(focusableElements);
      });
    }
  }

  @HostListener('onShow')
  onShowMenu() {
    ActiveElementHandler.pushActiveElement(document.activeElement);
    const element = this.el.containerViewChild.nativeElement;
    const focusableElements = DomHandler.getFocusableElements(element);
    if (focusableElements && focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
      });
      this.renderer.listen(element, Keydown.Tab, (event) => {
        const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
        if (focusedIndex === focusableElements.length - 1) {
          event.preventDefault();
          focusableElements[0].focus();
        }
      });

      this.renderer.listen(element, Keydown.Shift.Tab, (event) => {
        const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
        if (focusedIndex === 0) {
          event.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      });
    }

    this.renderer.listen(element, Keydown.Escape, () => {
      this.el.hide();
    });

    // Click elements in popup menu
    if (focusableElements) {
      this.wcagService.setClickForElement(focusableElements);
    }
  }

  @HostListener('onHide')
  onHideMenu() {
    ActiveElementHandler.focusValuableOldActiveElements();
    ActiveElementHandler.clearOldActiveElementsWithCondition();
  }
}

