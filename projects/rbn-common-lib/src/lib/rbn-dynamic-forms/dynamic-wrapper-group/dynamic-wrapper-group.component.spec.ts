import {  ComponentFixture, TestBed } from '@angular/core/testing';
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
import { AccordionModule } from 'primeng/accordion';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';

import { HttpLoaderFactory } from '../../shared/http-loader';

import { DynamicWrapperGroupComponent } from './dynamic-wrapper-group.component';
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


describe('DynamicWrapperGroupComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [DynamicWrapperGroupComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input',
              extends: 'input',
              wrappers: ['rbn-form-group']
            }
          ],
          wrappers: [
            { name: 'rbn-form-group', component: DynamicWrapperGroupComponent }
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
