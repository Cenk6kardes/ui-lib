import { Directive, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';

import { Keydown } from '../../models/keyboard';
import { ActiveElementHandler } from '../../shared/active-element-handler';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-dialog'
})
export class RbnFocusDialogDirective implements OnDestroy {
  @Input() isFocusToOldElmOnHide = true;
  isShownDialog = false;
  closeAriaLabel = '';
  iconMaximizeLabel = '';
  iconMinimizeLabel = '';

  constructor(
    private dialog: Dialog,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.translate.get('COMMON').subscribe(trans => {
      this.closeAriaLabel = trans.CLOSE;
      this.iconMaximizeLabel = trans.MAXIMIZE_WINDOW;
      this.iconMinimizeLabel = trans.MINIMIZE_WINDOW;
    });
  }

  @HostListener('onShow')
  handleOnShow() {
    const dialogEl = this.dialog.wrapper as any;
    if (!dialogEl) {
      return;
    }

    this.dialog.closeAriaLabel = this.closeAriaLabel;
    const iconButtonMaximizeEl = dialogEl.querySelector('.p-dialog-header-maximize');
    if (iconButtonMaximizeEl) {
      this.addAriaLabelForIconButtonMaximize(dialogEl, iconButtonMaximizeEl);
      this.renderer.listen(iconButtonMaximizeEl, 'click', () => {
        this.addAriaLabelForIconButtonMaximize(dialogEl, iconButtonMaximizeEl);
      });
    }

    this.replaceDialogTitleTag();
    this.createScrollDialogContent(dialogEl);
    this.isShownDialog = true;
    const tempActiveEl = document.activeElement as HTMLElement;
    ActiveElementHandler.pushActiveElement(tempActiveEl);
    const headerBtn = dialogEl.querySelectorAll('.p-dialog-header-icons button') || [];
    for (let i = 0; i < headerBtn.length; i++) {
      headerBtn[i].setAttribute('tabindex', 0);
    }
    const autoFocusEl = dialogEl.querySelector('[autofocus]');
    if (!autoFocusEl) {
      const focussableElements = [
        'a:not([disabled]):not([tabindex="-1"])',
        'button:not([disabled]):not([tabindex="-1"])',
        'input:not([disabled]):not([tabindex="-1"])',
        'select:not([disabled]):not([tabindex="-1"])',
        '[tabindex]:not([disabled]):not([tabindex="-1"])'
      ].join(',');
      dialogEl.querySelector(focussableElements).focus();
    }

    this.renderer.listen(dialogEl, Keydown.Escape, (e) => {
      if (this.dialog.closeOnEscape && this.dialog.closable && this.dialog.visible) {
        this.dialog.close(e);
      }
    });
  }
  createScrollDialogContent(dialogEl: HTMLElement): void {
    const dialogContentEl = dialogEl.querySelector('.p-dialog-content') as HTMLElement;
    const dialogHeaderEl = dialogEl.querySelector('.p-dialog-header') as HTMLElement;
    if (dialogContentEl && dialogHeaderEl) {
      this.renderer.listen(dialogHeaderEl, 'keydown.ArrowDown', () => {
        dialogContentEl.scrollTo({ top: dialogContentEl.scrollTop + 50 });
      });
      this.renderer.listen(dialogHeaderEl, 'keydown.ArrowUp', () => {
        dialogContentEl.scrollTo({ top: dialogContentEl.scrollTop - 50 });
      });
    }
  }

  @HostListener('onHide')
  handleOnHide() {
    this.focusAccessibleElement();
    ActiveElementHandler.clearOldActiveElementsWithCondition();
  }

  ngOnDestroy() {
    this.focusAccessibleElement();
  }

  focusAccessibleElement() {
    if (this.isShownDialog && this.isFocusToOldElmOnHide) {
      ActiveElementHandler.focusValuableOldActiveElements();
      this.isShownDialog = false;
    }
  }

  replaceDialogTitleTag() {
    const title = this.dialog.headerViewChild?.nativeElement.querySelector('.p-dialog-title');
    if (title) {
      const newTitle = document.createElement('h2');
      newTitle.innerHTML = title.innerHTML;
      newTitle.setAttribute('class', title.getAttribute('class'));
      newTitle.setAttribute('id', title.getAttribute('id'));
      title.parentNode.replaceChild(newTitle, title);
    }
  }

  // prevent focus to outside, duplicate Tab and close when this dialog is inside another dialog
  @HostListener(Keydown.Tab, ['$event'])
  @HostListener(Keydown.Shift.Tab, ['$event'])
  @HostListener(Keydown.Escape, ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    e.stopPropagation();
  }

  addAriaLabelForIconButtonMaximize(dialogEl: HTMLElement, iconButtonMaximizeEl: HTMLElement): void {
    setTimeout(() => {
      if (dialogEl?.querySelector('.p-dialog-header-maximize span.pi-window-maximize')) {
        iconButtonMaximizeEl.ariaLabel = this.iconMaximizeLabel;
      } else if (dialogEl?.querySelector('.p-dialog-header-maximize span.pi-window-minimize')) {
        iconButtonMaximizeEl.ariaLabel = this.iconMinimizeLabel;
      }
    }, 100);
  }
}
