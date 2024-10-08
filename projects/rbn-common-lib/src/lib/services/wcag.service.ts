import { Injectable } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TranslateService } from '@ngx-translate/core';

import { DomHandler } from 'primeng/dom';
import { Dropdown } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';

import { KeyCode, KeyEvent } from '../models/keyboard';
@Injectable({
  providedIn: 'root'
})
export class WcagService {
  handleEvent = false;
  trans: any = {};

  constructor(private translate: TranslateService, private liveAnnouncer: LiveAnnouncer) {
    this.translate.get('COMMON').subscribe(result => {
      this.trans = result || {};
    });
  }

  setClickForElement(listEl: HTMLElement[], isUseKeySpace = true, isUseKeyEnter = true): void {
    if (listEl && listEl.length > 0) {
      listEl.forEach((el: HTMLElement) => {
        el.addEventListener(KeyEvent.keydown, this.handleKeyDown);
        el.addEventListener(KeyEvent.keyup, this.handleKeyUp);
        el['isUseKeyEnter'] = isUseKeyEnter;
        el['isUseKeySpace'] = isUseKeySpace;
      });
    }
  }

  handleKeyDown(event) {
    if (event) {
      if (event.currentTarget !== event.target) {
        return;
      }

      const keyenter = event.currentTarget.isUseKeyEnter;
      const keyspace = event.currentTarget.isUseKeySpace;
      if ((event.code === KeyCode.Enter && keyenter) || (event.code === KeyCode.Space && keyspace)) {
        if (!this.handleEvent) {
          this.handleEvent = true;
          event.target.click();
          event.preventDefault();
        }
      }
    }
  }

  handleKeyUp() {
    this.handleEvent = false;
  }

  setLoopFocus(el: HTMLElement, isFocusToFirstElement = true) {
    const focusableElements = DomHandler.getFocusableElements(el);
    if (focusableElements && focusableElements.length > 0) {
      if (isFocusToFirstElement) {
        focusableElements[0].focus();
      }
      el.addEventListener(KeyEvent.keydown, (event: KeyboardEvent) => {
        if (event.shiftKey && event.code === KeyCode.Tab) {
          const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
          if (focusedIndex === 0) {
            event.preventDefault();
            event.stopPropagation();
            focusableElements[focusableElements.length - 1].focus();
          }
        } else if (event.code === KeyCode.Tab) {
          const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
          if (focusedIndex === focusableElements.length - 1) {
            event.preventDefault();
            event.stopPropagation();
            focusableElements[0].focus();
          }
        }
      });
    }
  }

  getFocusableElm(elm: HTMLElement): HTMLElement {
    // TODO: need to find the way to define focusOnInputElmTags as an optional instead hardcode
    const focusOnInputElmTags = [
      'p-dropdown',
      'p-inputswitch',
      'p-multiselect',
      'p-calendar',
      'p-password',
      'protect-dropdown-add',
      'p-checkbox',
      'p-radioButton'
    ];
    if (elm) {
      const tagNameElm = elm?.tagName?.toLowerCase();
      if (focusOnInputElmTags.includes(tagNameElm)) {
        return elm.querySelector('input');
      } else if (tagNameElm === 'rbn-file-upload' || tagNameElm === 'p-fileupload') {
        return elm.querySelector('.p-button');
      }
    }
    return elm;
  }

  getFieldName(field: any): string {
    let fieldName = '';
    if (!field) {
      fieldName = this.trans.FIELD_LABEL;
    } else if (field.labels?.length > 0) {
      const label = field.labels[0].innerText;
      fieldName = label.trim().split(':')[0];
    } else {
      fieldName = field.ariaLabel || field.placeholder || this.trans.FIELD_LABEL;
    }
    return fieldName;
  }

  announceResultOnFilter(element: Dropdown | MultiSelect): void {
    element.onFilter?.subscribe(() => {
      let filterInputElm;
      let filterLength;
      if (element instanceof (Dropdown)) {
        filterInputElm = element.filterViewChild?.nativeElement;
        filterLength = element.optionsToDisplay?.length;
      } else {
        // instanceof MultiSelect
        filterInputElm = element.filterInputChild?.nativeElement;
        filterLength = element._filteredOptions?.length;
      }
      let msg = '';
      if (filterInputElm) {
        const allItemsLength = element.options?.length;
        if (!element.filterValue?.trim() && allItemsLength) {
          // filter input empty
          msg = this.getShowingRecordsTraslate(allItemsLength)?.replace('{0}', allItemsLength);
        } else if (filterLength) {
          msg = this.getShowingRecordsTraslate(filterLength)?.replace('{0}', filterLength);
        } else {
          msg = element.emptyMessageLabel || this.trans.NO_RECORDS;
        }
      }
      if (msg) {
        this.liveAnnouncer.announce(msg);
      }
    });
  }

  getShowingRecordsTraslate(length: number) {
    return length > 1 ? this.trans.SHOWING_RECORDS_NO_PAGING : this.trans.SHOWING_RECORD_NO_PAGING;
  }
}
