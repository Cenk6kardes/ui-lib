import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { SplitButton } from 'primeng/splitbutton';

import { Keydown, KeyCode, KeyEvent } from '../../models/keyboard';
import { WcagService } from '../../services/wcag.service';
import { ActiveElementHandler } from '../../shared/active-element-handler';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-splitButton'
})
export class RbnFocusSplitButtonDirective implements AfterViewInit {

  constructor(private splitbutton: SplitButton, private renderer: Renderer2,
    private wcagService: WcagService, private elRef: ElementRef) { }

  ngAfterViewInit(): void {
    const menu = this.splitbutton?.menu;
    if (menu) {
      menu.onShow?.subscribe(() => {
        setTimeout(() => {
          const tempActiveEl = document.activeElement as HTMLElement;
          ActiveElementHandler.pushActiveElement(tempActiveEl);
          const element = menu.container;
          this.wcagService.setLoopFocus(element);
          this.renderer.listen(element, Keydown.Escape, (event) => {
            event.stopPropagation();
            menu.hide();
            ActiveElementHandler.focusValuableOldActiveElements();
          });

          this.renderer.listen(element, KeyEvent.keydown, (e) => {
            if (e.code === KeyCode.Enter || e.code === KeyCode.Space) {
              if (!menu.visible) {
                ActiveElementHandler.focusValuableOldActiveElements();
              }
            }
          });

          const focusableElements = DomHandler.getFocusableElements(element);
          // Click elements in popup menu
          if (focusableElements && focusableElements.length > 0) {
            this.wcagService.setClickForElement(focusableElements);
          }
        });
      });

      menu.onHide?.subscribe(() => {
        ActiveElementHandler.clearOldActiveElementsWithCondition();
      });
    }

    const defaultbuttonAttribute = this.elRef.nativeElement.getAttribute('no-defaultbutton');
    if (defaultbuttonAttribute !== null) {
      const iconMenu = 'button.p-splitbutton-menubutton span.p-button-icon';
      const iconMenubutton = this.elRef.nativeElement.querySelector(iconMenu);
      const iconDefaul = 'button.p-splitbutton-defaultbutton span.p-button-icon';
      const iconDefaultbutton = this.elRef.nativeElement.querySelector(iconDefaul);
      const defaultbutton = this.elRef.nativeElement.querySelector('button.p-splitbutton-defaultbutton');
      if (defaultbutton && iconMenubutton && iconDefaultbutton) {
        defaultbutton.style = 'visibility:hidden';
        iconMenubutton.setAttribute('class', iconDefaultbutton.getAttribute('class'));
      }
    }
  }
}
