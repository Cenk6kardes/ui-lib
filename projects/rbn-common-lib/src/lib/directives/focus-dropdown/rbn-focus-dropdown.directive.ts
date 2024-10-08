import { AfterViewInit, Directive, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DomHandler } from 'primeng/dom';
import { Dropdown } from 'primeng/dropdown';

import { KeyCode, Keydown, KeyEvent } from '../../models/keyboard';
import { ActiveElementHandler } from '../../shared/active-element-handler';
import { WcagService } from '../../services/wcag.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-dropdown:not([rbnFocusDropdownTemplate])'
})
export class RbnFocusDropdownDirective implements AfterViewInit {
  stopEscAccessibleViewChild = false;
  translateResults: any = {};
  isListenTabKey = true;


  constructor(
    public dropdown: Dropdown,
    private renderer: Renderer2,
    private translate: TranslateService,
    private wcagService: WcagService) {
    this.translate.get('COMMON').subscribe(result => {
      this.translateResults = result || {};
    });
  }

  ngAfterViewInit(): void {
    const dropdownEle = this.dropdown.el?.nativeElement;
    if (dropdownEle && !dropdownEle.getAttribute('role')) {
      dropdownEle.setAttribute('role', 'combobox');
    }
    const input = this.dropdown.accessibleViewChild?.nativeElement;
    if (input) {
      this.renderer.listen(input, Keydown.Escape, (e) => {
        if (this.stopEscAccessibleViewChild) {
          e.stopPropagation();
          this.stopEscAccessibleViewChild = false;
        }
      });
      this.renderer.listen(input, 'focus', () => {
        this.handleOnChange();
      });
    }
    this.dropdown.onChange.subscribe(() => {
      this.handleOnChange();
    });
    this.wcagService.announceResultOnFilter(this.dropdown);
  }

  @HostListener('onShow')
  handleOnShow() {
    const accessibleChild = this.dropdown.accessibleViewChild.nativeElement;
    ActiveElementHandler.pushActiveElement(accessibleChild);
    this.stopEscAccessibleViewChild = true;
    this.isListenTabKey = true;
    if (this.dropdown.appendTo === 'body') {
      const selectedItem = DomHandler.findSingle(this.dropdown?.overlayViewChild?.overlayViewChild?.nativeElement, 'li.p-highlight');
      if (selectedItem) {
        selectedItem.scrollIntoView(false);
      }
    }

    const selectorEl = this.dropdown.filter ? this.dropdown?.overlayViewChild?.contentViewChild?.nativeElement : accessibleChild;
    this.renderer.listen(selectorEl, KeyEvent.keydown, (e) => {
      switch (e.key) {
        case KeyCode.Escape:
        case KeyCode.Enter:
          {
            this.focus();
            e.stopPropagation();
            this.stopEscAccessibleViewChild = false;
          }
          break;
        case KeyCode.Tab:
          {
            if (this.isListenTabKey) {
              e.preventDefault();
              setTimeout(() => {
                this.focus();
              });
            }
          }
          break;
        case KeyCode.ArrowDown:
        case KeyCode.ArrowUp:
          // eslint-disable-next-line max-len
          const itemsWrapper = DomHandler.findSingle(this.dropdown.overlayViewChild.overlayViewChild?.nativeElement, '.p-dropdown-items-wrapper');
          const changedItem = DomHandler.findSingle(this.dropdown.overlayViewChild.overlayViewChild?.nativeElement, 'li.p-highlight');
          if (changedItem) {
            DomHandler.scrollInView(itemsWrapper, changedItem);
          }
        default:
          break;
      }
    });
    const filterElm = this.dropdown.filterViewChild?.nativeElement;
    if (filterElm) {
      filterElm.ariaLabel = this.translateResults.SEARCH_FILTER?.replace('{0}', '') || '';
    }

  }

  @HostListener('onHide')
  handleOnHide() {
    ActiveElementHandler.clearOldActiveElementsWithCondition();
    // add setTimeout to handle after listening for keydown event
    setTimeout(() => {
      this.isListenTabKey = false;
    });
  }

  handleOnChange(dropdownElm?: any, selectedIndex?: number, allItemsSizeLength?: number) {
    setTimeout(() => {
      if (!dropdownElm) {
        dropdownElm = this.dropdown.el.nativeElement;
      }
      const selectedOption = this.dropdown.selectedOption;
      if (selectedIndex === undefined && selectedOption) {
        const optionLabel = this.dropdown.optionLabel || 'label';
        selectedIndex = this.dropdown?.optionsToDisplay?.findIndex(item => selectedOption[optionLabel] === item[optionLabel]);
      }
      if (allItemsSizeLength === undefined) {
        allItemsSizeLength = this.dropdown.optionsToDisplay?.length;
      }
      const selectedLabel = dropdownElm.querySelector('.p-dropdown-label')?.textContent;
      const input = dropdownElm.querySelector('.p-hidden-accessible input');
      if (input) {
        input.setAttribute('aria-activedescendant', 'p-highlighted-option');
        if (selectedIndex === undefined) {
          selectedIndex = -1;
        }
        // eslint-disable-next-line max-len
        input.ariaDescription = this.translateResults.ITEM_OF_TOTAL?.replace('{0}', selectedLabel || '')?.replace('{1}', selectedIndex + 1)?.replace('{2}', allItemsSizeLength || 0);
        if (!this.dropdown.overlayVisible) {
          input.removeAttribute('readonly');
        }
      }
    });
  }

  focus() {
    ActiveElementHandler.focusValuableOldActiveElements();
  }
}
