import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicMultiselectComponent } from './dynamic-multiselect.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-multiselect',
    templateOptions: {
      label: 'Flavor',
      placeholder: 'Placeholder',
      description: 'Description',
      required: true,
      multiple: true,
      uniqueItems: true,
      options: [
        { value: 1, label: 'Vanilla' },
        { value: 2, label: 'Cherry' },
        { value: 3, label: 'Grape' },
        { value: 4, label: 'Peach' }
      ],
      change: jasmine.createSpy('change')
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
  };
  options = {};
}

describe('DynamicMultiselectComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicMultiselectComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        RbnDynamicFormsModule,
        BrowserAnimationsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-multiselect',
              component: DynamicMultiselectComponent
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

  it('should have multiselect', () => {
    const el = fixture.debugElement.query(By.css('.p-multiselect'));
    expect(el).toBeTruthy();
  });

  it('should have placeholder', () => {
    const el = fixture.debugElement.query(By.css('.p-multiselect .p-multiselect-label')).nativeElement;
    expect(el.textContent).toEqual(component.fields[0].templateOptions.placeholder);
  });

  it('should have multiselect item', () => {
    const multiselect = fixture.debugElement.query(By.css('.p-multiselect')).nativeElement;
    multiselect.click();
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-multiselect .p-multiselect-item'));
    expect(el.length).toBe(component.fields[0].templateOptions.options.length);
  });

  it('should select item when init in model', () => {
    component.model.testId = { value: 2, label: 'Cherry' };
    component.form.get('testId').setValue([component.model.testId.value]);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-multiselect-label-container')).nativeElement;
    expect(el.textContent).toBe(component.fields[0].templateOptions.options[1].label);
  });

  it('should call onChange', () => {
    const dropdown = fixture.debugElement.query(By.css('.p-multiselect')).nativeElement;
    dropdown.click();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-multiselect .p-multiselect-item')).nativeElement;
    el.click();
    fixture.detectChanges();
    expect(component.fields[0].templateOptions.change).toHaveBeenCalled();
  });
});
