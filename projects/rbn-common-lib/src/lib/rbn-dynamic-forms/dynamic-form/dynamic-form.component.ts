import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '../services/dynamic-form.service';
import { RestService } from '../../services/rest.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent {

  formFields: Array<FormlyFieldConfig> = [];
  @Input() form: FormGroup;
  @Input() model;
  @Input()
  set fields(value: FormlyFieldConfig[]) {
    // this.formFields = value;
    this.configureFields(value);
    this.formFields = value;
  }
  @Output() dropdownChangeEvent = new EventEmitter();
  @Output() fileChangeEvent = new EventEmitter();

  mapOfKeyAndFields = new Map();

  constructor(
    private formService: DynamicFormService,
    private restService: RestService
  ) { }

  configureFields(fields) {

    fields.forEach(field => {
      // if the field is a formGroup, then iterate over all controls of this group
      if (field.fieldGroup) {
        // iterate over group controls
        this.configureFields(field.fieldGroup);
      } else {
        this.mapOfKeyAndFields.set(field.key, field);
        this.addPropertyAndEventsToFormFields(field);
      }
    });
  }

  /**
   * The function adds or modify, events or values to field properties
   * @param field FormFieldConfig
   */
  addPropertyAndEventsToFormFields(field) {
    /**
     * key is converted to array because key might be 'com.abc.xyz'.
     * If it is not converted to array, then it creates nested formGroups com -> abc -> xyz
     */
    field.key = [field.key];

    // if pattern key is present, convert it from string to RegExp
    if (field.templateOptions && field.templateOptions.pattern) {
      field.templateOptions.pattern = new RegExp(field.templateOptions.pattern);
    }
    if (field['type'] === 'rbn-file-uploads') {
      if (!field.templateOptions.change) {
        field.templateOptions.change = (files: any, event: any) => {
          this.fileChangeEvent.emit({ files, event });
          console.log('rbn-file-uploads templateOptions');
        };
      }
    }

    if (field['type'] === 'rbn-singleselect') {
      if (!field.templateOptions.change) {
        field.templateOptions.change = (field1: any, event: any) => {
          this.dropdownChangeEvent.emit({ field, value: event.value });
        };
      }
    }
    const events = field['events'];
    // If fields have some action property
    if (events) {
      if (events.onChange) {
        // field['changeOptions'] = fieldActions.change;
        field.templateOptions.change = (formField, event) => {
          events.onChange.forEach(item => {
            if (item.values.indexOf(event.value) > -1) {
              this.handleControlEvent(item.action);
            }
          });
          // this.onFieldChange(field.actions.change);
        };
      }
    }
    let url = field['optionsFromUrl'];
    if(url) {
      if(field['apiType'] === 'POST'){
        const requestBody = field['requestBody'];
        const reqbody = this.model[requestBody[0]['useModelValue']];
        this.restService.post(url, reqbody).subscribe(res => field.templateOptions.options = res.body);
      } else {
        // check for queryParams
        if (field['urlQueryParams']) {
          // add queryParams to url
          const queryParamsArray = field['urlQueryParams'];
          let queryParamString = '';
          queryParamsArray.forEach((queryParam: any) => {
            if (queryParam['useModelValue']) {
              queryParam.value = this.model[queryParam['useModelValue']];
            }
            queryParamString += `&${queryParam.key}=${queryParam.value}`;
          });
          url += queryParamString.replace('&', '?');
        }
        this.restService.get(url).subscribe(res => field.templateOptions.options = res.body);
      }
    }
    if (field.validators && field.validators.validation && !Array.isArray(field.validators.validation)) {
      field.validators.validation = [field.validators.validation];
    }
  }

  handleControlEvent({ method, url, params, onSuccess }) {
    if (method === 'GET') {
      let queryParams = '';
      if (params && params.length > 0) {
        // create query string
        queryParams = '?';
        params.forEach(paramName => {
          const parameterValue = this.form.get([paramName])?.value;
          queryParams += `${paramName}=${parameterValue}&`;
        });
        // remove last & from queryParms
        queryParams = queryParams.slice(0, queryParams.length - 1);
      }
      this.formService.getEvent(url + queryParams).subscribe(data => {
        if (onSuccess) {
          switch (onSuccess.action) {
            case 'populateDropdown':
              // get dropdown controls whose values should be populated using this response
              const controls = onSuccess.controls;
              // iterate over formFields
              this.populateFields(this.formFields, controls, data);
              break;
            case 'changeValues':
              // add logic to handle it
              break;
          }
        }
      });
    }
  }

  populateFields(fields, controls, response) {

    fields.forEach(field => {
      // if the field is a formGroup, then iterate over all controls of this group
      if (field.fieldGroup) {
        // iterate over group controls
        this.populateFields(field.fieldGroup, controls, response);
      } else {
        const key = field.key[0];
        if (controls.indexOf(key) > -1) {
          field.templateOptions.options = response[key];
        }
      }
    });
  }

  populateDropdown(key, options) {
    const field = this.mapOfKeyAndFields.get(key);
    field.templateOptions.options = options;
  }

  getDynamicFormControl(key) {
    return this.mapOfKeyAndFields.get(key);
  }

}
