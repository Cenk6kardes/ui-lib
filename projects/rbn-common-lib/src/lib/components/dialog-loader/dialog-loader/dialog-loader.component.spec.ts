import { ComponentFixture, fakeAsync, TestBed, waitForAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ScreenReaderService } from '../../../services/screen-reader.service';

import { DialogLoaderModule } from '../dialog-loader.module';
import { DialogLoaderComponent } from './dialog-loader.component';

describe('DialogLoaderComponent', () => {
  let component: DialogLoaderComponent;
  let fixture: ComponentFixture<DialogLoaderComponent>;
  const screenReader = jasmine.createSpyObj<ScreenReaderService>('screenReader', ['customizedAnnouce']);
  const translateService = jasmine.createSpyObj<TranslateService>('translateService', ['get']);
  const translateServiceMock = {
    use: translateService.get,
    get: translateService.get.and.returnValue(of(
      {
        'LOADING': 'The screen is loading',
        'STOP_LOADING': 'Stop loading'
      }
    ))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLoaderComponent],
      imports: [DialogLoaderModule],
      providers: [
        { provide: ScreenReaderService, useValue: screenReader },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load', () => {
    component.loading = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.spinner'));
    expect(element).toBeTruthy();
  });

  it('should not load', () => {
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.spinner'));
    expect(element).toBeFalsy();
  });

  it('should call ngOnChanges', fakeAsync(() => {
    component.loading = true;
    component.ngOnChanges();
    tick(100);
    expect(screenReader.customizedAnnouce).toHaveBeenCalled();
    component.loading = false;
    component.ngOnChanges();
    tick(100);
    expect(screenReader.customizedAnnouce).toHaveBeenCalled();
  }));

});
