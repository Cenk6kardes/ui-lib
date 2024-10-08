import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { DynamicFormComponent } from './dynamic-form.component';
import { RbnDynamicFormsModule } from '../rbn-dynamic-forms.module';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RbnDynamicFormsModule,
        FormlyModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.fields = [{
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
        pattern: 'test',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        change: (field, $event) => { }
      }
    },
    { fieldGroup: [{ key: ['Username'], templateOptions: { options: [] } }] }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleControlEvent', () => {
    spyOn(component, 'populateFields');
    component.form = new FormGroup({
      'Username': new FormControl('', Validators.required),
      'Password': new FormControl('', Validators.required)
    });
    const obj = {
      method: 'GET',
      url: '/test',
      params: [
        'Username'
      ],
      onSuccess: {
        action: 'populateDropdown',
        controls: 'Username'
      }
    };
    component.handleControlEvent(obj);
    expect(component.populateFields).toHaveBeenCalled();
    obj.onSuccess.action = 'changeValues';
    component.handleControlEvent(obj);
    expect(component.populateFields).toHaveBeenCalled();
  });

  it('should call populateFields', () => {
    const formFields: any[] = [
      { fieldGroup: [{ key: ['Username'], templateOptions: { options: [] } }] }
    ];
    component.populateFields(formFields, 'Username', { Username: 'admin' });
    expect((formFields[0].fieldGroup)[0].templateOptions.options).toEqual('admin');
  });

  it('should call addPropertyAndEventsToFormFields with events', () => {
    spyOn(component, 'handleControlEvent');
    const mockField: any = {};
    Object.assign(mockField, component.formFields[0]);
    mockField.events = {
      onChange: [{ action: 'delete', values: ['admin'] }]
    };
    component.addPropertyAndEventsToFormFields(mockField);
    mockField.templateOptions.change(component.formFields, { action: 'delete', value: 'admin' });
    expect(component.handleControlEvent).toHaveBeenCalled();
  });
});
