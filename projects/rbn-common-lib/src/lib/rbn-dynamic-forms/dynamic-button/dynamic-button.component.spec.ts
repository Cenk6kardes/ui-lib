import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicButtonComponent } from './dynamic-button.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

@Component({
  selector: 'rbn-form-test',
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'
})
class TestComponent {
  fields = [{
    key: 'testId',
    type: 'rbn-button',
    templateOptions: {
      text: 'Test Button',
      onClick: jasmine.createSpy('onClick')
    }
  }];
  form: FormGroup = new FormGroup({});
  model: any = {
  };
  options = {};
}

describe('DynamicButtonComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicButtonComponent, TestComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'rbn-button',
              component: DynamicButtonComponent
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

  it('should have button', () => {
    const el = fixture.debugElement.query(By.css('.p-button'));
    expect(el).toBeTruthy();
  });

  it('should have label', () => {
    const el = fixture.debugElement.query(By.css('.p-button')).nativeElement;
    expect(el.textContent).toEqual(component.fields[0].templateOptions.text);
  });

  it('should have call function when click button', () => {
    const el = fixture.debugElement.query(By.css('.p-button')).nativeElement;
    el.click();
    fixture.detectChanges();
    expect(component.fields[0].templateOptions.onClick).toHaveBeenCalled();
  });
});
