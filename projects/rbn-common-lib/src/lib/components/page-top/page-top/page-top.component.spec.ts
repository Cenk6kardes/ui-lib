import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageTopModule } from '../page-top.module';
import { PageTopComponent } from './page-top.component';

describe('PageTopComponent', () => {
  let component: PageTopComponent;
  let fixture: ComponentFixture<PageTopComponent>;
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
      declarations: [ PageTopComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        PageTopModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTopComponent);
    component = fixture.componentInstance;
    component.pageTop = {
      logo: {
        action: undefined,
        image: '',
        productName: ''
      },
      profiles: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          items: [
            {
              label: 'New',
              icon: 'pi pi-pencil',
              command: ($event) => {
                console.log('Edit Profile');
              }
            },
            {
              label: 'Log Out',
              icon: 'pi pi-fw pi-external-link',
              command: ($event) => {
                console.log('Log Out');
              }
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
        },
        {
          label: 'Help Center',
          icon: 'pi pi-question-circle',
          items: [
            {
              label: 'Protect Online Documentation',
              icon: 'pi pi-file-o',
              command: ($event) => {
                console.log('v20.04.00R001');
              }
            }
          ]
        },
        {
          label: 'License Report',
          icon: 'pi pi-file-o',
          items: [
            { label: '3 Active', icon: 'pi pi-star-o' },
            { label: '1 Expired', icon: 'pi pi-question-circle' }
          ]
        }
      ],
      externalSearch: {
        tableName: 'test',
        searchData: 'search',
        searchPlaceholderText: 'placeholder test'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call inputValueEv', () => {
    spyOn(component.inputValueEv, 'emit');
    fixture.detectChanges();
    const event = { value: 'test' };
    component.inputValueEvent(event);
    expect(component.inputValueEv.emit).toHaveBeenCalled();
  });

  it('should call inputValueEv when clicking clearBtnEvent', () => {
    spyOn(component.inputValueEv, 'emit');
    fixture.detectChanges();
    const event = { value: 'test' };
    component.clearBtnEvent(event);
    expect(component.inputValueEv.emit).toHaveBeenCalled();
  });

  it('should call pressEnterEvent', () => {
    spyOn(component.pressEnterEvent, 'emit');
    fixture.detectChanges();
    const event = { value: 'test' };
    component.pressEnterEv(event);
    expect(component.pressEnterEvent.emit).toHaveBeenCalled();
  });
});
