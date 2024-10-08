import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PickList } from 'primeng/picklist';
import { WcagService } from '../../services/wcag.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-pickList'
})
export class RbnFocusPickListDirective implements AfterViewInit {
  translateRes: any = {};
  ariaSourceHeader = '';
  ariaTargetHeader = '';

  constructor(
    private pickList: PickList,
    private translate: TranslateService,
    private liveAnnouncer: LiveAnnouncer,
    private wcagService: WcagService) {
    this.translate.get(['PICKLIST', 'COMMON']).subscribe(res => {
      this.translateRes = { ...res.PICKLIST, ...res.COMMON };
      this.ariaSourceHeader = this.translateRes?.SOURCE_COLUMNS;
      this.ariaTargetHeader = this.translateRes?.TARGET_COLUMNS;
    });
  }

  ngAfterViewInit(): void {
    this.addAriaLabelForButton();
    if (this.pickList.sourceHeader) {
      this.ariaSourceHeader = this.pickList.sourceHeader;
    }
    if (this.pickList.targetHeader) {
      this.ariaTargetHeader = this.pickList.targetHeader;
    }
    this.pickList.ariaSourceFilterLabel = this.translateRes?.SEARCH_FILTER?.replace('{0}', this.ariaSourceHeader) || '';
    this.pickList.ariaTargetFilterLabel = this.translateRes?.SEARCH_FILTER?.replace('{0}', this.ariaTargetHeader) || '';
    this.pickList.onMoveAllToTarget.subscribe(e => {
      this.liveAnnouncer.announce(this.getMessage(e));
    });
    this.pickList.onMoveToTarget.subscribe(e => {
      this.liveAnnouncer.announce(this.getMessage(e));
    });
    this.pickList.onMoveToSource.subscribe(e => {
      this.liveAnnouncer.announce(this.getMessage(e, false));
    });
    this.pickList.onMoveAllToSource.subscribe(e => {
      this.liveAnnouncer.announce(this.getMessage(e, false));
    });

    this.pickList.onSourceFilter.subscribe(e => this.announceFilterResult(e));
    this.pickList.onTargetFilter.subscribe(e => this.announceFilterResult(e));
  }

  getMessage(e: { items: any[] }, isLeftToRight = true): string {
    let from: string;
    let to: string;
    let listViewChild: HTMLElement[];

    if (isLeftToRight) {
      from = this.ariaSourceHeader;
      to = this.ariaTargetHeader;
      listViewChild = this.pickList.listViewSourceChild.nativeElement?.querySelectorAll('li') || [];
    } else {
      from = this.ariaTargetHeader;
      to = this.ariaSourceHeader;
      listViewChild = this.pickList.listViewTargetChild.nativeElement?.querySelectorAll('li') || [];
    }
    const itemsLength = e.items?.filter((i, index) => {
      const style = window.getComputedStyle(listViewChild[index]);
      // the customized style for disable items is pointer-events:none/noneuser-select: none
      return style['pointer-events'] !== 'none' && style['user-select'] !== 'none';
    }).length;

    return this.translateRes?.ITEMS_MOVED_FROM_TO?.replace('{0}', itemsLength || 0)?.replace('{1}', from)?.replace('{2}', to) || '';
  }

  addAriaLabelForButton() {
    this.pickList.rightButtonAriaLabel = this.translateRes?.MOVE_RIGHT;
    this.pickList.leftButtonAriaLabel = this.translateRes?.MOVE_LEFT;
    this.pickList.allRightButtonAriaLabel = this.translateRes?.MOVE_ALL_RIGHT;
    this.pickList.allLeftButtonAriaLabel = this.translateRes?.MOVE_ALL_LEFT;
    this.pickList.upButtonAriaLabel = this.translateRes?.MOVE_UP;
    this.pickList.downButtonAriaLabel = this.translateRes?.MOVE_DOWN;
    this.pickList.topButtonAriaLabel = this.translateRes?.MOVE_TOP;
    this.pickList.bottomButtonAriaLabel = this.translateRes?.MOVE_BOTTOM;
  }

  announceFilterResult(e: { query: string, value: any[] }) {
    let msg = '';
    const length = e?.value?.length;
    if (length) {
      msg = this.wcagService.getShowingRecordsTraslate(length)?.replace('{0}', length);
    } else {
      msg = this.translateRes?.NO_RECORDS;
    }
    if (msg) {
      this.liveAnnouncer.announce(msg);
    }
  }
}
