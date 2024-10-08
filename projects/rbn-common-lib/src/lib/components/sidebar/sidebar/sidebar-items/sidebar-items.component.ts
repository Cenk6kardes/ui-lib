import { Component, Input, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { RouteType, TagType } from '../../../../models/sidebar';
import { SidebarService } from '../sidebar-service/sidebar.service';
import { Router } from '@angular/router';
import { WcagService } from '../../../../services/wcag.service';

@Component({
  selector: 'rbn-sidebar-items',
  templateUrl: './sidebar-items.component.html',
  styleUrls: ['../sidebar.component.scss']
})
export class SidebarItemsComponent implements OnInit, AfterViewInit {
  @Input() favorite = false;
  @Input() idWithoutSpace = false;
  @Input() menuItem: any;
  @Input() useFavorites = true;
  @Input() isSearching = false;
  @Input() isConfiguring = false;
  @Input() useConfigurationMode = false;

  @Output() favoriteChanged = new EventEmitter<any>();
  @Output() leafMenuClick = new EventEmitter<any>();
  @Output() noChildren = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();
  @Output() reorder = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDropChild = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDragChild = new EventEmitter<any>();

  isHidden = false;
  isHover = false;
  isFocus = false;
  isChildFocus = false;
  route: any;
  isShowTag = false;
  tagType = TagType;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private elementRef: ElementRef,
    private wcagService: WcagService) { }

  ngAfterViewInit(): void {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.menu-item-container .menu-container');
    if (listItems) {
      this.wcagService.setClickForElement(listItems);
    }
  }

  ngOnInit() {
    if (this.favorite) {
      this.menuItem.isFav = true;
    }
    this.isHover = false;
    if (this.useConfigurationMode) {
      this.getInitialPreferences();
    }
    if (this.menuItem && this.menuItem.tag) {
      this.checkExpiryTag();
    }
  }

  /**
   * Checks to see if any of the children of the menu item are currently being searched
   * @author dwalko
   *
   * @param item - the menu item
   * @returns boolean if the menu contains searched children
   *
   */
  public isChildSearched(item): boolean {
    if (item.children && item.children.some((e) => e.searched === true)) {
      return true;
    }

    let childSearched = false;
    if (item.children) {
      for (let i = 0; i < item.children.length; i++) {
        if (
          item.children[i].children &&
          item.children[i].children.some((e) => e.searched === true)
        ) {
          childSearched = true;
        }
      }

      return childSearched;
    }

    return false;
  }

  createId(title: any, forceNoSpace: boolean = false) {
    if (title && (this.idWithoutSpace || forceNoSpace)) {
      title = title.replace(/[^\w\-]/g, '');
    }
    return title;
  }

  /**
   * Emits events if menu item has no children
   * @author dwalko
   *
   * @param $event - the event
   * @param item - the menu item
   *
  */
  public onNoChildren(event, item): void {
    if (this.menuItem && this.menuItem.tag) {
      this.sidebarService.tag.next(this.menuItem.tag);
    }
    if (!this.isConfiguring) {
      if (item?.routeType !== RouteType.Internal) {
        event.stopPropagation();
      }
      this.router.navigate([this.menuItem?.route?.fullPath]);
      this.leafMenuClick.emit(item);
      this.sidebarService.onNoChildrenClick.next(item);
    }
  }

  hover(bool: boolean) {
    this.isHover = bool;
  }

  focus(bool: boolean, el?: HTMLElement) {
    if (bool) {
      this.isFocus = bool;
    } else {
      setTimeout(() => {
        if (el !== this.elementRef.nativeElement.ownerDocument.activeElement) {
          this.isFocus = bool;
        }
      });
    }
  }

  childFocus(bool: boolean, el?: HTMLElement) {
    if (!bool) {
      setTimeout(() => {
        if (el !== this.elementRef.nativeElement.ownerDocument.activeElement) {
          this.isFocus = bool;
        }
      });
    }
  }

  /**
   * Changes the route depending on if the user is hovering over the favorite button or not
   * @author ezielinska
   *
   * @param val - the route
   */
  link(val: any) {
    this.route = val;
  }

  public onToggleSubMenu($event, item, isArrow?: boolean): boolean {
    const isArrowBtn = $event?.target?.classList?.contains('arrows-btn');
    if ($event.target !== $event.currentTarget && !isArrow && !isArrowBtn) {
      return;
    }

    if (this.isSearching) {
      this.updateShowInSearch(item);
    }

    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }

  private updateShowInSearch(item) {
    if (!item.children) {
      return;
    }

    let showInSearch = null;
    if (item.expanded) {
      showInSearch = true;
    }

    item.children.forEach((child) => {
      child.showInSearch = showInSearch;
    });
  }

  updateFavorites($event, item) {
    if (!$event.pageId) {
      $event.pageId = item.route.fullPath;
    }
    const action = (!item.isFav) ? 'add' : 'delete';
    $event.action = action;

    this.sidebarService.updateFavorites.next({
      pageId: $event.pageId,
      action: $event.action
    });
  }

  /**
   * When the menu item is reorder using the arrows, will emit the reorder event
   * @param obj - The object being emitted
   * @param reorderFav - True if the menu item is in the favorites section
   * @param direction - 'up' or 'down' depending on which arrow was clicked
   * @author rhua
   */
  handleReorder(obj: any, reorderFav?: boolean, direction?: string) {
    if (direction !== undefined) {
      obj = { 'direction': direction, 'menuItem': obj, 'reorderFav': reorderFav };
    }
    this.reorder.emit(obj);
  }

  /**
   * Determines if the menu item is shown or hidden
   * @returns A boolean depending on if the menu item is shown or not
   * @author rhua
   */
  isShown(menuItem): boolean {
    if (this.isHidden === true && this.isConfiguring === false) {
      return false;
    }
    if (this.isSearching) {
      this.updateShowInSearch(menuItem);
      if (menuItem.showInSearch === true) {
        return true;
      }
      if (this.menuItem.searched) {
        return true;
      }
      if (this.isChildSearched(this.menuItem)) {
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * While in configuration mode, the favorites icon is always shown. Otherwise, only shown on hover.
   * @returns A boolean depending on if the favorites icon (i.e. the star) is shown
   * @author rhua
   */
  favIconisShown(): boolean {
    if (this.isConfiguring || this.isHover || this.isFocus) {
      return true;
    }

    return false;
  }

  /**
   * When dragging a menu item, will emit the onDragChild event
   * @param itemDragged - The item being dragged
   * @author rhua
   */
  handleDrag(itemDragged) {
    const sidebarLabel: string = this.menuItem.sidebarLabel;
    let innerText: string = itemDragged.target?.innerText;

    if (innerText !== undefined && innerText.includes('\n')) {
      const index = innerText.indexOf('\n');
      innerText = innerText.slice(0, index);
    }

    if (innerText !== sidebarLabel) {
      this.onDragChild.emit(itemDragged);
      return;
    }

    const nodeArray = itemDragged.path;
    let isFavoritesTab = false;
    for (let i = 0; i < nodeArray.length; i++) {
      if (nodeArray[i].id === 'FavoritesTab') {
        isFavoritesTab = true;
        break;
      }
    }

    const item = {
      fullPath: this.menuItem.fullPath,
      sidebarLabel: this.menuItem.sidebarLabel,
      isFavoritesTab: isFavoritesTab
    };
    this.onDragChild.emit(item);
  }

  /**
   * Determines if the trash icon is visible or not
   * @returns Returns a string to be used for the visibility property
   * @author rhua
   */
  isTrashIconVisible(): string {
    if (this.isConfiguring || this.isHover || this.isFocus) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }

  /**
   * Retrieves the user's preferences for this menu item to determine if it is hidden or not
   * @author rhua
   */
  private getInitialPreferences() {
    const preferences = this.sidebarService.getPreferences();

    if (preferences === undefined || preferences.length === 0) {
      return;
    }

    for (let i = 0; i < preferences.length; i++) {
      if (this.menuItem.path === preferences[i].path) {
        this.isHidden = preferences[i].preferences.isHidden;
        break;
      }
    }
  }

  /**
   * Hides/unhides the menu item and adds the change to temporary preferences
   * @author rhua
   */
  handleHide() {
    this.menuItem.isHidden = !this.isHidden;
    this.isHidden = !this.isHidden;

    const preference = {
      path: this.menuItem.path,
      fullPath: this.menuItem.fullPath,
      preferences: {
        isHidden: this.isHidden
      }
    };

    this.sidebarService.addTempPreference(preference);
  }

  getTagData(): any {
    const tagData = {
      label: (this.menuItem.tag.label ? this.menuItem.tag.label : this.menuItem.tag.type).toLowerCase(),
      color: this.menuItem.tag.color ? this.menuItem.tag.color : ''
    };
    return tagData;
  }

  existedExpiryTag(showedTag: string): boolean {
    return !showedTag.split(',').find(data => data === this.menuItem.data.menu.title) ? false : true;
  }

  setCookieForTag(period: number): void {
    let showedTag = document.cookie.match('(^|;)\\s*ExpiredTag\\s*=\\s*([^;]+)')?.pop() || '';
    const checkExpiryTime = document.cookie.match('(^|;)\\s*' + this.menuItem.data.menu.title + '\\s*=\\s*([^;]+)')?.pop() || '';

    if (!this.existedExpiryTag(showedTag)) {
      showedTag = showedTag !== '' ? showedTag + ',' + this.menuItem.data.menu.title : this.menuItem.data.menu.title;
      document.cookie = 'ExpiredTag=' + showedTag;
      const d: Date = new Date();
      d.setTime(d.getTime() + period * 1000);
      const expires: string = 'expires=' + d.toUTCString();
      document.cookie = this.menuItem.data.menu.title + '=' + period + '; ' + expires + ';path=/';
      this.isShowTag = true;
    } else if (this.existedExpiryTag(showedTag) && checkExpiryTime !== '') {
      this.isShowTag = true;
    } else {
      this.isShowTag = false;
    }
  }

  checkExpiryTag(): void {
    const secondPerWeek = 604800;
    if (!this.menuItem.tag.expiry) {
      this.isShowTag = true;
      if (this.menuItem.tag.type === this.tagType.New) {
        this.setCookieForTag(secondPerWeek);
      }
    } else {
      this.setCookieForTag(this.menuItem.tag.expiry);
    }
  }
}
