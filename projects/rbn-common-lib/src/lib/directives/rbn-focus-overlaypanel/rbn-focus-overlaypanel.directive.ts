import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomHandler } from 'primeng/dom';

import { OverlayPanel } from 'primeng/overlaypanel';

import { Keydown } from '../../models/keyboard';
import { WcagService } from '../../services/wcag.service';
import { ActiveElementHandler } from '../../shared/active-element-handler';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-overlayPanel'
})
export class RbnFocusOverlayPanelDirective {
  @Input() isFocusToFirstElement = true;

  constructor(private overlayPanel: OverlayPanel, private renderer: Renderer2, private wcagService: WcagService) {
  }

  @HostListener('onShow')
  onShowOverlayPanel() {
    const tempActiveEl: HTMLElement = document.activeElement as HTMLElement;
    ActiveElementHandler.pushActiveElement(tempActiveEl);
    const containerOverlay = this.overlayPanel.container;
    setTimeout(() => {
      this.wcagService.setLoopFocus(containerOverlay, this.isFocusToFirstElement);
    });
    const focusableElements = DomHandler.getFocusableElements(containerOverlay);
    if (focusableElements && focusableElements.length === 0) {
      tempActiveEl['allowHideOverlayPanel'] = true;
      this.renderer.listen(tempActiveEl, 'focusout', () => {
        if (tempActiveEl['allowHideOverlayPanel']) {
          this.overlayPanel.hide();
        }
      });
    } else {
      tempActiveEl['allowHideOverlayPanel'] = false;
    }

    this.renderer.listen(containerOverlay, Keydown.Escape, () => {
      this.overlayPanel.hide();
      ActiveElementHandler.focusValuableOldActiveElements();
    });
  }

  @HostListener('onHide')
  onHideOverlayPanel() {
    ActiveElementHandler.clearOldActiveElementsWithCondition();
  }
}

