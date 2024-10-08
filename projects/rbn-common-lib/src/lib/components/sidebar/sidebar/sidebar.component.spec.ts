/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';

import { MessageService } from 'primeng/api';

import { SidebarComponent } from './sidebar.component';
import { SidebarItemsComponent } from './sidebar-items/sidebar-items.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog/confirm-dialog.component';
import { SidebarService } from './sidebar-service/sidebar.service';
import { SideBar } from '../../../models/sidebar';
import { SidebarModule } from '../sidebar.module';
import { Router } from '@angular/router';

@Component({
  template: '<div>Dummy Dashboard Component</div>'
})
export class DummyDashboardComponent { }


describe('RbnSidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const sidebarService = {
    onNoChildrenClick: new BehaviorSubject(null),
    updateFavorites: new BehaviorSubject(null),
    convertToSideBarData: jasmine.createSpy('convertToSideBarData'),
    tempPrefs: [],
    save() {
      return true;
    },
    clearPreferences() { },
    clearTempPreferences() { }
  };

  const menuItems = [
    {
      path: 'home',
      data: {
        menu: {
          title: 'Home',
          sidebarLabel: 'Home',
          icon: 'rb-home',
          topLevel: true
        }
      },
      children: [{
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboards',
            sidebarLabel: 'Dashboards'
          }
        },
        route: {
          paths: 'home',
          fullPath: 'home/dashboard'
        }
      },
      {
        path: 'customDashboard',
        data: {
          menu: {
            title: 'Custom Dashboards',
            sidebarLabel: 'Custom Dashboards'
          }
        },
        route: {
          paths: 'home',
          fullPath: 'home/customDashboard'
        }
      }
      ],
      route: {
        paths: 'home',
        fullPath: 'home'
      },
      expanded: true
    },
    {
      path: 'setting',
      data: {
        menu: {
          title: 'setting',
          sidebarLabel: 'setting',
          icon: 'rb-setting',
          topLevel: true
        }
      },
      children: [],
      route: {
        paths: 'setting',
        fullPath: 'setting'
      }
    }
  ];

  const menuItemsOnlyPath = [
    {
      path: 'home/dashboard',
      data: {
        menu: {
          title: 'Home',
          sidebarLabel: 'Home',
          icon: 'rb-home',
          topLevel: true
        }
      },
      children: [{
        path: 'home/dashboard',
        data: {
          menu: {
            title: 'Dashboards',
            sidebarLabel: 'Dashboards'
          }
        }
      },
      {
        path: 'home/customDashboard',
        data: {
          menu: {
            title: 'Custom Dashboards',
            sidebarLabel: 'Custom Dashboards'
          }
        }
      }
      ],
      expanded: true
    },
    {
      path: 'services/config',
      data: {
        menu: {
          title: 'Services',
          sidebarLabel: 'Services',
          icon: 'rb-setting',
          topLevel: true
        }
      },
      children: [{
        path: 'services/config',
        data: {
          menu: {
            title: 'Config',
            sidebarLabel: 'Config'
          }
        }
      },
      {
        path: 'services/test',
        data: {
          menu: {
            title: 'Test',
            sidebarLabel: 'Test'
          }
        }
      }
      ],
      expanded: true
    }
  ];

  const menuItemsRefac: any = [...menuItems];
  const sidebarServiceObj = new SidebarService();
  sidebarServiceObj.makeSideBarLevel(menuItemsRefac);

  const item = {
    path: 'dashboard',
    data: {
      menu: {
        title: 'Dashboards',
        sidebarLabel: 'Dashboards'
      }
    },
    children: [],
    fullPath: 'home/dashboard',
    route: {
      paths: 'home',
      fullPath: 'home/dashboard'
    },
    expanded: false
  };

  const itemFav = {
    path: 'Favorites',
    data: {
      menu: {
        title: 'Favorites',
        sidebarLabel: 'Favorites',
        icon: 'fa fa-star'
      }
    },
    children: [],
    fullPath: 'favorites',
    route: {
      paths: 'favorites',
      fullPath: 'favorites'
    },
    expanded: true
  };

  const favorite = { favoriteId: 'home/dashboard' };

  const favorites = {
    path: 'customDashboard',
    data: {
      menu: {
        title: 'Custom Dashboards',
        sidebarLabel: 'Custom Dashboards',
        display: 'Custom Dashboards'
      }
    },
    fullPath: 'home/customDashboard',
    route: {
      paths: 'customDashboard',
      fullPath: 'home/customDashboard'
    }
  };

  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'home', children: [{
              path: 'dashboard', component: DummyDashboardComponent
            }]
          }
        ]),
        HttpClientTestingModule,
        SidebarModule
      ],
      declarations: [
        DummyDashboardComponent,
        SidebarComponent,
        SidebarItemsComponent,
        ConfirmDialogComponent
      ],
      providers: [
        MessageService,
        { provide: SidebarService, useValue: sidebarServiceObj }
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    sidebarService.convertToSideBarData.and.returnValue(of(menuItems));
    // sidebarService.onNoChildrenClick.and.returnValue(of(item));
    component.menuItems = [...menuItems];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call convert sidebar data when onchanges', () => {
    const simpleChange = new SimpleChange(undefined, menuItems, false);
    const favoriteIds = new SimpleChange(undefined, favorite, false);
    spyOn(component, 'getFavoritesById');
    component.ngOnChanges({ menuItems: simpleChange, favoriteIds: favoriteIds });
    expect(component.getFavoritesById).toHaveBeenCalled();
  });

  it('should call onToggleMenu and set menu expanded', () => {
    const event = {
      currentTarget: {
        nextElementSibling: {
          classList: {
            remove: () => { }
          }
        },
        classList: {
          add: () => { },
          remove: () => { }
        }
      },
      expanded: false
    };
    const onToggleMenu = component.onToggleMenu(event, { expanded: true });
    expect(onToggleMenu).toBeFalsy();
  });

  it('should call onToggleMenu and set menu collapse', () => {
    const event = {
      currentTarget: {
        nextElementSibling: {
          classList: {
            add: () => { }
          }
        },
        classList: {
          add: () => { },
          remove: () => { }
        }
      },
      expanded: false
    };
    const onToggleMenu = component.onToggleMenu(event, { expanded: false });
    expect(onToggleMenu).toBeFalsy();
  });

  it('should call onToggleSubMenu and set submenu expanded', () => {
    const event = {
      item: {
        expanded: false,
        routeType: 'External'
      }
    };
    const onToggleSubMenu = component.onToggleSubMenu(event);
    expect(onToggleSubMenu).toBeFalsy();
  });

  it('should call onToggleSubMenu and set submenu collapse', () => {
    const event = {
      item: {
        expanded: true,
        routeType: 'External'
      }
    };
    const onToggleSubMenu = component.onToggleSubMenu(event);
    expect(onToggleSubMenu).toBeFalsy();
  });

  it('should active item when click', () => {
    component.noChildren(item);
    component.menuItems = [...menuItemsRefac];
    const firstElm = component.menuItems[0] && component.menuItems[0].children && component.menuItems[0].children[0].path;
    expect(firstElm).toEqual(item.path);
  });

  it('should expand item when click item', () => {
    component.menuItems = [...menuItemsRefac];
    component.setExpandItem(menuItems[0], menuItems[0]);
    expect(component.menuItems[0].path).toEqual('home');
  });

  it('should set collapse menu', () => {
    component.isMenuCollapsed = true;
    component.toggleMenuCollapse();
    expect(component.isMenuCollapsed).toBeFalsy();
  });

  it('should set expand menu', () => {
    component.isMenuCollapsed = false;
    component.toggleMenuCollapse();
    expect(component.isMenuCollapsed).toBeTruthy();
  });

  it('should set toggleDelAllfavHover', () => {
    component.onDelAllFavHover = true;
    component.toggleDelAllfavHover({ title: 'Favorites' });
    expect(component.onDelAllFavHover).toBeFalsy();
  });

  it('should return false when is isChildSearched', () => {
    component.menuItems = [...menuItemsRefac];
    component.searchTerm = 'abc';
    const isChildSearch = component.isChildSearched(menuItems[0]);
    expect(isChildSearch).toBeFalsy();
  });

  it('should call toggleMenuCollapse when on Parent Nav Click', () => {
    spyOn(component, 'toggleMenuCollapse');
    component.onParentNavClick({}, {});
    expect(component.toggleMenuCollapse).toHaveBeenCalled();
  });

  it('should show delete favorite button', () => {
    component.isMenuCollapsed = false;
    const isShowDeleteFav = component.showDelFavBtn({ title: 'Favorites' });
    expect(isShowDeleteFav).toBeFalsy();
  });

  // it('should set isSearching when on key up search', () => {
  //   component.menuItems = [...menuItemsRefac];
  //   component.onKeyUpSearch({ target: { value: '' } });
  //   expect(component.isSearching).toBeFalsy();
  // });

  // it('should handle search when key up', () => {
  //   component.menuItems = [...menuItemsRefac];
  //   component.onKeyUpSearch({ target: { value: 'Dashboards' } });
  //   expect(component.isSearching).toBeTruthy();
  // });

  // it('should handle search when length text less than 2 and key up', () => {
  //   component.menuItems = [...menuItemsRefac];
  //   component.favorites = [favorites];
  //   component.onKeyUpSearch({ target: { value: 'Home' } });
  //   expect(component.isSearching).toBeTruthy();
  // });

  it('should have result search', () => {
    component.menuItems = [...menuItemsRefac];
    const hasResult = component.hasResults();
    expect(hasResult).toBeFalsy();
  });

  // it('should have result search13131323', () => {
  //   component.menuItems = [...menuItemsRefac];
  //   component.searchTerm = 'das';
  //   component.onKeyUpSearch({ target: { value: 'das' } });
  //   const hasResult = component.hasResults();
  //   expect(hasResult).toBeTruthy();
  // });

  it('should clear search when click clear search', () => {
    component.clickClearSearch({});
    expect(component.searchTerm).toEqual('');
  });

  it('should update favorite icons', () => {
    spyOn(component, 'setFav');
    component.menuItems = [...menuItemsRefac];
    component.updateFavoriteIcons();
    expect(component.setFav).toHaveBeenCalled();
  });

  it('should return true when call checkFav', () => {
    component.favorites = [favorites];
    const result = component.checkFav(favorites);
    expect(result).toBeTruthy();
  });

  it('should return false when call titleClicked Favorites', () => {
    component.titleClicked(itemFav);
    expect(itemFav.expanded).toBeFalsy();
  });

  it('should return true when call titleClicked', () => {
    component.favorites = [...menuItemsRefac];
    component.titleClicked(menuItemsRefac[0]);
    expect(menuItemsRefac[0].expanded).toBeTruthy();
  });

  it('should call favoriteChanged emit when call updateFavorites', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.favorites = [...menuItemsRefac];
    const event = { pageId: 'home/dashboard', action: 'add' };
    component.updateFavorites(event);
    expect(component.favoriteChanged.emit).toHaveBeenCalled();
  });

  it('should call favoriteChanged emit when call deleteAllFavorites', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.deleteAllFavorites();
    expect(component.favoriteChanged.emit).toHaveBeenCalled();
  });

  it('should call menuItemClicked', () => {
    spyOn(component.menuItemClicked, 'emit');
    const menuItem = {};
    component.onLeafMenuClick(menuItem);
    expect(component.menuItemClicked.emit).toHaveBeenCalled();
  });

  it('should call reorderSidebar', () => {
    spyOn(component, 'reorderSidebar');
    component.useLocalStorage = false;
    component.useConfigurationMode = true;
    component.preferences = ['test'];
    component.ngOnInit();
    expect(component.reorderSidebar).toHaveBeenCalled();
  });

  it('should call setExpandItem', () => {
    const parentArray = {
      children: [{
        path: 'test',
        fullPath: 'test1'
      }]
    };
    const mockMenuItems: SideBar[] = [
      {
        path: 'test',
        fullPath: 'test1'
      }
    ];
    component.menuItems = mockMenuItems;
    spyOn(component, 'findParentPath').and.returnValue(parentArray);
    spyOn(component, 'setExpandItem');
    component.noChildren(item);
    expect(component.setExpandItem).toHaveBeenCalled();
  });

  // it('should set isShowCancelDialog = "false" when calling toggleMenuCollapse', () => {
  //   spyOn(component.configureMode, 'emit');
  //   component.isConfiguring = true;
  //   component.toggleMenuCollapse();
  //   expect(component.configureMode.emit).toHaveBeenCalled();
  // });

  it('should call onKeyUpSearch', () => {
    const event = {
      target: {
        value: []
      }
    };
    component.onKeyUpSearch(event);
    expect(component.isSearching).toBeFalse();
  });

  it('should call onKeyUpSearch', () => {
    spyOn<any>(component, 'handleSearch');
    const event = {
      target: {
        value: ['test', 'test2', 'test3']
      }
    };
    component.onKeyUpSearch(event);
    expect(component.isSearching).toBeTrue();
  });

  it('should call handleSearch by title', () => {
    const mockMenuItems = [
      {
        path: 'test',
        fullPath: 'test1',
        title: 'test title',
        isHidden: false,
        searched: false,
        sidebarLabel: 'test'
      }
    ];
    const textTest = 'test';
    component.menuItems = mockMenuItems;
    component['handleSearch'](textTest, mockMenuItems);
    expect(mockMenuItems[0].searched).toBeTrue();
  });

  // it('should call handleSearch without title and data', () => {
  //   const menuItems = [
  //     {
  //       path: 'test',
  //       fullPath: 'test1',
  //       isHidden: false,
  //       searched: false,
  //       sidebarLabel: 'test',
  //       display: 'test'
  //     }
  //   ];
  //   const textTest = 'test';
  //   component.menuItems = menuItems;
  //   fixture.detectChanges();
  //   component['handleSearch'](textTest, menuItems);
  //   expect(menuItems[0].searched).toBeFalse();
  // });

  // it('should call _removeHighlightText', () => {
  //   const text: string = '<span class="highlight">test</span>';
  //   fixture.detectChanges();
  //   expect(component['_removeHighlightText'](text)).toEqual('test');
  // });

  it('should return null when calling handleReorder', () => {
    const itemPreference = {
      reorderFav: true,
      menuItem: {
        fullPath: 'test'
      }
    };
    component.favorites = [
      {
        fullPath: 'test'
      }
    ];
    component.handleReorder(itemPreference);
    expect(component.handleReorder(itemPreference)).toBeFalsy();
  });

  it('should return null when calling handleReorder', () => {
    const itemPreference = {
      reorderFav: false,
      menuItem: {
        fullPath: 'test'
      },
      direction: 'down'
    };
    component.menuItems = [
      {
        path: 'test',
        fullPath: 'test'
      },
      {
        path: 'test2',
        fullPath: 'test2'
      }
    ];
    component.handleReorder(itemPreference);
    expect(component.handleReorder(itemPreference)).toBeFalsy();
  });

  it('should call updateTempPreference', () => {
    const mockArr = [
      {
        fullPath: 'test',
        preferences: {
          position: 1
        }
      }
    ];
    const menuItemsTest = {
      path: 'test',
      fullPath: 'test',
      isHidden: false,
      searched: false,
      sidebarLabel: 'test',
      display: 'test'
    };
    Object.assign(sidebarService, { tempPrefs: mockArr });
    // sidebarService.tempPrefs = mockArr;
    fixture.detectChanges();
    component['updateTempPreference'](menuItemsTest, 1, 1);
    expect(mockArr[0].preferences.position).toEqual(1);
  });

  it('should call handleSave when useLocalStorage = false', () => {
    spyOn(component.preferencesChanged, 'emit');
    spyOn(component, 'toggleMenuCollapse');
    component.useLocalStorage = false;
    component.handleSave();
    expect(component.preferencesChanged.emit).toHaveBeenCalled();
    expect(component.toggleMenuCollapse).toHaveBeenCalled();
  });

  it('should call primeNgMessageService when useLocalStorage = true', () => {
    spyOn(component, 'toggleMenuCollapse');
    component.useLocalStorage = true;
    component.handleSave();
    expect(component.toggleMenuCollapse).toHaveBeenCalled();
  });

  // it('should call toggleMenuCollapse when calling handleCancel', () => {
  //   spyOn(component, 'toggleMenuCollapse');
  //   sidebarService.tempPrefs = ['test', 'test2'];
  //   fixture.detectChanges();
  //   component['favoritesChanged'] = false;
  //   component.handleCancel();
  //   expect(component.toggleMenuCollapse).toHaveBeenCalled();
  // });

  it('should set isShowCancelDialog = true when calling handleCancel', () => {
    component['favoritesChanged'] = true;
    component.handleCancel();
    expect(component.isShowCancelDialog).toBeTruthy();
  });

  it('should call saveFavoriteChanges', () => {
    spyOn(component.favoriteChanged, 'emit');
    component['favoritesChanged'] = true;
    component['saveFavoriteChanges']();
    expect(component.favoriteChanged.emit).toHaveBeenCalled();
  });

  it('should call revertFavoriteChanges', () => {
    spyOn(component, 'getFavoritesById');
    component['favoritesChanged'] = true;
    component['revertFavoriteChanges']();
    expect(component.getFavoritesById).toHaveBeenCalled();
  });

  it('should call handleCancelDialog', () => {
    spyOn(component, 'toggleMenuCollapse');
    fixture.detectChanges();
    const confirm = true;
    component.handleCancelDialog(confirm);
    expect(component.toggleMenuCollapse).toHaveBeenCalled();
  });

  it('should call handleReset', () => {
    component.isShowResetDialog = false;
    component.handleReset();
    expect(component.isShowResetDialog).toBeTrue();
  });

  it('should call handleResetDialog', () => {
    spyOn(component, 'toggleMenuCollapse');
    fixture.detectChanges();
    const confirmReset = true;
    component.originalMenuItems = [
      {
        fullPath: 'Favorites'
      }
    ];
    component.handleResetDialog(confirmReset);
    expect(component.toggleMenuCollapse).toHaveBeenCalled();
  });

  it('should call handleDrag', () => {
    fixture.detectChanges();
    const itemDragged = {};
    component.handleDrag(itemDragged);
    expect(component.handleDrag(itemDragged)).toBeFalsy();
  });

  it('should call insertAtDropLocationFavs', () => {
    fixture.detectChanges();
    const dropLabel = {
      path: 'test',
      target: {
        innerText: '',
        parentElement: {
          innerText: 'test path'
        }
      }
    };
    const itemDragged = {
      fullPath: 'favorites'
    };
    const favoritesArr = [
      {
        fullPath: 'favorites'
      }
    ];
    component.itemDragged = itemDragged;
    component.favorites = favoritesArr;
    component['favoritesChanged'] = false;
    component['insertAtDropLocationFavs'](dropLabel);
    expect(component['favoritesChanged']).toBeTrue();
  });

  it('should call insertAtDropLocation', () => {
    fixture.detectChanges();
    const dropPath = 'test';
    component.menuItems = [
      {
        path: 'test',
        fullPath: 'test',
        sidebarLabel: 'test',
        display: 'test'
      }
    ];
    component.itemDragged.fullPath = 'test';
    component['insertAtDropLocation'](dropPath);
    expect(component.menuItems.length).toEqual(1);
  });

  it('should call getPath and return Favotites', () => {
    const getPathSpy = spyOn(component as any, 'getPath');
    getPathSpy.and.callFake(() => 'Favorites');
    const idArray = ['test', 'test2'];
    component['getDropPath'](idArray);
    expect(getPathSpy).toHaveBeenCalled();
  });

  it('should call getPath return getPath', () => {
    const getPathSpy = spyOn(component as any, 'getPath');
    getPathSpy.and.callFake(() => 'test');
    const idArray = ['test', 'test2'];
    component['getDropPath'](idArray);
    expect(getPathSpy).toHaveBeenCalled();
  });

  it('should call getPath', () => {
    const mockMenuItems = [
      {
        fullPath: 'test',
        title: 'Favorites'
      }
    ];
    const searchedTerm = 'Favorites';
    component['getPath'](mockMenuItems, searchedTerm, false);
    expect(component['getPath'](mockMenuItems, searchedTerm, false)).toEqual('test');
  });

  it('should call createIdArray', () => {
    const nodeArray = [
      {
        id: 'test1'
      }
    ];
    expect(component['createIdArray'](nodeArray)).toBeTruthy();
  });

  it('should call canDropAtLocation', () => {
    component.itemDragged.fullPath = 'test/test2';
    const dropLocation = 'test/test2';
    component['canDropAtLocation'](dropLocation);
    expect(component['canDropAtLocation'](dropLocation)).toBeTrue();
  });

  it('should call addDropIndicator with id include "icon-container"', () => {
    const handleRemoveDropIndicator = spyOn(component as any, 'removeDropIndicator');
    handleRemoveDropIndicator.and.callFake(() => true);
    const handleCreateIdArray = spyOn(component as any, 'createIdArray');
    handleCreateIdArray.and.callFake(() => true);
    const handleGetDropPath = spyOn(component as any, 'getDropPath');
    handleGetDropPath.and.callFake(() => 'Favorites');
    const handleSetCurrentDropTarget = spyOn(component as any, 'setCurrentDropTarget');
    handleSetCurrentDropTarget.and.callFake(() => true);
    const dropLocation = {
      fromElement: {
        innerText: ''
      },
      srcElement: {
        id: 'icon-container',
        parentElement: '',
        previousSibling: {
          innerText: ''
        }
      }
    };
    component.itemDragged.label = '';
    component.itemDragged.isDragFavs = true;
    component.addDropIndicator(dropLocation);
    expect(handleRemoveDropIndicator).toHaveBeenCalled();
    expect(handleCreateIdArray).toHaveBeenCalled();
    expect(handleGetDropPath).toHaveBeenCalled();
    expect(handleSetCurrentDropTarget).toHaveBeenCalled();
  });

  it('should call addDropIndicator with id include "config"', () => {
    const handleRemoveDropIndicator = spyOn(component as any, 'removeDropIndicator');
    handleRemoveDropIndicator.and.callFake(() => true);
    const handleCreateIdArray = spyOn(component as any, 'createIdArray');
    handleCreateIdArray.and.callFake(() => true);
    const handleGetDropPath = spyOn(component as any, 'getDropPath');
    handleGetDropPath.and.callFake(() => 'test');
    const handleSetCurrentDropTarget = spyOn(component as any, 'setCurrentDropTarget');
    handleSetCurrentDropTarget.and.callFake(() => true);
    const handleCanDropAtLocation = spyOn(component as any, 'canDropAtLocation');
    handleCanDropAtLocation.and.callFake(() => true);
    const handleIsDropAbove = spyOn(component as any, 'isDropAbove');
    handleIsDropAbove.and.callFake(() => true);
    const dropLocation = {
      fromElement: {
        innerText: ''
      },
      srcElement: {
        id: '-config-',
        parentElement: {
          previousSibling: {
            innerText: ''
          }
        }
      }
    };
    component.itemDragged.label = '';
    component.itemDragged.isDragFavs = true;
    component.addDropIndicator(dropLocation);
    expect(handleRemoveDropIndicator).toHaveBeenCalled();
    expect(handleCreateIdArray).toHaveBeenCalled();
    expect(handleGetDropPath).toHaveBeenCalled();
    expect(handleSetCurrentDropTarget).toHaveBeenCalled();
    expect(handleCanDropAtLocation).toHaveBeenCalled();
  });

  it('should call setCurrentDropTarget', () => {
    const mockElement = document.createElement('div');
    const element = {
      srcElement: {
        id: '',
        parentElement: {
          id: 'test-config-',
          parentElement: {
            id: 'icon-container',
            previousSibling: mockElement
          }
        }
      }
    };
    const dropIndicator = 'dropIndicator';
    component['setCurrentDropTarget'](element, dropIndicator);
    expect(component.currentDropTarget).toEqual(mockElement);
  });

  it('should return false when calling isDropAbove', () => {
    component.itemDragged.label = 'test';
    const dropLabel = '';
    const handleFindMenuItem = spyOn(component as any, 'findMenuItem');
    handleFindMenuItem.and.callFake(() => [
      {
        sidebarLabel: 'test'
      }
    ]);
    component['isDropAbove'](dropLabel, false);
    expect(handleFindMenuItem).toHaveBeenCalled();
    expect(component['isDropAbove'](dropLabel, false)).toBeFalse();
  });

  it('should return true when calling isDropAbove', () => {
    const dropLabel = 'test';
    const handleFindMenuItem = spyOn(component as any, 'findMenuItem');
    handleFindMenuItem.and.callFake(() => [
      {
        sidebarLabel: 'test'
      }
    ]);
    component['isDropAbove'](dropLabel, false);
    expect(handleFindMenuItem).toHaveBeenCalled();
    expect(component['isDropAbove'](dropLabel, false)).toBeTrue();
  });

  it('should remove classList when calling removeDropIndicator', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('dropIndicatorBottom');
    mockElement.classList.add('dropIndicatorTop');
    mockElement.classList.add('test');
    component.currentDropTarget = mockElement;
    component['removeDropIndicator']();
    expect(component.currentDropTarget.classList.toString()).toEqual('test');
  });

  it('should break when fullPath includes MenuItem when calling findMenuItem', () => {
    const mockMenuItems = [
      {
        fullPath: 'test'
      }
    ];
    const handlefindMenuItem = spyOn(component as any, 'findMenuItem');
    handlefindMenuItem.and.callFake(() => [
      {
        fullPath: ''
      }
    ]);
    component['findMenuItem']('test', mockMenuItems);
    expect(handlefindMenuItem).toHaveBeenCalled();
  });

  // it('should call reorderMenuItems', () => {
  //   const preferences = [
  //     {
  //       preferences: {
  //         position: 1
  //       }
  //     }
  //   ];
  //   const handleReorderMenuItems = spyOn(component as any, 'reorderMenuItems');
  //   handleReorderMenuItems.and.callFake(() => {
  //     return ;
  //   });
  //   component['reorderSidebar'](preferences, true);
  //   expect(handleReorderMenuItems).toHaveBeenCalled();
  // });

  it('should call findMenuItemIndex when calling reorderMenuItems', () => {
    const preference = {
      fullPath: 'test/',
      preferences: {
        origPosition: 0
      }
    };
    const mockMenuItems = [
      {
        fullPath: 'test',
        children: [
          {
            fullPath: 'children/'
          }
        ]
      }
    ];
    const findMenuItemIndex = spyOn(component as any, 'findMenuItemIndex');
    findMenuItemIndex.and.callFake(() => 0);
    component['reorderMenuItems'](preference, mockMenuItems, true);
    expect(findMenuItemIndex).toHaveBeenCalled();
  });

  it('should call reorderMenuItems when calling reorderMenuItems', () => {
    const preference = {
      fullPath: 'test/',
      preferences: {
        origPosition: 0
      }
    };
    const mockMenuItems = [
      {
        fullPath: 'e',
        children: [
          {
            fullPath: 'children/'
          }
        ]
      }
    ];
    const reorderMenuItems = spyOn(component as any, 'reorderMenuItems');
    reorderMenuItems.and.callFake(() => 0);
    component['reorderMenuItems'](preference, mockMenuItems, true);
    expect(reorderMenuItems).toHaveBeenCalled();
  });

  it('should call toggleMenuCollapse when calling handleConfigure', () => {
    component.isMenuCollapsed = true;
    const toggleMenuCollapse = spyOn(component as any, 'toggleMenuCollapse');
    toggleMenuCollapse.and.callFake(() => 0);
    component.handleConfigure();
    expect(toggleMenuCollapse).toHaveBeenCalled();
  });

  it('should call toggleMenuCollapse when calling handleConfigure', () => {
    spyOn(component.configureMode, 'emit');
    component.isMenuCollapsed = true;
    const toggleMenuCollapse = spyOn(component as any, 'toggleMenuCollapse');
    component.handleConfigure();
    expect(toggleMenuCollapse).toHaveBeenCalled();
    expect(component.configureMode.emit).toHaveBeenCalled();
  });

  it('should call handleCancel when calling handleConfigure', () => {
    spyOn(component.configureMode, 'emit');
    component.isMenuCollapsed = false;
    component.isConfiguring = true;
    const handleCancel = spyOn(component as any, 'handleCancel');
    component.handleConfigure();
    expect(handleCancel).toHaveBeenCalled();
    expect(component.configureMode.emit).toHaveBeenCalled();
  });

  it('should set isConfiguring when calling handleConfigure', () => {
    spyOn(component.configureMode, 'emit');
    component.isConfiguring = false;
    component.handleConfigure();
    expect(component.isConfiguring).toBeTrue();
    expect(component.configureMode.emit).toHaveBeenCalled();
  });

  it('should call onloadViewMenu with usePathForActiveItem = true', () => {
    component.usePathForActiveItem = true;
    component.menuItems = menuItemsOnlyPath;
    spyOnProperty(router, 'url', 'get').and.returnValue('/home/customDashboard');
    component.onloadViewMenu();
    expect(menuItemsOnlyPath[0].children[1]['selected']).toBeTruthy();
  });

  it('should call noChildren with usePathForActiveItem = true', () => {
    spyOn(component.noChildClicked, 'emit');
    component.usePathForActiveItem = true;
    component.menuItems = menuItemsOnlyPath;
    spyOnProperty(router, 'url', 'get').and.returnValue('/home/customDashboard');
    const event = {
      path: 'home/customDashboard'
    };
    component.noChildren(event);
    expect(menuItemsOnlyPath[0]['parentOfSelected']).toBeTruthy();
    expect(component.noChildClicked.emit).toHaveBeenCalled();
  });

  it('should call titleClicked with usePathForActiveItem = true', () => {
    spyOn(component.menuItemClicked, 'emit');
    component.usePathForActiveItem = true;
    component.menuItems = menuItemsOnlyPath;
    spyOnProperty(router, 'url', 'get').and.returnValue('/home/dashboard');
    const event = {
      path: 'home/dashboard',
      title: 'Home',
      children: [{
        path: 'home/dashboard'
      },
      {
        path: 'home/customDashboard'
      }
      ]
    };
    component.titleClicked(event);
    expect(menuItemsOnlyPath[0]['parentOfSelected']).toBeTruthy();
    expect(component.menuItemClicked.emit).toHaveBeenCalled();
  });
});
