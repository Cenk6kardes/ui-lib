import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DynamicShowPasswordComponent } from './dynamic-show-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})

class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-show-password'
  }];
  form: FormGroup = new FormGroup({});
  model = {
    testId: 2
  };
  options = {};
}

describe('DynamicShowPasswordComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicShowPasswordComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input',
              extends: 'input',
              wrappers: ['rbn-show-password']
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
});
