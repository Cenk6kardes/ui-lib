import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicPanelComponent } from './dynamic-panel.component';
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
      required: true,
      cancel: jasmine.createSpy('cancel'),
      submit: jasmine.createSpy('cancel')
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {};
  options = {};
}

describe('DynamicPanelComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicPanelComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-input',
              extends: 'input',
              wrappers: ['rbn-form-panel']
            }
          ],
          wrappers: [
            { name: 'rbn-form-panel', component: DynamicPanelComponent }
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

  it('should have label', () => {
    const el = fixture.debugElement.query(By.css('.container-dynamic-panel .p-panel-title')).nativeElement;
    expect(el.textContent).toContain(component.fields[0].templateOptions.label);
  });

  it('should have buttons', () => {
    const el = fixture.debugElement.queryAll(By.css('.container-dynamic-panel .p-toolbar-group-right .p-button'));
    expect(el.length).toEqual(2);
  });

  it('should call cancelEvent', () => {
    const el = fixture.debugElement.queryAll(By.css('.container-dynamic-panel .p-toolbar-group-right .p-button'))[0].nativeElement;
    el.click();
    fixture.detectChanges();
    expect(component.fields[0].templateOptions.cancel).toHaveBeenCalled();
  });

  it('should call submitEvent', () => {
    const el = fixture.debugElement.queryAll(By.css('.container-dynamic-panel .p-toolbar-group-right .p-button'))[1].nativeElement;
    el.click();
    fixture.detectChanges();
    expect(component.fields[0].templateOptions.submit).toHaveBeenCalled();
  });
});
