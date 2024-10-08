import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { HttpLoaderFactory } from '../../shared/http-loader';

import { DynamicArrayComponent } from './dynamic-array.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { AccordionModule } from 'primeng/accordion';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields: any = [{
    key: 'testId',
    type: 'rbn-array',
    templateOptions: {
      addText: 'Add another investment',
      minItems: 0,
      maxItems: 4,
      label: 'test'
    },
    fieldArray: {
      fieldGroup: [
        {
          type: 'rbn-input',
          key: 'investmentName',
          templateOptions: {
            label: 'Name of Investment:',
            required: true
          }
        },
        {
          type: 'rbn-input',
          key: 'investmentDate',
          templateOptions: {
            type: 'date',
            label: 'Date of Investment:'
          }
        },
        {
          type: 'rbn-input',
          key: 'stockIdentifier',
          templateOptions: {
            label: 'Stock Identifier:'
          }
        }
      ]
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
    testId: [{}]
  };
  options = {};
}

describe('DynamicArrayComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicArrayComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-array',
              component: DynamicArrayComponent
            },
            {
              name: 'rbn-input',
              extends: 'input'
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

  it('should have label', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-accordion .p-accordion-header .label')).nativeElement;
    expect(el.textContent).toContain(component.fields[0].templateOptions.label);
  });

  it('should have form items', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-accordion .p-inputtext'));
    expect(el.length).toEqual(component.fields[0].fieldArray.fieldGroup.length);
  });

  it('should have remove button when not has minItems', () => {
    component.fields[0].templateOptions.minItems = undefined;
    component.fields[0].templateOptions.options = undefined;
    component.model.testId = [{}, {}];
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.p-accordion .wrapper-field .p-button')).nativeElement;
    button.click();
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-accordion formly-group'));
    expect(el.length).toEqual(1);
  });

  it('should have remove button when has minItems and templateOptions.options', () => {
    component.fields[0].templateOptions.minItems = 1;
    component.fields[0].templateOptions.options = [6];
    component.model.testId = [{}, {}];
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.p-accordion .wrapper-field .p-button')).nativeElement;
    button.click();
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-accordion formly-group'));
    expect(el.length).toEqual(1);
  });

  it('should hide remove button', () => {
    component.fields[0].templateOptions.minItems = 1;
    component.fields[0].templateOptions.fixedIndexs = [0];
    component.model.testId = [{}, {}];
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.p-accordion .wrapper-field .p-button'));
    const el = fixture.debugElement.queryAll(By.css('.p-accordion formly-group'));
    expect(el.length).toEqual(2);
    expect(el.length).toBeGreaterThan(button.length);
  });

  it('should have add button when not has maxItems', () => {
    component.fields[0].templateOptions.minItems = 9;
    component.fields[0].templateOptions.maxItems = undefined;
    component.model.testId = [{}];
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.p-accordion .p-accordion-header .p-button')).nativeElement;
    button.click();
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-accordion formly-group'));
    expect(el.length).toEqual(2);
  });

});
