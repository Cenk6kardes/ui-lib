import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ISearchGlobal } from '../../../models/common-table';
import { ISearchList } from '../../../models/pagetop';

@Component({
  selector: 'rbn-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.scss']
})

export class SearchGlobalComponent {

  isActive = false;
  @Input() onClickSearch?: any;
  @Input() searchConfig: ISearchGlobal = {
    searchData: ''
  };
  @Input() hasSearchOverLay = false;
  @Input() searchList: ISearchList[];

  @Output() inputValueEvent = new EventEmitter;
  @Output() clearBtnEvent = new EventEmitter;
  @Output() pressEnterEvent = new EventEmitter;
  @Output() selectSearchItemEvent = new EventEmitter;

  @ViewChild('searchInput', { read: ElementRef }) searchInputEl: ElementRef;
  @ViewChild('searchOverLay', { read: OverlayPanel }) searchOverLayEl: OverlayPanel;

  noResultText = '';

  constructor(private translate: TranslateService) {
    this.translate.get('COMMON.NO_RESULTS_WERE_FOUND').subscribe((res: string) => {
      this.noResultText = res;
    });
  }
  activeInput() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.searchInputEl.nativeElement.focus();
    }
  }

  enterValue() {
    if (this.hasSearchOverLay) {
      this.searchOverLayEl.hide();
    }
    this.inputValueEvent.emit({ searchData: this.searchConfig.searchData });
  }

  clearSearchGlobal() {
    if (this.isActive) {
      this.searchInputEl.nativeElement.focus();
    }
    this.clearBtnEvent.emit();
    if (this.hasSearchOverLay) {
      this.searchList = [];
    }
  }

  pressEnterEv(event: any) {
    if (event && event.key === 'Enter' && event.keyCode === 13) {
      this.pressEnterEvent.emit(true);
      if (this.hasSearchOverLay && this.searchConfig.searchData?.trim() !== '') {
        this.searchOverLayEl.show(event);
      }
    }
  }

  onSelectSearchItem(item: ISearchList, event?: KeyboardEvent): void {
    if (event && event.key !== 'Enter') {
      return;
    }
    if (this.searchConfig.searchData) {
      this.searchConfig.searchData = item.title;
    };
    if (this.isActive) {
      this.searchInputEl.nativeElement.focus();
    }
    this.selectSearchItemEvent.emit(item);
    this.searchOverLayEl.hide();
  }

  getContent(text?: string) {
    if (this.searchConfig?.searchData) {
      if (text) {
        return text.replace(new RegExp(this.searchConfig.searchData, 'gi'), (str) => '<span class="highlight">' + str + '</span>');
      } else {
        return this.noResultText.replace('{0}', `<strong>${this.searchConfig.searchData}<strong>`);
      }
    }
  }
}
