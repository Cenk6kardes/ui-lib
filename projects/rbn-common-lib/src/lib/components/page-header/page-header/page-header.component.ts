import { Component, Input, EventEmitter, ViewChild, Output, OnChanges, AfterViewInit, ElementRef, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { IPageHeader } from '../../../models/common-table';
import { Tag, TagType } from '../../../models/sidebar';
import { SidebarService } from '../../sidebar/sidebar/sidebar-service/sidebar.service';

@Component({
  selector: 'rbn-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnChanges, AfterViewInit {
  @Input() data: IPageHeader = null;
  @Input() pageHeaderName = '';
  @Input() dropdownValue = '';

  @Output() backButtonAction = new EventEmitter();
  @Output() selectedMenuItem = new EventEmitter();
  @Output() selectedDropItem = new EventEmitter();

  @ViewChild('op', { static: false }) overlayPanel: OverlayPanel;

  menuItems: MenuItem[] = [];
  isShowTag = false;
  tagType = TagType;
  tag: Tag;

  constructor(private sidebarService: SidebarService, private el: ElementRef) {
    this.sidebarService.tag.subscribe((rs: Tag) => {
      this.tag = rs;
      if (this.data && this.data.title) {
        this.checkExpiryTag();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && this.data.title) {
      this.unFocusableTerminalBreadcrumb();
    }
    if (changes.data?.currentValue?.breadcrumb) {
      this.removeSeparatedChevronsRole();
    }
  }

  ngAfterViewInit(): void {
    this.unFocusableTerminalBreadcrumb();
  }

  /**
   * Set tabIndex = -1 to remove focusable
   * This is not a clickable item and therefore should not have a focus style.
   */
  unFocusableTerminalBreadcrumb() {
    // Check for the final ("terminal") breadcrumb. (the page that is currently displayed)
    const terminalBreadcrumb = this.el.nativeElement.querySelector('.p-breadcrumb ul li:last-child a');
    if (terminalBreadcrumb) {
      terminalBreadcrumb.setAttribute('tabIndex', -1);
    }
  }

  // remove the incorrect role of < li > 's separated chevrons icon inner the breadcrumb list
  removeSeparatedChevronsRole(): void {
    const separatedChevrons = this.el.nativeElement?.querySelectorAll('.p-breadcrumb-chevron.pi-chevron-right') || [];
    separatedChevrons.forEach(chevron => {
      chevron.setAttribute('role', 'none');
    });
  }

  onBack = () => {
    this.backButtonAction.emit();
  };

  onClickSelectedMenuItem(event) {
    this.selectedMenuItem.emit(event.option);
    this.overlayPanel.hide();
  }

  onDropdownChange(event) {
    this.selectedDropItem.emit(event.value);
  }

  getTagData(): any {
    const tagData = {
      label: (this.tag.label ? this.tag.label : this.tag.type).toLowerCase(),
      color: this.tag.color ? this.tag.color : ''
    };
    return tagData;
  }

  existedExpiryTag(showedTag: string): boolean {
    return !showedTag.split(',').find(data => data === this.data.title) ? false : true;
  }

  checkExpiryTag(): void {
    const showedTag = document.cookie.match('(^|;)\\s*ExpiredTag\\s*=\\s*([^;]+)')?.pop() || '';
    const dataTitle = this.data.title ? this.data.title.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') : '';
    const checkExpiryTime = document.cookie.match('(^|;)\\s*' + dataTitle + '\\s*=\\s*([^;]+)')?.pop() || '';

    if (!this.existedExpiryTag(showedTag)) {
      this.isShowTag = true;
    } else if (this.existedExpiryTag(showedTag) && checkExpiryTime !== '') {
      this.isShowTag = true;
    } else {
      this.isShowTag = false;
    }
  }

  isArray(data: any) {
    return Array.isArray(data);
  }

  getIdTopButton(index?: number) {
    let tempId = this.pageHeaderName ? this.pageHeaderName + 'TopButton' : 'topButton';
    if (index) {
      tempId = tempId + index;
    }
    return tempId;
  }
}
