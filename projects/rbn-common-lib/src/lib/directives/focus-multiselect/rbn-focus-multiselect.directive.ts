import { AfterViewInit, Directive, HostListener, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MultiSelect } from 'primeng/multiselect';
import { DomHandler } from 'primeng/dom';
import { Keydown } from '../../models/keyboard';
import { ActiveElementHandler } from '../../shared/active-element-handler';
import { WcagService } from '../../services/wcag.service';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-multiSelect'
})
export class RbnFocusMultiselectDirective implements OnChanges, AfterViewInit {
  @Input() ariaLabel: string;

  translateResults: any = {};
  stopEscAccessibleViewChild = false;
  // flag to prevent the handleOnPanelHide is not executed
  // when @HostListener('onPanelHide') is fired by p-multiSelect's onDestroy
  hasShowed = false;

  constructor(
    private multiSelectEl: MultiSelect,
    private renderer: Renderer2,
    private translate: TranslateService,
    private wcagService: WcagService) {
    this.translate.get('COMMON').subscribe(result => {
      this.translateResults = result || {};
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ariaLabel?.currentValue) {
      this.addAriaLabel();
    }
  }

  ngAfterViewInit(): void {
    const input = this.multiSelectEl.accessibleViewChild?.nativeElement;
    if (input) {
      this.renderer.listen(input, Keydown.Escape, (e) => {
        if (this.stopEscAccessibleViewChild) {
          e.stopPropagation();
          this.stopEscAccessibleViewChild = false;
        }
      });
      this.renderer.listen(input, 'focus', (e) => {
        const selectedItemsLength = this.multiSelectEl.value?.length || 0;
        const allItemsSizeLength = this.multiSelectEl.options?.length || 0;
        // eslint-disable-next-line max-len
        input.ariaDescription = this.translateResults.SELECTED_ITEM_OF_TOTAL_ITEM?.replace('{0}', selectedItemsLength)?.replace('{1}', allItemsSizeLength) || '';

        input.removeAttribute('aria-haspopup');
      });
      this.renderer.listen(input, Keydown.ArrowDown, () => {
        this.multiSelectEl.show();
      });
    }
    // overwrite func onOptionKeydown from PrimeNg for handle navigate by Tab/ShiftTab
    this.multiSelectEl.onOptionKeydown = e => this.hanldeOptionKeyDown(e);
    this.wcagService.announceResultOnFilter(this.multiSelectEl);
  }

  @HostListener('onPanelShow')
  handleOnPanelShow() {
    ActiveElementHandler.pushActiveElement(this.multiSelectEl.accessibleViewChild.nativeElement);
    this.stopEscAccessibleViewChild = true;
    this.hasShowed = true;
    const element = this.multiSelectEl.overlayViewChild.contentViewChild?.nativeElement;
    // if the elements have attribute disabled = false then it can't focus
    const checkBoxAll = element.querySelector('.p-multiselect-header input[type="checkbox"]') as HTMLElement;
    if (checkBoxAll) {
      this.renderer.listen(checkBoxAll, Keydown.Enter, () => {
        const checkbox = element.querySelector('.p-multiselect-header .p-checkbox-box') as HTMLElement;
        checkbox.click();
      });
      checkBoxAll.ariaLabel = this.translateResults.SELECT_ALL;
    }

    this.renderer.listen(element, Keydown.Tab, (event) => {
      const focusableElements = DomHandler.getFocusableElements(element);
      if (focusableElements.length > 0) {
        const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
        if (focusedIndex === focusableElements.length - 1) {
          event.preventDefault();
          focusableElements[0].focus();
        }
      }
    });

    this.renderer.listen(element, Keydown.Shift.Tab, (event) => {
      const focusableElements = DomHandler.getFocusableElements(element);
      if (focusableElements.length > 0) {
        const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
        if (focusedIndex === 0) {
          event.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      }
    });

    this.renderer.listen(element, Keydown.Escape, (e) => {
      this.focus();
      e.stopPropagation();
      this.stopEscAccessibleViewChild = false;
    });

    const filterInput = this.multiSelectEl.filterInputChild?.nativeElement;
    if (filterInput) {
      filterInput.ariaLabel = this.translateResults.SEARCH_FILTER?.replace('{0}', '') || '';
    }
    this.setSelectedItem();
  }

  @HostListener('onPanelHide')
  handleOnPanelHide() {
    if (this.hasShowed) {
      this.hasShowed = false;
      setTimeout(() => {
        this.stopEscAccessibleViewChild = false;
      });
      ActiveElementHandler.clearOldActiveElementsWithCondition();
    }
  }

  @HostListener('onChange')
  setSelectedItem() {
    const overlay = this.multiSelectEl.overlayViewChild.contentViewChild?.nativeElement;
    const items = overlay?.querySelectorAll('.p-multiselect-item') || [];
    // setTimeout to wait the changing of checkbox class by clicking to determine the the selected items
    setTimeout(() => {
      items.forEach(item => {
        const isSelected = item.querySelector('.pi-check');
        // annnouce selected status on focus
        item.role = 'option';
        item.ariaSelected = !!isSelected;
      });
    }, 0);
  }

  focus() {
    ActiveElementHandler.focusValuableOldActiveElements();
  }

  hanldeOptionKeyDown(e: any) {
    if (this.multiSelectEl.readonly) {
      return;
    }

    const originalEvent = e.originalEvent;
    switch (originalEvent.which) {
      // down
      case 40:
        const nextItem = this.multiSelectEl.findNextItem(originalEvent.target.parentElement);
        if (nextItem) {
          nextItem.focus();
        }
        originalEvent.preventDefault();
        break;
      // up
      case 38:
        const prevItem = this.multiSelectEl.findPrevItem(originalEvent.target.parentElement);
        if (prevItem) {
          prevItem.focus();
        }
        originalEvent.preventDefault();
        break;
      // enter
      case 13:
        this.multiSelectEl.onOptionClick(e);
        originalEvent.preventDefault();
        break;
    }
  }

  addAriaLabel() {
    const input = this.multiSelectEl.el.nativeElement?.querySelector('input');
    if (input) {
      input.ariaLabel = this.ariaLabel;
    }
  }
}
