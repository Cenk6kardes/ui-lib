import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SideNav } from '../../../models/sidenav';

interface ISideNavRender {
  type: string;
  prop: SideNav;
}

@Component({
  selector: 'rbn-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnChanges, OnInit {
  @Input() collapsed: boolean = null;
  @Input() sidenavs: ISideNavRender[];
  @Input() defaultUrl = '';
  @Output() changeColapse: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() activeNavItem: EventEmitter<SideNav> = new EventEmitter<SideNav>();

  linkText = true;
  currentActiveNav: SideNav;
  url: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.url.subscribe(activeUrl => {
      this.url = this.router.url;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setInitActiveSideNavs(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.setInitActiveSideNavs(this.url);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.collapsed) {
      if (this.collapsed !== changes.collapsed.previousValue) {
        this.collapsed = changes.collapsed.currentValue;
        this.onSinenavToggle();
      }
    }

    if (changes.defaultUrl) {
      if (this.defaultUrl !== changes.defaultUrl.previousValue) {
        this.defaultUrl = changes.defaultUrl.currentValue;
        this.activatedRoute.url.subscribe(() => {
          this.url = this.router.url;
          this.setInitActiveSideNavs(this.url);
        });
      }
    }
  }

  onSinenavToggle() {
    this.setAnimateLinkText(this.collapsed);
    this.activeParentWhenCollapse();
  }

  clickMenu(row: any) {
    this.sidenavs.map(item => {
      if (item.prop.label === row.label) {
        this.currentActiveNav = item.prop;
        if (this.collapsed || this.collapsed === null) {
          item.prop.expand = !item.prop.expand;
          item.prop.isFirstLoad = false;
        }
        item.prop.isActive = true;
        if (!item.prop.items || !item.prop.items.length) {
          this.sidenavs.map(menuItem => {

            this.setUnSelectedSubMenu(menuItem.prop);
          });
        }
      } else {
        item.prop.isActive = false;
      }
    });
    if (!row.items) {
      this.changeColapse.emit(true);
    }
  }

  clickSubMenu(row, subRow) {
    this.changeColapse.emit(true);
    this.sidenavs.map(item => {
      if (item.prop.label === row.label) {
        item.prop.items.map(subItem => {
          if (subItem.label === subRow.label) {
            item.prop.isActive = true;
            subItem.isActive = true;
          } else {
            subItem.isActive = false;
          }
        });
        this.currentActiveNav = item.prop;
      } else {
        item.prop.isActive = false;
        this.setUnSelectedSubMenu(item.prop);
      }
    });
  }

  setUnSelectedSubMenu(item: any) {
    if (item.items && item.items.length > 0) {
      item.items.map(subItem => {
        subItem.isActive = false;
      });
    }
    return item;
  }

  activeParentWhenCollapse() {
    this.sidenavs.map(item => {
      if (this.collapsed === false && this.currentActiveNav && item.prop.label === this.currentActiveNav.label) {
        item.prop.isActive = true;
      }
    });
  }

  setAnimateLinkText(newStateText) {
    setTimeout(() => {
      this.linkText = newStateText === false ? false : true;
    }, 200);

  }

  setInitActiveSideNavs(url: string) {
    let currentUrl = '/';
    if (url && url !== '/') {
      currentUrl = url;
    }
    if (currentUrl === '/' && this.defaultUrl) {
      currentUrl = this.defaultUrl;
    }
    let activeItem;
    this.sidenavs.map(item => {
      if (item.prop.link && currentUrl.includes(item.prop.link)) {
        item.prop.isActive = true;
        item.prop.expand = true;
        item.prop.isFirstLoad = false;
        this.currentActiveNav = item.prop;
        activeItem = item.prop;
      } else {
        item.prop.isActive = false;
        item.prop.expand = false;
        item.prop.isFirstLoad = true;
      }
      if (item.prop.items && item.prop.items.length > 0) {
        item.prop.items.map(subItem => {
          if (currentUrl.includes(subItem.link)) {
            item.prop.isActive = true;
            subItem.isActive = true;
            item.prop.expand = true;
            this.currentActiveNav = item.prop;
            item.prop.isFirstLoad = false;
            activeItem = subItem;
            this.activeNavItem.emit(activeItem);
            return;
          } else {
            subItem.isActive = false;
          }
        });
      }
    });
    this.activeNavItem.emit(activeItem);
  }
}
