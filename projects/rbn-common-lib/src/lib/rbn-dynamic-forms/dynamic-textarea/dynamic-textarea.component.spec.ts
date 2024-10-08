import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicTextareaComponent } from './dynamic-textarea.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-textarea',
    templateOptions: {
      placeholder: 'Enter your text',
      label: 'Comments'
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
  };
  options = {};
}

describe('DynamicTextareaComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicTextareaComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-textarea',
              component: DynamicTextareaComponent
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have textarea', () => {
    const el = fixture.debugElement.query(By.css('textarea'));
    expect(el).toBeTruthy();
  });

  it('should have placeholder', () => {
    const el = fixture.debugElement.query(By.css('textarea')).nativeElement;
    expect(el.placeholder).toEqual(component.fields[0].templateOptions.placeholder);
  });

  it('should have value on when init in model', () => {
    component.model.testId = 'test';
    component.form.get('testId').setValue(component.model.testId);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('textarea')).nativeElement;
    expect(el.value).toEqual(component.model.testId);
  });
});
