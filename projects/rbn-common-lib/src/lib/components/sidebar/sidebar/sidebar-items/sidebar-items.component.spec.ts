import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarModule } from '../../sidebar.module';
import { SidebarItemsComponent } from './sidebar-items.component';
import { DragDropModule } from 'primeng/dragdrop';
import { HttpClientModule } from '@angular/common/http';

describe('RbnSidebarItemsComponent', () => {
  let component: SidebarItemsComponent;
  let fixture: ComponentFixture<SidebarItemsComponent>;
  const menuItem: any = {
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

      }
    },
    {
      path: 'customDashboard',
      data: {
        menu: {
          title: 'Custom Dashboards',
          sidebarLabel: 'Custom Dashboards'
        }
      }
    }
    ]
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarItemsComponent],
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'test', component: SidebarItemsComponent}]
        ),
        SidebarModule,
        HttpClientModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarItemsComponent);
    component = fixture.componentInstance;
    component.menuItem = menuItem;
    component.favorite = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if search children', () => {
    menuItem.children[0].searched = true;
    const isChildSearch = component.isChildSearched(menuItem);
    expect(isChildSearch).toBeTruthy();
  });

  it('should return true if search children of children', () => {
    menuItem.children[0].searched = false;
    menuItem.children[0].children = [
      {
        searched: true
      }
    ];
    const isChildSearch = component.isChildSearched(menuItem);
    expect(isChildSearch).toBeTruthy();
  });

  it('should return false if item have not children', () => {
    component.menuItem = {};
    const isChildSearch = component.isChildSearched('');
    expect(isChildSearch).toBeFalsy();
  });

  it('should create Id', () => {
    const title = component.createId('title');
    expect(title).toEqual('title');
  });

  it('should set isHover properties', () => {
    component.isHover = false;
    component.hover(true);
    expect(component.isHover).toBeTruthy();
  });

  it('should set route properties', () => {
    component.route = '';
    component.link('dashboard');
    expect(component.route).toEqual('dashboard');
  });

  it('should emit toggleMenu function', () => {
    spyOn(component.toggleSubMenu, 'emit');
    component.onToggleSubMenu({}, 'dashboard');
    expect(component.toggleSubMenu.emit).toHaveBeenCalled();
  });

  // it('should emit favoriteChanged function', () => {
  //   component.menuItem.isFav = true;
  //   spyOn(component.favoriteChanged, 'emit');
  //   component.updateFavorites({}, { route: { fullPath: 'home/dashboard' } });
  //   expect(component.favoriteChanged.emit).toHaveBeenCalled();
  // });

  it('should call leafMenuClick emit when calling onNoChildren', () => {
    spyOn(component.leafMenuClick, 'emit');
    component.menuItem = {
      route: {
        fullPath: 'test'
      }
    };
    const event = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation() { }
    };
    spyOn(event as any, 'stopPropagation');
    const item = {
      routeType: ''
    };
    component.onNoChildren(event, item);
    expect(component.leafMenuClick.emit).toHaveBeenCalled();
  });

  it('should set showInSearch of item when calling updateShowInSearch', () => {
    const item = {
      expanded: true,
      children: [
        {
          showInSearch: false
        }
      ]
    };
    component['updateShowInSearch'](item);
    expect(item.children[0].showInSearch).toBeTrue();
  });

  it('should return null when calling updateShowInSearch', () => {
    const item = {
    };
    component['updateShowInSearch'](item);
    expect(component['updateShowInSearch'](item)).toBeFalsy();
  });

  it('should set pageId and action of event when calling updateFavorites', () => {
    const event = {
      pageId: '',
      action: 'test'
    };
    const item = {
      route: {
        fullPath: 'test'
      },
      isFav: false
    };
    component.updateFavorites(event, item);
    expect(event.pageId).toEqual('test');
    expect(event.action).toEqual('add');
  });

  it('should call reorder when calling handleReorder', () => {
    spyOn(component.reorder, 'emit');
    const obj = {};
    component.handleReorder(obj, true, 'test');
    expect(component.reorder.emit).toHaveBeenCalledWith({ 'direction': 'test', 'menuItem': obj, 'reorderFav': true });
  });

  it('should return false when calling isShown', () => {
    component.isHidden = true;
    component.isConfiguring = false;
    const mockMenuItem = {
      fullPath: 'test'
    };
    expect(component.isShown(mockMenuItem)).toBeFalse();
  });

  it('should call updateShowInSearch when calling isShown', () => {
    component.isSearching = true;
    const updateShowInSearch = spyOn(component as any, 'updateShowInSearch');
    const mockMenuItem = {
      fullPath: 'test',
      showInSearch: true
    };
    expect(component.isShown(mockMenuItem)).toBeTrue();
    expect(updateShowInSearch).toHaveBeenCalled();
  });

  it('should return false when calling isShown', () => {
    component.isSearching = true;
    spyOn(component as any, 'updateShowInSearch');
    const mockMenuItem = {
      fullPath: 'test'
    };
    component.menuItem = {
      searched: true
    };
    expect(component.isShown(mockMenuItem)).toBeTrue();
  });

  it('should call isChildSearched and return true when calling isShown', () => {
    component.isSearching = true;
    spyOn(component as any, 'updateShowInSearch');
    const isChildSearched = spyOn(component as any, 'isChildSearched');
    isChildSearched.and.callFake(() => true);
    const mockMenuItem = {
      fullPath: 'test',
      searched: true
    };
    expect(component.isShown(mockMenuItem)).toBeTrue();
    expect(isChildSearched).toHaveBeenCalled();
  });

  it('should return true when calling isShown', () => {
    const mockMenuItem = {
      fullPath: 'test'
    };
    expect(component.isShown(mockMenuItem)).toBeTrue();
  });

  it('should return false when calling isShown', () => {
    const mockMenuItem = {
      fullPath: 'test'
    };
    component.isSearching = true;
    spyOn(component as any, 'updateShowInSearch');
    const isChildSearched = spyOn(component as any, 'isChildSearched');
    isChildSearched.and.callFake(() => false);
    expect(component.isShown(mockMenuItem)).toBeFalse();
  });

  it('should return true when calling favIconisShown', () => {
    component.isConfiguring = true;
    component.isHover = true;
    expect(component.favIconisShown()).toBeTrue();
  });

  it('should return false when calling favIconisShown', () => {
    expect(component.favIconisShown()).toBeFalse();
  });

  it('should return null when calling handleDrag', () => {
    spyOn(component.onDragChild, 'emit');
    component.menuItem = {
      sidebarLabel: ''
    };
    const itemDragged = {
      target: {
        innerText: 'test\n'
      }
    };
    component.handleDrag(itemDragged);
    expect(component.onDragChild.emit).toHaveBeenCalled();
  });

  it('should return null when calling handleDrag', () => {
    spyOn(component.onDragChild, 'emit');
    component.menuItem = {
      sidebarLabel: 'test',
      fullPath: 'fullPath'
    };
    const itemDragged = {
      target: {
        innerText: 'test\n'
      },
      path: [
        {
          id: 'FavoritesTab'
        }
      ]
    };
    component.handleDrag(itemDragged);
    expect(component.onDragChild.emit).toHaveBeenCalledWith(
      {
        fullPath: 'fullPath',
        sidebarLabel: 'test',
        isFavoritesTab: true
      }
    );
  });

  it('should return "visible" when calling isTrashIconVisible', () => {
    component.isConfiguring = true;
    expect(component.isTrashIconVisible()).toEqual('visible');
  });

  it('should return null when calling getInitialPreferences', () => {
    expect(component['getInitialPreferences']()).toBeFalsy();
  });

  it('should set isHidden = true  when calling handleHide', () => {
    component.isHidden = false;
    component.menuItem = {
      path: 'test',
      fullPath: 'fullPath'
    };
    component.handleHide();
    expect(component.isHidden).toBeTrue();
  });

  it('should call getTagData when tag = new', () => {
    component.menuItem = {
      tag: {
        type: 'new'
      }
    };
    const result = {
      label: 'new',
      color: ''
    };
    const data = component.getTagData();
    expect(data).toEqual(result);
  });

  it('should call getTagData when tag = alpha', () => {
    component.menuItem = {
      tag: {
        type: 'alpha'
      }
    };
    const result = {
      label: 'alpha',
      color: ''
    };
    const data = component.getTagData();
    expect(data).toEqual(result);
  });

  it('should call getTagData when tag = beta', () => {
    component.menuItem = {
      tag: {
        type: 'beta'
      }
    };
    const result = {
      label: 'beta',
      color: ''
    };
    const data = component.getTagData();
    expect(data).toEqual(result);
  });

  it('should call getTagData when tag = custom', () => {
    component.menuItem = {
      tag: {
        type: 'custom',
        label: 'customUT',
        color: '#000'
      }
    };
    const result = {
      label: 'customut',
      color: '#000'
    };
    const data = component.getTagData();
    expect(data).toEqual(result);
  });

  it('should return true when calling checkExpiryTag with tag = new', () => {
    component.isShowTag = false;
    component.menuItem = {
      tag: {
        type: 'new'
      },
      data: {
        menu: {
          title: 'UT'
        }
      }
    };
    component.checkExpiryTag();
    expect(component.isShowTag).toBeTrue();
  });

  it('should return true when calling checkExpiryTag with tag = "alpha" or "beta" or custom tag with unset expiryTag', () => {
    component.isShowTag = false;
    component.menuItem = {
      tag: {
        type: 'beta'
      },
      data: {
        menu: {
          title: 'UT'
        }
      }
    };
    component.checkExpiryTag();
    expect(component.isShowTag).toBeTrue();
  });

  it('should return true when calling checkExpiryTag with custom tag', () => {
    component.isShowTag = false;
    component.menuItem = {
      tag: {
        type: 'customUT',
        expiryTag: 604800
      },
      data: {
        menu: {
          title: 'UT'
        }
      }
    };
    const existedExpiryTagSpy = spyOn(component, 'existedExpiryTag');
    existedExpiryTagSpy.and.callFake(() => false);
    component.checkExpiryTag();
    expect(component.isShowTag).toBeTrue();
  });

  it('should return true when calling existedExpiryTag', () => {
    const mockShowedTag = 'UT1,UT2';
    component.menuItem = {
      data: {
        menu: {
          title: 'UT1'
        }
      }
    };
    expect(component.existedExpiryTag(mockShowedTag)).toBeTrue();
  });

  it('should return false when calling existedExpiryTag', () => {
    const mockShowedTag = 'UT1,UT2';
    component.menuItem = {
      data: {
        menu: {
          title: 'UT'
        }
      }
    };
    expect(component.existedExpiryTag(mockShowedTag)).toBeFalsy();
  });
});

