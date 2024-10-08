import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { FormToolbarComponent } from './form-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormToolbarModule } from '../form-toolbar.module';

describe('FormToolbarComponent', () => {
  let component: FormToolbarComponent;
  let fixture: ComponentFixture<FormToolbarComponent>;
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
      declarations: [FormToolbarComponent],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        FormToolbarModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call emit when secondaryClick ', () => {
    spyOn(component.buttonClickedEmit, 'emit');
    fixture.detectChanges();
    component.secondaryClick();
    expect(component.buttonClickedEmit.emit).toHaveBeenCalled();
  });

  it('should call emit when primaryClick ', () => {
    spyOn(component.buttonClickedEmit, 'emit');
    fixture.detectChanges();
    component.primaryClick();
    expect(component.buttonClickedEmit.emit).toHaveBeenCalled();
  });
});
