import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicSingleselectComponent } from './dynamic-singleselect.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-singleselect',
    templateOptions: {
      placeholder: 'placeholder',
      options: [
        { value: '1', label: 'Soccer' },
        { value: '2', label: 'Basketball' },
        { value: '3', label: 'Martial Arts' }
      ]
    }
  }];
  form: FormGroup = new FormGroup({});
  model = {
    testId: '2'
  };
  options = {};
}

describe('DynamicSingleselectComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSingleselectComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-singleselect',
              component: DynamicSingleselectComponent
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

  it('should have dropdown', () => {
    const el = fixture.debugElement.query(By.css('.p-dropdown'));
    expect(el).toBeTruthy();
  });

  it('should select item when init in model', () => {
    const el = fixture.debugElement.query(By.css('.p-dropdown .p-dropdown-label')).nativeElement;
    expect(el.textContent).toBe(component.fields[0].templateOptions.options[1].label);
  });

  it('should have dropdown item', () => {
    const dropdown = fixture.debugElement.query(By.css('.p-dropdown')).nativeElement;
    dropdown.click();
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-dropdown .p-dropdown-item'));
    expect(el.length).toBe(3);
  });
});
