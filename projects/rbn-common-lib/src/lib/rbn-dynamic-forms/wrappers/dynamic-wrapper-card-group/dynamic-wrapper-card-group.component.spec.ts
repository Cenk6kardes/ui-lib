import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicWrapperCardGroupComponent } from './dynamic-wrapper-card-group.component';
import { RbnDynamicFormsModule } from '../../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields: any = [{
    wrappers: ['rbn-wrapper-card-group'],
    fieldGroup: [
      {
        key: 'testId',
        type: 'rbn-input',
        templateOptions: {
          label: 'Name',
          placeholder: 'Enter name',
          type: 'email',
          email: 'test',
          required: true
        }
      }
    ]
  }];
  form: FormGroup = new FormGroup({});
  model: any = {};
  options = {};
}
@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class Test2Component {
  fields: any = [{
    wrappers: ['rbn-wrapper-card-group'],
    fieldGroup: [
      {
        key: 'testId',
        type: 'rbn-input',
        templateOptions: {
          label: 'Name',
          placeholder: 'Enter name',
          type: 'email',
          email: 'test',
          required: true
        },
        className: 'item'
      }
    ]
  }];
  form: FormGroup = new FormGroup({});
  model: any = {};
  options = {};
}

describe('DynamicWrapperCardGroupComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let component2: Test2Component;
  let fixture2: ComponentFixture<Test2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicWrapperCardGroupComponent, TestComponent, Test2Component],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input',
              extends: 'input'
            }
          ],
          wrappers: [
            { name: 'rbn-wrapper-card-group', component: DynamicWrapperCardGroupComponent }
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
    fixture2 = TestBed.createComponent(Test2Component);
    component2 = fixture2.componentInstance;
    fixture2.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with className', () => {
    expect(component2).toBeTruthy();
  });
});
