import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { IPageTop, IStatusIndicators, Status } from '../../../models/pagetop';

@Component({
  selector: 'rbn-page-top',
  templateUrl: './page-top.component.html',
  styleUrls: ['./page-top.component.scss']
})
export class PageTopComponent {
  defautIcon = { name: 'fa fa-bars', noneBackground: false };
  @Input() pageTop: IPageTop;
  @Input() customTemplate: TemplateRef<any>;
  @Input() usingNotification = false;
  @Input() statusIndicators: IStatusIndicators[] = [];
  status = Status;

  @Output() inputValueEv = new EventEmitter();
  @Output() pressEnterEvent = new EventEmitter();
  @Output() selectSearchItemEvent = new EventEmitter();

  constructor() { }

  itemClick(item: any) {
    if (item.command) {
      item.command({
        item: item
      });
    }
  }

  inputValueEvent(e) {
    this.inputValueEv.emit(e);
  }

  clearBtnEvent(e) {
    this.pageTop.externalSearch.searchData = '';
    this.inputValueEv.emit({searchData: ''});
  }

  pressEnterEv(e) {
    this.pressEnterEvent.emit(e);
  }
}
