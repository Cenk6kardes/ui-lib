import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicWrapperFieldComponent } from './dynamic-wrapper-field.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields: any = [{
    key: 'testId',
    type: 'rbn-input',
    templateOptions: {
      label: 'Name',
      placeholder: 'Enter name',
      type: 'email',
      email: 'test',
      required: true
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {};
  options = {};
}

describe('DynamicWrapperFieldComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicWrapperFieldComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input',
              extends: 'input',
              wrappers: ['rbn-wrapper-field']
            }
          ],
          wrappers: [
            { name: 'rbn-wrapper-field', component: DynamicWrapperFieldComponent }
          ],
          validationMessages: [{ name: 'required', message: 'test required' }]
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

});
