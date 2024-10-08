import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicFileInputComponent } from './dynamic-file-input.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-input-file',
    templateOptions: {
      label: 'File upload:',
      onChange: jasmine.createSpy('onChange'),
      onRemove: jasmine.createSpy('onRemove')
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
  };
  options = {};
}

describe('DynamicFileInputComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFileInputComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input-file',
              component: DynamicFileInputComponent
            }
          ]
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input file', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.input-file'));
    expect(el).toBeTruthy();
  });

  it('should have button upload', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-button')).nativeElement;
    expect(el).toBeTruthy();
  });

  it('should have button remove', () => {
    component.model.testId = { name: 'test' };
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-button'));
    el.nativeElement.click();
    fixture.detectChanges();
    expect(component.model.testId).toBeUndefined();
    expect(component.fields[0].templateOptions.onRemove).toHaveBeenCalled();
  });

  it('should call handleFileInput', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.input-file'));
    const blob = new Blob([''], { type: 'text/html' });
    const file = <File>blob;
    const fileList: FileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file
    };
    el.triggerEventHandler('change', {
      target: {
        files: fileList
      }
    });
    fixture.detectChanges();
    expect(component.fields[0].templateOptions.onChange).toHaveBeenCalledWith(fileList);
  });

  it('should call clickInput', () => {
    component.model.testId = {};
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-button'));
    el.nativeElement.click();
    fixture.detectChanges();
    expect(component.model.testId).toEqual({});
  });
});
