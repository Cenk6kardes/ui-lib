import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController } from '@angular/common/http/testing';

import { LogoutComponent } from './logout.component';
import { ProfileModule } from '../profile.module';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
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
      declarations: [LogoutComponent],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        ProfileModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title ', () => {
    component.customMsg = {
      title: '',
      content: '',
      titleAccept: '',
      titleReject: ''
    };
    component.ngOnInit();
    expect(component.loadingTranslate).toBeFalse();
  });

  it('should call onConfirmLogout', () => {
    spyOn(component.confirmLogout, 'emit');
    const event = {};
    component.onConfirmLogout(event);
    expect(component.confirmLogout.emit).toHaveBeenCalled();
  });
});
