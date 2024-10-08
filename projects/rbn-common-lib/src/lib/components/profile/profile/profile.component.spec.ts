import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChanges, SimpleChange } from '@angular/core';

import { ProfileModule } from '../profile.module';
import { HttpClientModule } from '@angular/common/http';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        BrowserAnimationsModule,
        ProfileModule,
        HttpClientModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.profiles = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Log Out',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'System Information',
        icon: 'pi pi-info-circle',
        items: [
          {
            label: 'v20.04.00R001',
            icon: 'pi pi-star-o'
          }
        ]
      }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set item.disabled when call checkItem', () => {
    const mockRs = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          { label: 'New', icon: 'pi pi-pencil', disabled: true },
          { label: 'Log Out', icon: 'pi pi-fw pi-external-link', disabled: true }],
        disabled: true
      },
      {
        label: 'System Information',
        icon: 'pi pi-info-circle',
        items: [
          { label: 'v20.04.00R001', icon: 'pi pi-star-o', disabled: true }
        ],
        disabled: true
      }
    ];
    component.checkItem(component.profiles);
    expect(component.profiles).toEqual(mockRs);
  });

  it('should call onChanges', () => {
    const checkItem = spyOn(component, 'checkItem');
    const currentValue = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Log Out',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      }
    ];
    const previousValue = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Log Out Test',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      }
    ];
    const changesObj: SimpleChanges = {
      profiles: new SimpleChange(previousValue, currentValue, false)
    };
    component.ngOnChanges(changesObj);
    expect(component.checkItem).toHaveBeenCalled();
  });

  it('should set item.disabled = false when call checkItem', () => {
    const mockRs = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        url: 'test',
        disabled: true
      },
      {
        label: 'System Information',
        icon: 'pi pi-info-circle',
        disabled: true
      }
    ];
    component.checkItem(mockRs);
    expect(mockRs[0].disabled).toBeFalse();
  });
});

