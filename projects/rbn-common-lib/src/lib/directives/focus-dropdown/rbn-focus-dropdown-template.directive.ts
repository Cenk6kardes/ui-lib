import { AfterViewInit, Directive, HostListener, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Dropdown } from 'primeng/dropdown';
import { DomHandler } from 'primeng/dom';

import { WcagService } from '../../services/wcag.service';
import { KeyCode, Keydown, KeyEvent } from '../../models/keyboard';
import { ActiveElementHandler } from '../../shared/active-element-handler';
import { RbnFocusDropdownDirective } from './rbn-focus-dropdown.directive';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'p-dropdown[rbnFocusDropdownTemplate]'
})
export class RbnFocusDropdownTemplateDirective implements OnInit, AfterViewInit {
  originReadonly: boolean;
  translateResults: any = {};
  listenerClickDropdownContainer: () => void;
  stopEscAccessibleViewChild = false;

  constructor(
    private dropdown: Dropdown,
    private renderer: Renderer2,
    private translate: TranslateService,
    private wcagService: WcagService,
    private rbnFocusDropdownDirective: RbnFocusDropdownDirective) {
    this.translate.get('COMMON').subscribe(res => {
      this.translateResults = res;
    });
  }

  ngOnInit(): void {
    this.originReadonly = this.dropdown.readonly;
  }

  ngAfterViewInit(): void {
    const input = this.dropdown.accessibleViewChild?.nativeElement;
    if (input) {
      this.renderer.listen(input, Keydown.Escape, (e) => {
        if (this.stopEscAccessibleViewChild) {
          this.dropdown.hide();
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

  handleOnChange() {
    this.rbnFocusDropdownDirective.dropdown = this.dropdown;
    this.rbnFocusDropdownDirective.handleOnChange();
  }

  @HostListener('onShow')
  handleOnShow() {
    ActiveElementHandler.pushActiveElement(this.dropdown.accessibleViewChild.nativeElement);
    this.dropdown.readonly = true;
    this.stopEscAccessibleViewChild = true;
    const itemsEl = this.dropdown.overlayViewChild.contentViewChild?.nativeElement.querySelectorAll('.p-dropdown-item') as any || [];
    const overlay = this.dropdown.overlayViewChild.contentViewChild?.nativeElement;
    const dropdownContainer = this.dropdown.el.nativeElement.querySelector('.p-dropdown');

    for (let i = 0; i < itemsEl.length; i++) {
      itemsEl[i].setAttribute('tabindex', '0');
    }
    const focusableElements = DomHandler.getFocusableElements(overlay);
    this.wcagService.setClickForElement(focusableElements, false);
    this.wcagService.setLoopFocus(overlay);

    this.listenerClickDropdownContainer = this.renderer.listen(dropdownContainer, 'click', (e) => {
      if (this.dropdown.overlayViewChild) {
        this.dropdown.onClick.emit(e);
        this.dropdown.hide();
        this.focus();
      }
    });

    this.renderer.listen(overlay, KeyEvent.keydown, (e) => {
      switch (e.key) {
        case KeyCode.ArrowDown:
        case KeyCode.ArrowUp:
          {
            this.dropdown.readonly = false;
            this.dropdown.onKeydown(e, false);
            this.dropdown.readonly = true;
            setTimeout(() => {
              this.focusHighlightItem();
            });
          }
          break;
        case KeyCode.Escape:
          {
            this.dropdown.hide();
            this.focus();
            e.stopPropagation();
            this.stopEscAccessibleViewChild = false;
          }
          break;
        default:
          break;
      }
    });
    this.focusHighlightItem();
    const filterElm = this.dropdown.filterViewChild?.nativeElement;
    if (filterElm) {
      filterElm.ariaLabel = this.translateResults.SEARCH_FILTER?.replace('{0}', '') || '';
    }
  }

  @HostListener('onHide')
  handleOnHide() {
    this.dropdown.readonly = this.originReadonly;
    if (this.listenerClickDropdownContainer) {
      this.listenerClickDropdownContainer();
    }
    ActiveElementHandler.clearOldActiveElementsWithCondition();
  }

  focus() {
    ActiveElementHandler.focusValuableOldActiveElements();
  }

  focusHighlightItem() {
    const itemEl
      = this.dropdown.overlayViewChild.contentViewChild?.nativeElement.querySelector('.p-dropdown-item.p-highlight') as HTMLElement;
    if (itemEl) {
      itemEl.focus();
    }
  }
}
