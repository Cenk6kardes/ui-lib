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
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';

import { HttpLoaderFactory } from '../../shared/http-loader';

import { DynamicObjectComponent } from './dynamic-object.component';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields: any = [{
    key: 'testId',
    type: 'rbn-object',
    templateOptions: {
      description: 'Add another investment',
      label: 'test'
    },
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
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
    testId: [{}]
  };
  options = {};
}

describe('DynamicObjectComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicObjectComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        AccordionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormlySelectModule,
        FormlyPrimeNGModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-object',
              component: DynamicObjectComponent
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
    const el = fixture.debugElement.query(By.css(
      '.p-accordion .p-accordion-tab .p-accordion-header span.label')).nativeElement;
    expect(el.textContent).toContain(component.fields[0].templateOptions.label);
  });

  it('should have form items', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.queryAll(By.css('.p-accordion .p-accordion-content .p-inputtext'));
    expect(el.length).toEqual(component.fields[0].fieldGroup.length);
  });
});
