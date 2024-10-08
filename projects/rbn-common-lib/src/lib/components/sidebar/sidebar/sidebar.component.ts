import {
  Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef,
  ElementRef, AfterViewInit, OnDestroy
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';


import { MessageService } from 'primeng/api';

import { SidebarService } from './sidebar-service/sidebar.service';
import { RouteType, SideBar } from '../../../models/sidebar';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { WcagService } from '../../../services/wcag.service';


@Component({
  selector: 'rbn-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() idWithoutSpace = false;
  @Input() favoriteIds: any[] = [];
  @Input() menuItems: SideBar[] = [];
  @Input() useFavorites = true;
  @Input() useSearch = true;
  @Input() useConfigurationMode = false;
  @Input() useLocalStorage = true;
  @Input() preferences: any[] = [];
  @Input() noneUppercaseParentLabel = false;
  @Input() usePathForActiveItem = false;
  @Input() allowSearchTopLevel = false;

  @Output() eventTitleClicked = new EventEmitter<any>();
  @Output() favoriteChanged = new EventEmitter<any>();
  @Output() menuItemClicked = new EventEmitter<any>();
  @Output() noChildClicked = new EventEmitter<any>();
  @Output() configureMode = new EventEmitter<any>();
  @Output() preferencesChanged = new EventEmitter<any>();

  originalMenuItems: any[] = [];
  currentDropTarget: any;
  itemDragged: any = {};

  isConfiguring = false;
  isItemsDisplayed = true;
  isShowCancelDialog = false;
  isShowResetDialog = false;
  private favoritesChanged = false;

  favorites: any[] = [];
  favoriteItem: any[] = [];

  isUserLoggedIn = true;
  hideSidebar = false;
  searchTerm = '';
  messages: any = {};
  onDelAllFavHover = false;
  isDelAllFavFocus = false;
  private minSearchLength = 1;

  isMenuCollapsed = false;
  isSearching = false;

  resWidthCollapseSidebar = 1000;
  countLevelNav = 0;
  bodyElement: any;
  noChildClickSup$: Subscription;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private translate: TranslateService,
    private changeDetector: ChangeDetectorRef,
    private messageService: RbnMessageService,
    private primeNgMessageService: MessageService,
    private elementRef: ElementRef,
    private wcagService: WcagService,
    private liveAnnouncer: LiveAnnouncer
  ) {
    this.translate.get('FAVORITES').subscribe((res: string) => {
      this.messages = res;
    });

    this.sidebarService.updateFavorites.subscribe((res) => {
      if (res) {
        this.updateFavorites(res);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.onloadViewMenu();
    });
    this.bodyElement = document.querySelector('body')?.classList;
  }
  ngAfterViewInit(): void {
    const listItems = this.elementRef.nativeElement.querySelectorAll('span.group-name--link');
    if (listItems) {
      this.wcagService.setClickForElement(listItems);
    }
  }

  onLeafMenuClick(menuItem: any) {
    this.menuItemClicked.emit(menuItem);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.get('FAVORITES').subscribe((rs: string) => {
      this.messages = rs;
      const MENU_FAVORITES: SideBar = {
        path: 'Favorites',
        title: this.messages.FAVORITES,
        children: [],
        sidebarLabel: this.messages.FAVORITES,
        display: this.messages.FAVORITES,
        icon: 'fa fa-star',
        fullPath: 'Favorites',
        route: {
          paths: 'Favorites',
          fullPath: 'Favorites'
        },
        expanded: true
      };
      if (changes.menuItems && changes.menuItems.currentValue) {
        this.sidebarService.convertToSideBarData(changes.menuItems.currentValue).subscribe(res => {
          this.menuItems = [];
          if (this.useFavorites) {
            this.menuItems.push(MENU_FAVORITES);
          }
          this.menuItems = [...this.menuItems, ...res];
          this.getFavoritesById(this.favoriteIds);

          this.onloadViewMenu();
        });
      }
      if (changes.favoriteIds && changes.favoriteIds.currentValue) {
        this.favoriteIds = changes.favoriteIds.currentValue;
        this.getFavoritesById(this.favoriteIds);
      }
    });
  }

  ngOnInit() {
    if (this.bodyElement.contains('menu-collapsed')) {
      this.bodyElement.remove('menu-collapsed');
    }
    this._menuCollapsed();
    this.noChildClickSup$ = this.sidebarService.onNoChildrenClick.subscribe(res => {
      if (res) {
        this.noChildren(res);
      }
    });
    this.onloadViewMenu();

    if (this.useConfigurationMode) {
      this.originalMenuItems = JSON.parse(JSON.stringify(this.menuItems));
      this.sidebarService.useLocalStorage = this.useLocalStorage;

      const preferences = this.useLocalStorage ?
        this.sidebarService.getPreferences() :
        this.preferences;

      if (preferences.length > 0) {
        this.reorderSidebar(preferences, false);
      }
    } else {
      this.sidebarService.removeSidebarPreferences();
    }
  }

  onloadViewMenu() {
    const currentRoute = this.router.url;
    let currentRouteTokens: string | string[];
    let activeRoute: string;
    if (this.usePathForActiveItem) {
      currentRouteTokens = currentRoute.substring(1);
      activeRoute = currentRouteTokens;
    } else {
      currentRouteTokens = currentRoute.split('/');
      activeRoute = currentRouteTokens[1];
    }
    const data = {
      currentRouteTokens: currentRouteTokens,
      activeItem: activeRoute,
      navItems: this.menuItems
    };
    this.updateActiveRoute(data);
    this.onloadSetParentSelected(activeRoute);
  }

  onloadSetParentSelected(currentRouteTokens) {
    for (const x of this.menuItems) {
      if (x.path === currentRouteTokens) {
        x.parentOfSelected = true;
      } else if (this.usePathForActiveItem && this.checkPathItem(x.children, currentRouteTokens)) {
        x.parentOfSelected = true;
      } else {
        x.parentOfSelected = false;
      }
    }
  }

  updateActiveRoute(navData) {
    if (navData && navData.currentRouteTokens && this.menuItems) {
      for (const menu of this.menuItems) {
        this.deselectAll(menu);
      }
      this.findItem(this.menuItems, navData.currentRouteTokens);
    }
  }

  findItem(items, route, index = 1) {
    let currentRoute: string;
    if (Array.isArray(route)) {
      currentRoute = route[index];
    } else {
      currentRoute = route;
    }
    items.forEach((item) => {
      if (item.path === currentRoute) {
        if (!item.children) {
          this.sidebarService.tag.next(item.tag ? item.tag : null);
          item.selected = true;
          return;
        } else {
          item.expanded = true;
          this.findItem(item.children, route, index + 1);
        }
      } else if (this.usePathForActiveItem && this.checkPathItem(item.children, currentRoute)) {
        item.expanded = true;
        this.findItem(item.children, route);
      }
    });
  }

  checkPathItem(items: SideBar[] = [], path: string) {
    if (items && items.length > 0) {
      const index = items.findIndex(x => x.path === path);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
     * Detects if the menu should collapse based off the width of the screen
     * @returns boolean
     *
  */
  private shouldMenuCollapse(): boolean {
    return window.innerWidth <= this.resWidthCollapseSidebar;
  }

  /**
     * Handle collapsing of menu
     *
  */
  private _menuCollapsed() {
    const isMenuShouldCollapsed: boolean = this.shouldMenuCollapse();
    if (this.isMenuCollapsed !== isMenuShouldCollapsed) {
      this.toggleMenuCollapse();
    }
  }

  /**
     * Window resize listener to toggle the menu collapsed state
     *
  */
  @HostListener('window:resize')
  public onWindowResize(): void {
    this._menuCollapsed();
  }

  /**
     * Handles open and close of clicked parent menu item
     * by marking the current item as opened and opening the submenu group
     * @params $event - click event
     * @params item - menu item that was clicked
     *
  */
  public onToggleMenu($event, item): boolean {
    $event.item = item;
    if (!$event.item.expanded || $event.item.expanded === undefined) {
      $event.item.expanded = true;
      $event.currentTarget.classList.add('opened');
      $event.currentTarget.nextElementSibling.classList.add('opened');
    } else {
      $event.item.expanded = false;
      $event.currentTarget.classList.remove('opened');
      $event.currentTarget.nextElementSibling.classList.remove('opened');
    }
    return false;
  }

  /**
     * Handles open and close of clicked sub menu item
     * @author dwalko
     * @params $event - click event
     * @params item - menu item that was clicked
     *
  */
  public onToggleSubMenu($event): boolean {
    const eventItem = $event.item;
    if (eventItem) {
      if (!$event.item.expanded || $event.item.expanded === undefined) {
        $event.item.expanded = true;
        // $event.currentTarget.classList.add('opened');
        this.titleClicked(eventItem);
      } else {
        $event.item.expanded = false;
        // $event.currentTarget.classList.remove('opened');
      }
    }
    return false;
  }

  /**
   * Called if menu itmes has no children,
   * @params menuItemEvent - sidebar item
   *
*/
  public noChildren(menuItemEvent) {
    if (menuItemEvent.path !== 'Favorites') {
      const datas = {
        children: this.menuItems
      };
      const parentArray = this.findParentPath(datas, this.usePathForActiveItem ? menuItemEvent.path : menuItemEvent.fullPath);
      if (parentArray) {
        for (const menu of this.menuItems) {
          if (this.usePathForActiveItem) {
            menu.parentOfSelected = menu.path === parentArray.children[0].path;
          } else {
            menu.parentOfSelected = menu.fullPath === parentArray.children[0].fullPath;
          }
          if (menu.fullPath === parentArray.children[0].fullPath) {
            menu.expanded = true;
            this.setExpandItem(menu, parentArray.children[0]);
          }
        }
      }
      this.setActiveChild(this.menuItems, this.usePathForActiveItem ? menuItemEvent.path : menuItemEvent.fullPath);
      this.noChildClicked.emit(menuItemEvent);
    }
  }

  /**
     * set active children
     * @params object - children of item, parent
     * @params name - fullPath of item
     *
  */
  findParentPath({ children = [], ...object }, name) {
    let result;
    if (object[this.usePathForActiveItem ? 'path' : 'fullPath'] === name) {
      return object;
    }
    return children.some(o => result = this.findParentPath(o, name)) && Object.assign({}, object, { children: [result] });
  }

  /**
     * set active children
     * @params menuItems - sidebar item
     * @params fullPath - path of item
     *
  */
  setActiveChild(menuItems, fullPath) {
    if (menuItems) {
      menuItems.some(item => {
        item.selected = item.fullPath === fullPath;
        if (item.children) {
          return this.setActiveChild(item.children, fullPath);
        }
      });
    }
  }

  /**
     * expand the parent menu item
  */
  setExpandItem(menuItem, itemExpanded) {
    if (itemExpanded.children) {
      itemExpanded.children.map(item => {
        let menuChild = {};
        if (menuItem.children) {
          menuItem.children.map(menu => {
            if (menu.path === item.path) {
              menu.expanded = true;
              menuChild = menu;
            }
          });
        }
        if (item.children) {
          return this.setExpandItem(menuChild, item);
        }
      });
    }
  }

  /**
   * Toggles menu by adding a class to the body
   *
  */
  public toggleMenuCollapse() {
    if (this.isConfiguring) {

      if (this.sidebarService.tempPrefs.length !== 0) {
        this.isShowCancelDialog = true;
      } else {
        this.isConfiguring = false;
        this.configureMode.emit(this.isConfiguring);
      }

    } else {
      if (this.isMenuCollapsed) {
        this.bodyElement.remove('menu-collapsed');
        this.isMenuCollapsed = false;
      } else {
        this.bodyElement.add('menu-collapsed');
        this.isMenuCollapsed = true;
      }
    }
  }

  /**
   * toggles onDelAllFavHover
   */
  toggleDelAllfavHover(nav): void {
    this.onDelAllFavHover = nav.path === 'Favorites';
  }

  delAllfavFocus(isFocus: boolean, nav: SideBar, delAllBtn?: HTMLElement) {
    if (nav.path === 'Favorites') {
      if (isFocus) {
        this.isDelAllFavFocus = isFocus;
      } else {
        setTimeout(() => {
          const activeElement = this.elementRef.nativeElement.ownerDocument.activeElement;
          if (delAllBtn && activeElement === delAllBtn) {
            this.isDelAllFavFocus = isFocus;
          } else if (!(activeElement.classList.contains('group-name--toggle') || activeElement.classList.contains('group-name--link')
            || activeElement.id === 'deleteAllFavsBtn')) {
            this.isDelAllFavFocus = isFocus;
          }
        });
      }
    } else {
      this.isDelAllFavFocus = false;
    }
  }

  onShowDelAllFav() {
    if (this.onDelAllFavHover || this.isDelAllFavFocus) {
      return true;
    }
    return false;
  }

  /**
   * Recursively checks to see if a menu is searched
   * @params value - menu item
   *
  */
  private isSearched = () => (value) => {
    if (!value) {
      return false;
    }

    if (value.searched) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.some(this.isSearched());
    }

    if (typeof value === 'object') {
      return Object.keys(value).map(key => value[key]).some(this.isSearched());
    }

    return false;
  };

  /**
   * Checks to see if the parent has any child that is included in the search
   * @params parent - parent menu item
   * @returns boolean
   *
  */
  public isChildSearched(parent): boolean {
    if (this.searchTerm.length >= this.minSearchLength) {
      if (parent.searched === true) {
        return true;
      }
      if (parent.children) {
        const searched: any = parent.children?.filter(this.isSearched());
        if (searched) {
          return searched.length > 0;
        }
      }
    }

    return false;
  }


  /**
     * Handles click on parent item when nav is closed
     * @params $event - click event
     * @params nav - nav item that was clicked
     *
  */
  public onParentNavClick($event, nav) {
    this.menuItems.forEach((item) => {
      if (item.expanded) {
        item.expanded = false;
      }
    });

    nav.expanded = true;

    this.toggleMenuCollapse();
    // this.menuItems.filter(this.clearSelected());
  }

  /**
   * determines if the "delete all favorites" button should be shown
   */
  showDelFavBtn(item: object) {
    return item['title'] === 'Favorites' && this.favorites.length > 0 && !this.isMenuCollapsed;
  }


  /**
   * Create a ID from Title/Label by removing a whitespace
   *
   * @param $title - title for ID
   */
  createId(title: any) {
    if (title && this.idWithoutSpace) {
      title = title.replace(/[^\w\-]/g, '');
    }
    return title;
  }

  /**
     * Key up method to trigger search within the menu
     * @params $event - key up event
     *
  */
  public onKeyUpSearch($event) {
    if ($event.target.value.length < this.minSearchLength) {
      this.isSearching = false;
      this.menuItems.filter(this.clearSearch());
      return false;
    }
    this.isSearching = true;
    this.handleSearch($event.target.value);
    this.announceSearchResults();
  }

  announceSearchResults(): void {
    // setTimeout to waitting for the class .highlight is applied on UI
    setTimeout(() => {
      let msg = '';
      const length = this.elementRef.nativeElement?.querySelectorAll('.menu-title .highlight')?.length;
      if (length) {
        msg = this.getResultFoundForTranslate(length)?.replace('{0}', length)?.replace('{1}', this.searchTerm);
      } else {
        msg = `${this.messages?.NO_RESULTS_WERE_FOUND} ${this.searchTerm}. ${this.messages?.PLEASE_TRY_AGAIN}`;
      }
      if (msg) {
        this.liveAnnouncer.announce(msg);
      }
    });
  }

  getResultFoundForTranslate(length: number) {
    return (length > 1) ? this.messages?.RESULTS_WERE_FOUND_FOR : this.messages?.RESULT_WAS_FOUND_FOR;
  }

  /**
     * Clears any searched value
     *
  */
  private clearSearch = () => (value) => {
    this._removeAllHighlights();

    if (!value) {
      return false;
    }

    if (value.title) {
      value.display = value.title;
      value.searched = false;
    }

    if (value.data?.keywords) {
      value.searched = false;
    }

    if (Array.isArray(value)) {
      return value.some(this.clearSearch());
    }

    if (typeof value === 'object') {
      return Object.keys(value).map(key => value[key]).some(this.clearSearch());
    }

    return false;
  };

  /**
     * Search recursively through all menus items looking for a match
     * with the search term
     *
  */
  private handleSearch(text, menuItems?) {
    if (!menuItems) {
      menuItems = this.menuItems;
    }

    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].topLevel && menuItems[i].children !== undefined) {
        this.handleSearch(text, menuItems[i].children);
      }

      if (menuItems[i].children) {
        this.handleSearch(text, menuItems[i].children);
      }

      if ((!this.allowSearchTopLevel && menuItems[i].topLevel) || menuItems[i].path === 'Favorites') {
        continue;
      }

      if (menuItems[i].title?.toLowerCase().includes(text.toLowerCase())) {
        // Checks to see if the title contains the searched term
        if (!menuItems[i].isHidden) {
          menuItems[i].searched = true;
          menuItems[i].display = this._highlightSearchText(menuItems[i].title, text);
          menuItems[i].sidebarLabel = this._highlightSearchText(menuItems[i].sidebarLabel, text);
        } else {
          menuItems[i].searched = false;
        }

      } else if (menuItems[i].data?.keywords) {
        // Checks to see if the menu item's keywords contains the searched term
        const keywords = menuItems[i].data.keywords;
        let match = false;

        for (let j = 0; j < keywords.length; j++) {
          if (keywords[j].toLowerCase().indexOf(text.toLowerCase()) > -1) {
            menuItems[i].searched = true;
            menuItems[i].display = this._removeHighlightText(menuItems[i].display);
            menuItems[i].sidebarLabel = this._removeHighlightText(menuItems[i].sidebarLabel);
            match = true;
            break;
          }
        }

        if (!match) {
          menuItems[i].searched = false;
          menuItems[i].display = this._removeHighlightText(menuItems[i].display);
          menuItems[i].sidebarLabel = this._removeHighlightText(menuItems[i].sidebarLabel);
        }

      } else {
        menuItems[i].searched = false;
        menuItems[i].display = this._removeHighlightText(menuItems[i].display);
        menuItems[i].sidebarLabel = this._removeHighlightText(menuItems[i].sidebarLabel);
      }
    }
  }

  /**
     * Highlights search results
     * @params title - title from menu item
     * @param text - search text
     *
  */
  private _highlightSearchText(title, text): string {
    if (title.includes('<span class="highlight">')) {
      title = this._removeHighlightText(title);
    }
    return title.replace(new RegExp(text, 'gi'), (str) => '<span class="highlight">' + str + '</span>');
  }

  private _removeHighlightText(text): string {
    text = text.replaceAll('<span class="highlight">', '');
    text = text.replaceAll('</span>', '');
    return text;
  }

  private _removeAllHighlights() {
    let spans: any = document.getElementsByClassName('highlight');
    while (spans.length) {
      for (const span of spans) {
        const text = span.textContent || span.innerText;
        const node = document.createTextNode(text);
        span.parentNode.replaceChild(node, span);
      }
      spans = document.getElementsByClassName('highlight');
    }
  }

  /**
     * Iterates over all menus items and see
     * if there are search results to display empty message
     * @returns hasResults
     *
  */
  public hasResults(): boolean {
    let hasResults = false;
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.isChildSearched(this.menuItems[i])) {
        hasResults = true;
      }
    }
    return hasResults;
  }

  /**
     * Handles click event to clear search
     * @params $event - click event
     *
  */
  public clickClearSearch($event) {
    this.searchTerm = '';
    this.isSearching = false;
    this.menuItems.filter(this.clearSearch());

    return false;
  }

  /**
   * update FavoriteIcons
   */
  updateFavoriteIcons() {
    for (const menu of this.menuItems) {
      this.setFav(menu);
    }
  }

  /**
   * Goes through the children recursively and if there are no children, it sets the isFav and the favValues of the item
   *
   * @param item - the item to add isFav and the favValues to
   */
  setFav(item: any) {
    if (item.children) {
      for (const child of item.children) {
        this.setFav(child);
      }
    } else {
      item.isFav = this.checkFav(item);
      this.setFavValues(item);
    }
  }

  /**
   * Sets the favIcon and favTip component depending on if the item was favorited
   *
   * @param item - the menu item
   */
  setFavValues(item: any) {
    if (!item.isFav) {
      item.favIcon = 'far fa-star';
      item.favTip = this.messages.SAVE_TO_FAVORITES;
    } else {
      item.favIcon = 'fas fa-star';
      item.favTip = this.messages.DELETE_FROM_FAVORITES;
    }
  }

  /**
   * Checks to see whether the menu item is a favorite or not
   *
   * @param page - page to check
   * @returns True if it is a favorite, false otherwise
   */
  checkFav(page: object): boolean {
    if (this.favorites) {
      for (const item of this.favorites) {
        if (item === page) {
          return true;
        }
      }
    }
    return false;
  }

  /**
 * Goes through the children recursively, and if there are no children it sets selected to false
 *
 * @param item - the item to set selected to false
 */
  deselectAll(item: any) {
    if (item.children) {
      for (const child of item.children) {
        this.deselectAll(child);
      }
    } else {
      item.selected = false;
    }
  }

  /**
   * Deselects eveything in the menuItems, toggles isExpanded, and then sets the first child to selected
   *
   * @param item - the item that was clicked on
   */
  titleClicked(item: any) {
    if (item.path === 'Favorites') {
      item.expanded = !item.expanded;
    } else {
      for (const menu of this.menuItems) {
        if (this.countLevelNav === 0) {
          if (this.usePathForActiveItem) {
            menu.parentOfSelected = menu.path === item.path;
          } else {
            menu.parentOfSelected = menu.fullPath === item.fullPath;
          }

        }
        this.deselectAll(menu);
      }
      if (!item.expanded) {
        item.expanded = true;
      }
      if (item.children?.length) {
        const newItem = item.children.find(itemChild => !itemChild.disabled);
        if (newItem) {
          item = newItem;
          this.countLevelNav++;
          this.titleClicked(item);
        }
      } else {
        this.sidebarService.tag.next(item.tag ? item.tag : null);
        item.selected = true;
        this.countLevelNav = 0;
        if (!item.routeType || item.routeType === RouteType.Internal) {
          this.menuItemClicked.emit(item);
          this.router.navigate([this.usePathForActiveItem ? item.path : item.fullPath]);
        } else {
          this.eventTitleClicked.emit(item);
        }
      }
    }
  }

  /**
 * updates a user's favorite menu items
 *
 * @param $event - contains updated favorites
 */
  updateFavorites($event: any): void {
    // prepare updated favorites
    const pageId = $event['pageId'];
    const action = $event['action'];
    const favoriteIds = [];
    for (const page of this.favorites) {
      if (page.route.fullPath !== pageId) { // handles delete
        favoriteIds.push({ favoriteId: page.route.fullPath });
      }
    }
    if (action === 'add') {
      favoriteIds.push({ favoriteId: pageId });
    }
    // API call
    this.getFavoritesById(favoriteIds);
    this.favoriteChanged.emit(favoriteIds);
  }

  /**
   * deletes all the favorites for the current user
   * @author onnaemego
   */
  deleteAllFavorites() {
    this.favorites = [];
    this.updateFavoriteIcons();
    this.favoriteChanged.emit([]);
  }

  /**
   * update favorites list
   */
  getFavoritesById(favorites: object[]): void {
    if (favorites && favorites.length > 0) {
      const favs = [];
      for (const obj of favorites) {
        const fav = this.findInCollection(this.menuItems, obj['favoriteId']);
        if (fav && !fav['disabled']) {
          favs.push(fav);
        }
      }
      this.favorites = favs;
    } else {
      this.favorites = favorites;
    }
    this.updateFavoriteIcons();
  }

  /**
   * Searches given collection for menu items with matching fullPath
   *
   * @param collection - list to search
   * @param id - id to find
   */
  findInCollection(collection, id): object | null {
    for (const item of collection) {
      if (item.route.fullPath === id) {
        return item;
      } else if (item.children) {
        const fav = this.findInCollection(item.children, id);
        if (fav) {
          return fav;
        }
      }
    }
    return null;
  }

  /**
   * Used with configuration mode. Handles reordering of the menu items when clicking on the up/down arrows
   * @param itemPreference - Object containing information as to how the menu item is being reordered
   * @author rhua
   */
  handleReorder(itemPreference: any): void {
    if (itemPreference.reorderFav) {
      this.handleReorderFav(itemPreference);
      return;
    }

    const fullPath = itemPreference.menuItem.fullPath;
    const menuItems = this.findMenuItem(fullPath, this.menuItems);
    const index = this.findMenuItemIndex(fullPath, menuItems);

    if (index !== -1) {
      const offset = (itemPreference.direction === 'up') ? -1 : 1;
      const adjustedIndex = index + offset;

      // Checks array boundaries
      if ((adjustedIndex >= 0) && (adjustedIndex < menuItems.length)) {
        // Swaps the elements
        this.swapElements(menuItems, index, adjustedIndex);

        // Update localStorage
        this.updateTempPreference(menuItems[index], adjustedIndex, index);
        this.updateTempPreference(menuItems[adjustedIndex], index, adjustedIndex);
      }
    }
  }

  /**
   * Used with configuration mode. Handles reordering of the menu items in the FAVORITES category when clicking on the up/down arrows
   * @param itemPreference - Object containing information as to how the menu item is being reordered
   * @author rhua
   */
  private handleReorderFav(itemPreference: any) {
    this.favoritesChanged = true;

    const fullPath = itemPreference.menuItem.fullPath;
    const index = this.findMenuItemIndex(fullPath, this.favorites);

    if (index !== -1) {
      const offset = (itemPreference.direction === 'up') ? -1 : 1;
      const adjustedIndex = index + offset;

      // Checks array boundaries
      if ((adjustedIndex >= 0) && (adjustedIndex < this.favorites.length)) {
        // Swaps the elements for both this.favorites and this.favoriteIds
        this.swapElements(this.favorites, index, adjustedIndex);
      }
    }
  }

  /**
   * Helper function to swap the positions of two elements in an array
   * @param array - Array containing the elements to be swapped
   * @param index - Index of first element
   * @param adjustedIndex - Index of second element
   * @author rhua
   */
  private swapElements(array: any[], index: number, adjustedIndex: number) {
    const temp = array[index];
    array[index] = array[adjustedIndex];
    array[adjustedIndex] = temp;
  }

  /**
   * In configuration mode, when an item is reordered, it is saved in a tempPrefs variable. This allows
   * changes to be reverted when the cancel button is pressed, and only saved when save is pressed
   * @param menuItem - The menu item object being changed
   * @param origPosition - The position of the menu item in the array BEFORE being changed
   * @param position - Optional. The position of the menu item AFTER being changed
   * @author rhua
   */
  private updateTempPreference(menuItem: any, origPosition: number, position?: number) {
    const preferences = this.sidebarService.tempPrefs;
    let preference = {};

    let matchFound = false;
    for (let i = 0; i < preferences.length; i++) {
      // If the menu item is found in tempPrefs, will update it with the new info
      if (menuItem.fullPath === preferences[i].fullPath) {
        matchFound = true;
        if (preferences[i].preferences.origPosition === undefined) {
          preferences[i].preferences.origPosition = origPosition;
        }
        preferences[i].preferences.position = position;
        preference = preferences[i];
        break;
      }
    }

    // If the menu item was not found in tempPrefs, will add it
    if (!matchFound) {
      preference = {
        'path': menuItem.path,
        'fullPath': menuItem.fullPath,
        'preferences': {
          'position': position,
          'origPosition': origPosition
        }
      };
    }

    this.sidebarService.addTempPreference(preference);
  }

  /**
   * Saves the tempPrefs. If useLocalStorage is true, will save the changes in local storage.
   * If false, will emit a preferencesChanged event with a list of the preferences, and the parent application
   * is responsible for saving the preferences
   * @author rhua
   */
  handleSave() {
    this.preferences = this.sidebarService.save(this.preferences);

    this.saveFavoriteChanges();
    this.toggleMenuCollapse();

    if (this.useLocalStorage) {
      // this.messageService.showSuccess('Your changes have been saved');
      this.primeNgMessageService.add({ severity: 'success', summary: 'Success', detail: 'Your changes have been saved' });
    } else {
      // If useLocalStorage is false, no toast is created. Parent app is responsible for the toast
      this.preferencesChanged.emit(this.preferences);
    }
  }

  /**
   * When user clicks 'cancel' in configuration mode
   * @author rhua
   */
  handleCancel() {
    if (this.sidebarService.tempPrefs.length !== 0 || this.favoritesChanged) {
      this.isShowCancelDialog = true;
    } else {
      this.toggleMenuCollapse();
    }
  }

  /**
   * If the user has reordered their favorites, will save the changes and emit the favoriteChanged event
   * @author rhua
   */
  private saveFavoriteChanges() {
    if (!this.favoritesChanged) {
      return;
    }

    this.favoriteIds = this.favorites.map((favorite) => ({ favoriteId: favorite.fullPath }));

    this.favoriteChanged.emit(this.favoriteIds);
    this.favoritesChanged = false;
  }

  /**
   * Reverts any reordering that the user made to their favorites when 'cancel' is pressed
   * @author rhua
   */
  private revertFavoriteChanges() {
    if (!this.favoritesChanged) {
      return;
    }

    this.getFavoritesById(this.favoriteIds);
    this.favoritesChanged = false;
  }

  /**
   * This function is called after the user has selected 'yes' or 'no' in the cancel dialog
   * @param confirmCancel - True if the user confirms they want to cancel
   * @author rhua
   */
  handleCancelDialog(confirmCancel: boolean) {
    if (confirmCancel) {
      this.isItemsDisplayed = false;
      this.changeDetector.detectChanges();
      this.isItemsDisplayed = true;
      this.reorderSidebar(this.sidebarService.tempPrefs, true);
      this.sidebarService.clearTempPreferences();
      this.toggleMenuCollapse();
      this.revertFavoriteChanges();
    }

    this.isShowCancelDialog = false;
  }

  /**
   * Opens the reset dialog
   * @author rhua
   */
  handleReset() {
    this.isShowResetDialog = true;
  }

  /**
   * This function is called after the user has selected 'yes' or 'no' in the reset to defaults dialog
   * @param confirmReset - True if the user confirms they want to reset to defaults
   * @author rhua
   */
  handleResetDialog(confirmReset: boolean) {
    if (confirmReset) {
      this.sidebarService.clearPreferences();
      this.sidebarService.clearTempPreferences();

      // This condition is required to make the 'Reset to defaults' work in story book
      if (this.originalMenuItems[0].fullPath === 'Favorites') {
        this.menuItems = this.originalMenuItems;
      }

      this.isItemsDisplayed = false;
      this.changeDetector.detectChanges();
      this.isItemsDisplayed = true;

      this.toggleMenuCollapse();
    }
    this.isShowResetDialog = false;
  }

  /**
   * Called when the onDragChild event is caught. Keeps track of which item is currently being dragged by the user
   * @param itemDragged - The sidebar-item component that is currently being dragged
   * @author rhua
   */
  handleDrag(itemDragged) {
    if (itemDragged.fullPath === undefined) {
      return;
    }

    this.itemDragged = {
      fullPath: itemDragged.fullPath,
      label: itemDragged.sidebarLabel,
      isDragFavs: itemDragged.isFavoritesTab
    };
  }

  /**
   * Function called when user drops a menu item on this location.
   * Will determine if the dragged item can be inserted into the drop location
   * @param dropLocation - An object of where the menu item was dropped
   * @author rhua
   */
  handleDrop(dropLocation) {
    this.removeDropIndicator();

    let sidebarLabel: string = dropLocation.target.innerText;

    // If the user drops onto the icon-container, this condition will trigger
    if (sidebarLabel === '') {
      let path = dropLocation.target.parentElement;
      do {
        sidebarLabel = path.innerText;
        path = path.parentElement;
      } while (sidebarLabel === '');
    }

    const idArray = this.createIdArray(dropLocation.path);
    const dropPath = this.getDropPath(idArray);

    // If the drop location is in the favorites section
    if (dropPath === 'Favorites' && this.itemDragged.isDragFavs) {
      this.insertAtDropLocationFavs(sidebarLabel);
      return;
    }

    const isDroppable: boolean = this.canDropAtLocation(dropPath);
    if (isDroppable) {
      this.insertAtDropLocation(dropPath);
    }
  }

  /**
   * Inserts the dragged item into the drop location for the favorites section
   * @param dropLabel - The label at the drop location
   * @author rhua
   */
  private insertAtDropLocationFavs(dropLabel) {
    const indexOrig = this.findMenuItemIndex(this.itemDragged.fullPath, this.favorites);

    if (indexOrig !== -1) {
      this.favoritesChanged = true;
      let indexTarget = null;
      for (let i = 0; i < this.favorites.length; i++) {
        if (dropLabel === this.favorites[i].title) {
          indexTarget = i;
          break;
        }
      }

      // Removes the dragged item from the favorites section and then reinserts in the new location
      const temp = this.favorites[indexOrig];
      this.favorites.splice(indexOrig, 1);
      this.favorites.splice(indexTarget, 0, temp);
    }
  }

  /**
   * Inserts the dragged item into the drop location
   * @param dropPath - The path to the location where the item was dropped
   * @author rhua
   */
  private insertAtDropLocation(dropPath: string) {
    const menuItems = this.findMenuItem(dropPath, this.menuItems);
    const indexOrig = this.findMenuItemIndex(this.itemDragged.fullPath, menuItems);

    if (indexOrig !== -1) {
      const indexTarget = this.findMenuItemIndex(dropPath, menuItems);

      // Removes the dragged item and then reinserts in the new location
      const temp = menuItems[indexOrig];
      menuItems.splice(indexOrig, 1);
      menuItems.splice(indexTarget, 0, temp);

      // Update localStorage
      this.updateTempPreference(menuItems[indexTarget], indexOrig, indexTarget);
      this.updateTempPreference(menuItems[indexOrig], indexTarget, indexOrig);
    }
  }

  /**
   * Used to get the full path of the location where the item was dropped
   * @param idArray - An array containing the ids up to the drop location
   * @returns A string representing the full path of the drop location
   * @author rhua
   */
  private getDropPath(idArray) {
    let menuItems: any = this.menuItems;

    // Loops through the id array starting from the end.
    // The id at the last index is the highest level, and the id at index 0 is the lowest level
    for (let i = idArray.length - 1; i >= 0; i--) {
      if (i !== 0) {
        menuItems = this.getPath(menuItems, idArray[i], false);
        // If any of the ids is 'Favorites' we know the drop location is in the favorites section
        if (menuItems === 'Favorites') {
          return 'Favorites';
        }
      } else {
        return this.getPath(menuItems, idArray[i], true);
      }
    }
  }

  /**
   * Helper function for getDropPath(). Used to get the full path of the drop location
   * or to continue digging down into the menu items to find the full path
   * @param menuItems - The current menu items to iterate through
   * @param searchedTerm - The id that is being searched for
   * @param isLastElement - A boolean value representing if index 0 of the idArray has been reached
   * @returns Returns either the full path or another array to iterate through
   * @author rhua
   */
  private getPath(menuItems, searchedTerm, isLastElement) {
    for (let i = 0; i < menuItems.length; i++) {
      const titleNoSpaces = menuItems[i].title.replace(/\s/g, '');
      const searchedTermNoSpaces = searchedTerm.replace(/\s/g, '');

      if (titleNoSpaces === searchedTermNoSpaces) {
        if (isLastElement) {
          return menuItems[i].fullPath;
        } else {
          if (searchedTermNoSpaces === 'Favorites') {
            return menuItems[i].fullPath;
          }
          return menuItems[i].children;
        }
      }

      if (titleNoSpaces.replace('&', '') === searchedTermNoSpaces) {
        if (isLastElement) {
          return menuItems[i].fullPath;
        } else {
          return menuItems[i].children;
        }
      }
    }
  }

  /**
   * Takes an array of nodes and returns an array of the ids
   * @param nodeArray - An array of HTML nodes
   * @returns Returns an array of ids
   * @author rhua
   */
  private createIdArray(nodeArray) {
    const idArray = [];
    for (let i = 0; i < nodeArray.length; i++) {
      let id = nodeArray[i].id;

      // Uses regex to clean the ids
      if (id !== undefined && id !== '' && id !== 'root' && !id.includes('-config-')) {
        id = id.replace('SubTab', '');
        id = id.replace(/Tab\b/, '');
        id = id.replace('-icon-container', '');

        idArray.push(id);
      }
    }
    return idArray;
  }

  /**
   * Determines if the dragged item can be dropped at that location
   * @param dropLocation - The full path of where the item is dropped
   * @returns Returns a boolean
   * @author rhua
   */
  private canDropAtLocation(dropLocation: string): boolean {
    let lastIndex = dropLocation.lastIndexOf('/');
    const dropPath = dropLocation.slice(0, lastIndex);

    lastIndex = this.itemDragged.fullPath.lastIndexOf('/');
    const dragPath = this.itemDragged.fullPath.slice(0, lastIndex);

    return (dropPath === dragPath);
  }

  /**
   * Used to determine if configuration mode is being used AND if the menu is collapsed
   * @returns Returns a boolean
   * @author rhua
   */
  isConfiguringAndCollapsed(): boolean {
    if (this.useConfigurationMode && this.isMenuCollapsed) {
      return true;
    }
    return false;
  }

  /**
   * Used to determine what icon is display at the top right of the sidebar
   * @returns Returns a string representing a css class
   * @author rhua
   */
  getIconClass() {
    if (this.isConfiguring) {
      return 'fa fa-times';
    }
    if (this.isMenuCollapsed) {
      return 'fa fa-arrow-right';
    }
    return 'fa fa-arrow-left';
  }

  getIconTooltip() {
    if (this.isConfiguring) {
      return 'Close Configuration Mode';
    }
    if (this.isMenuCollapsed) {
      return 'Expand';
    }
    return 'Collapse';
  }

  /**
   * Will add a drop indicator (pink border) while dragging and dropping
   * @param dropLocation - The item the user is currently hovering over
   * @author rhua
   */
  addDropIndicator(dropLocation) {
    this.removeDropIndicator();

    let dropTargetLabel = dropLocation.fromElement?.innerText;
    if (dropTargetLabel === undefined) {
      return;
    }

    // If the user drops onto the icon-container
    if (dropTargetLabel === '') {
      let currElement = dropLocation.srcElement;
      while (currElement.id === '') {
        currElement = currElement.parentElement;
      }
      if (currElement.id.includes('icon-container')) {
        dropTargetLabel = currElement.previousSibling.innerText;
      }
      if (currElement.id.includes('-config-')) {
        dropTargetLabel = currElement.parentElement.previousSibling.innerText;
      }
    }

    if (dropTargetLabel === this.itemDragged.label) {
      dropTargetLabel = dropLocation.srcElement?.innerText;
    }

    const idArray = this.createIdArray(dropLocation.path);
    const dropPath = this.getDropPath(idArray);

    // If the user is dropping in the favorites section
    if (dropPath === 'Favorites' && this.itemDragged.isDragFavs) {
      const dropPointClass = this.isDropAbove(dropTargetLabel, true) ? 'dropIndicatorTop' : 'dropIndicatorBottom';
      this.setCurrentDropTarget(dropLocation, dropPointClass);
      return;
    }

    const isDroppable: boolean = this.canDropAtLocation(dropPath);
    if (isDroppable) {
      const dropPointClass = this.isDropAbove(dropTargetLabel, false) ? 'dropIndicatorTop' : 'dropIndicatorBottom';
      this.setCurrentDropTarget(dropLocation, dropPointClass);
    }
  }

  /**
   * Sets the element as the current drop target
   * @param element - The element to be set as the current drop target
   * @param dropIndicator - The css class to be added to that element
   * @author rhua
   */
  private setCurrentDropTarget(element, dropIndicator) {
    let currElement = element.srcElement;
    while (currElement.id === '') {
      currElement = currElement.parentElement;
    }
    if (currElement.id.includes('-config-')) {
      currElement = currElement.parentElement;
    }
    if (currElement.id.includes('icon-container')) {
      currElement = currElement.previousSibling;
    }

    this.currentDropTarget = currElement;
    this.currentDropTarget.classList.add(dropIndicator);
  }

  /**
   * Determines whether the drop location is above or below the item being dragged
   * @param dropLabel - The sidebar label of the drop location
   * @param isFav - Boolean value. True if drop location is in the favorites section
   * @returns Returns true if drop location is above item being dragged
   * @author rhua
   */
  private isDropAbove(dropLabel, isFav): boolean {
    let array = this.favorites;
    if (!isFav) {
      array = this.findMenuItem(this.itemDragged.fullPath, this.menuItems);
    }

    for (let i = 0; i < array.length; i++) {
      if (array[i].sidebarLabel === this.itemDragged.label) {
        return false;
      }
      if (array[i].sidebarLabel === dropLabel) {
        return true;
      }
    }
  }

  /**
   * Removes the css classes for the drop indiciator
   * @author rhua
   */
  private removeDropIndicator() {
    this.currentDropTarget?.classList.remove('dropIndicatorBottom');
    this.currentDropTarget?.classList.remove('dropIndicatorTop');
  }

  /**
   * Returns the lowest level of menu items that contains the full path being searched for
   * @param fullPath - The full path of the menu item being searched for
   * @param menuItems - The starting location for the search. Used for recursion.
   * @returns - Returns an array of menu items
   * @author rhua
   */
  private findMenuItem(fullPath: string, menuItems: any[]) {
    for (let i = 0; i < menuItems.length; i++) {
      if (fullPath === menuItems[i].fullPath) {
        break;
      }
      if (fullPath.includes(menuItems[i].fullPath)) {
        menuItems = this.findMenuItem(fullPath, menuItems[i].children);
        break;
      }
    }
    return menuItems;
  }

  /**
   * Finds the index of the item within the given menuItem array
   * @param fullPath - The fullPath of the item that is being searched for
   * @param menuItem - The array of menuItems to search through
   * @returns Returns the index
   * @author rhua
   */
  private findMenuItemIndex(fullPath: string, menuItem: any): number {
    return menuItem.findIndex((item) => fullPath === item.fullPath);
  }

  /**
   * Used to reorder the sidebar based on the user's preferences
   * @param preferences - An array of the user's preferences
   * @param useOrigPos - Boolean value. True if reordering based on the item's original position
   * @author rhua
   */
  reorderSidebar(preferences: any, useOrigPos?: boolean) {
    for (let i = 0; i < preferences.length; i++) {
      // Skips preferences that don't have a position key
      if ((!useOrigPos && preferences[i].preferences.position === undefined)
        || (useOrigPos && preferences[i].preferences.origPosition === undefined)) {
        continue;
      }

      this.reorderMenuItems(preferences[i], this.menuItems, useOrigPos);
    }
  }

  /**
   * Used to reorder a specific section within the sidebar based on the user's preferences
   * @param preference - An object containing the user's preference for that specific menu item
   * @param menuItem - An array of menu items
   * @param useOrigPos - Boolean value. True if reordering based on the item's original position
   * @author rhua
   */
  private reorderMenuItems(preference: any, menuItem: any, useOrigPos?: boolean) {
    const lastIndex = preference.fullPath.lastIndexOf('/');
    const path = preference.fullPath.slice(0, lastIndex);

    for (let i = 0; i < menuItem.length; i++) {
      if (path === menuItem[i].fullPath) {
        const index = this.findMenuItemIndex(preference.fullPath, menuItem[i].children);
        const position = useOrigPos ? preference.preferences.origPosition : preference.preferences.position;
        const element = menuItem[i].children[index];

        menuItem[i].children.splice(index, 1);
        menuItem[i].children.splice(position, 0, element);

      } else if (preference.fullPath.includes(menuItem[i].fullPath) && menuItem[i].children) {
        this.reorderMenuItems(preference, menuItem[i].children, useOrigPos);
        break;
      }
    }
  }

  /**
   * Opens/closes configuration mode. Will emit the configureMode event
   * @author rhua
   */
  handleConfigure() {
    if (this.isMenuCollapsed) {
      this.toggleMenuCollapse();
    }

    if (this.isConfiguring) {
      this.handleCancel();
    } else {
      this.isConfiguring = !this.isConfiguring;
    }

    this.configureMode.emit(this.isConfiguring);
  }

  ngOnDestroy(): void {
    // Reset onNoChildrenClick BehaviorSubject
    this.sidebarService.onNoChildrenClick.next(null);
    this.noChildClickSup$?.unsubscribe();
  }
}
