import { Directive, HostListener, OnDestroy } from '@angular/core';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DomHandler } from 'primeng/dom';
import { ActiveElementHandler } from '../../shared/active-element-handler';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-confirmDialog'
})
export class RbnFocusConfirmDialogDirective implements OnDestroy {
  isShownConfirmDialog = false;

  constructor(private confirmDialog: ConfirmDialog, private confirmationService: ConfirmationService) {
    if (this.confirmDialog) {
      this.confirmationService.requireConfirmation$.subscribe((confirmation: Confirmation) => {
        if (confirmation && confirmDialog.visible) {
          this.isShownConfirmDialog = true;
          const parents = DomHandler.getParents(this.confirmDialog.el?.nativeElement);
          if (parents && parents.length > 0) {
            const doc = parents.find(parentEl => parentEl instanceof Document);
            ActiveElementHandler.pushActiveElement(doc?.activeElement);
          }
          setTimeout(() => {
            if (this.confirmDialog.wrapper) {
              const focusableElements = DomHandler.getFocusableElements(this.confirmDialog.wrapper);
              if (focusableElements && focusableElements.length > 0) {
                focusableElements[0].focus();
              }
            }
          });
        }
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
    if (this.isShownConfirmDialog) {
      ActiveElementHandler.focusValuableOldActiveElements();
      this.isShownConfirmDialog = false;
    }
  }
}
