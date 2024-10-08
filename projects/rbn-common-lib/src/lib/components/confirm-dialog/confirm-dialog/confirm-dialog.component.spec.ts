import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogModule } from '../confirm-dialog.module';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
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
      declarations: [ConfirmDialogComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ConfirmDialogModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call accept', () => {
    spyOn(component.emitConfirm, 'emit');
    component.accept();
    expect(component.emitConfirm.emit).toHaveBeenCalledWith(true);
  });

  it('should call reject', () => {
    spyOn(component.emitConfirm, 'emit');
    component.reject();
    expect(component.emitConfirm.emit).toHaveBeenCalledWith(false);
  });

  it('should be a title', () => {
    component.title = 'test';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.p-dialog-title'));
    expect(element.nativeElement.textContent.trim()).toEqual('test');
  });

  it('should be a content', () => {
    component.content = 'this is a content';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.p-dialog-content'));
    expect(element.nativeElement.textContent.trim()).toEqual('this is a content');
  });
});
