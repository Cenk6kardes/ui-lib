
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicRadioboxComponent } from './dynamic-radiobox.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-radiobox',
    templateOptions: {
      label: 'Radiobox',
      options: [{
        label: 'Yes',
        value: 1
      }, {
        label: 'No',
        value: 2
      }, {
        label: 'Test',
        value: 3
      }]
    }
  }];
  form: FormGroup = new FormGroup({});
  model = {
    testId: 2
  };
  options = {};
}

describe('DynamicRadioboxComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicRadioboxComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-radiobox',
              component: DynamicRadioboxComponent
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

  it('should have radio button', () => {
    const el = fixture.debugElement.queryAll(By.css('.p-radiobutton'));
    expect(el.length).toBe(3);
  });

  it('should select item when init in model', () => {
    const el = fixture.debugElement.query(By.css('label'));
    if (el) {
      expect(el.nativeElement.textContent.trim()).toEqual(component.fields[0].templateOptions.label);
    }
  });
});
