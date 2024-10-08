import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChange } from '@angular/core';
import { of } from 'rxjs';

import { SidenavComponent } from './sidenav.component';
import { SidebarModule } from '../../sidebar/sidebar.module';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  const mockSidenav = [
    {
      type: 'navigator',
      prop: {
        label: 'FM Dashboard',
        icon: 'fas fa-tachometer-alt',
        link: '/dashboard'
      }
    },
    {
      type: 'navigator',
      prop: {
        label: 'Views',
        icon: 'far fa-eye',
        link: '/views'
      }
    },
    {
      type: 'navigator',
      prop: {
        label: 'Reporting',
        icon: 'fas fa-chart-area',
        link: '',
        items: [
          {
            label: 'Templates',
            // icon: '',
            link: '/templates'
          },
          {
            label: 'Reports',
            // icon: '',
            link: '/reports'
          }
        ]
      }

    }
  ];
  class MockActiveRoute {
    url = {
      subscribe: (fname: (value: any) => void) => fname({})
    };
    constructor() {
    }
    resetRoute() {
      this.url = {
        subscribe: (fname: (value: any) => void) => fname({})
      };
    }
  }

  let originalTimeout: number;
  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
  });
  const router = {
    events: of(new NavigationEnd(0, '/dashboard', '/dashboard'))
  };
  const mockActiveRoute = new MockActiveRoute();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SidebarModule
      ],
      declarations: [SidenavComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: mockActiveRoute }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    mockActiveRoute.resetRoute();
    component.sidenavs = mockSidenav;
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call  ngOninit()', () => {
    component.setInitActiveSideNavs('/dashboard');
    const tempSidenav = [...component.sidenavs];
    tempSidenav[0].prop.isActive = true;
    tempSidenav[0].prop.expand = true;
    tempSidenav[0].prop.isFirstLoad = false;

    tempSidenav[1].prop.isActive = false;
    tempSidenav[1].prop.expand = false;
    tempSidenav[1].prop.isFirstLoad = true;
    expect(component.sidenavs).toEqual(tempSidenav);

  });

  it('should call  function setInitActiveSideNavs with defaultUrl is subMenu', () => {
    component.setInitActiveSideNavs('/templates');
    const tempSidenav = [...component.sidenavs];
    tempSidenav[0].prop.isActive = false;
    tempSidenav[0].prop.expand = false;
    tempSidenav[0].prop.isFirstLoad = true;
    tempSidenav[1].prop.isActive = false;
    tempSidenav[1].prop.expand = false;
    tempSidenav[1].prop.isFirstLoad = true;
    tempSidenav[2].prop.isActive  = true;
    tempSidenav[2].prop.items[0].isActive = true;
    tempSidenav[2].prop.expand   = true;
    tempSidenav[2].prop.isFirstLoad = false;
    expect(component.sidenavs).toEqual(tempSidenav);
  });

  it('should call function clickMenu with expand Menu', () => {
    component.clickMenu({label: 'FM Dashboard'});
    expect(component.currentActiveNav).toEqual(mockSidenav[0].prop);
  });

  it('should call function clickMenu with collapsed Menu', () => {
    component.collapsed = true;
    component.clickMenu({label: 'FM Dashboard'});
    const tempSidenav = [...component.sidenavs];
    tempSidenav[0].prop.isActive = true;
    tempSidenav[0].prop.expand = false;
    tempSidenav[0].prop.isFirstLoad = false;
    tempSidenav[1].prop.isActive = false;
    tempSidenav[1].prop.expand = false;
    tempSidenav[1].prop.isFirstLoad = true;
    tempSidenav[2].prop.isActive  = false;
    tempSidenav[2].prop.items[0].isActive = false;
    tempSidenav[2].prop.items[1].isActive = false;
    tempSidenav[2].prop.expand   = true;
    tempSidenav[2].prop.isFirstLoad = false;
    expect(component.sidenavs).toEqual(tempSidenav);
  });

  it('should call function clickSubMenu', () => {
    component.clickSubMenu({label: 'Reporting'},  {label: ''});
    const tempSidenav = [...component.sidenavs];
    tempSidenav[0].prop.isActive = true;
    tempSidenav[0].prop.expand = false;
    tempSidenav[0].prop.isFirstLoad = true;
    tempSidenav[1].prop.isActive = false;
    tempSidenav[1].prop.expand = false;
    tempSidenav[1].prop.isFirstLoad = true;
    tempSidenav[2].prop.isActive  = false;
    tempSidenav[2].prop.items[0].isActive = false;
    tempSidenav[2].prop.items[1].isActive = false;
    tempSidenav[2].prop.expand   = true;
    tempSidenav[2].prop.isFirstLoad = false;
    expect(component.sidenavs).toEqual(tempSidenav);
  });

  it('should call ngOnChanges', () => {
    const change = {
      collapsed: new SimpleChange(
        true,
        true,
        true
      ),
      defaultUrl: new SimpleChange(
        '/dashboard',
        '/views',
        true
      )
    };
    component.ngOnChanges(change);
    expect(component.collapsed).toBeTruthy();
  });
});
