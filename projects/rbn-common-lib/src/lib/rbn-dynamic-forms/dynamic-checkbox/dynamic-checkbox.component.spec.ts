import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicCheckboxComponent } from './dynamic-checkbox.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: ['testId'],
    type: 'rbn-checkbox',
    templateOptions: {
      label: 'Checkbox',
      value: true
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
    'testId': '1'
  };
  options = {};
}

describe('DynamicCheckboxComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicCheckboxComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-checkbox',
              component: DynamicCheckboxComponent
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

  it('should have checkbox', () => {
    const el = fixture.debugElement.query(By.css('p-checkbox'));
    expect(el).toBeTruthy();
  });

  it('should have value on when init in model', () => {
    component.model.testId = true;
    component.form.get('testId').setValue(component.model.testId);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('p-checkbox label')).nativeElement;
    expect(el.textContent).toEqual(component.fields[0].templateOptions.label);
  });
});
