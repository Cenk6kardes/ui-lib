import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RbnCommonLibModule } from '../../../public_api';

@Component({
  selector: 'rbn-dynamic-form-multi-column',
  template: '<dynamic-form [model]="model" [fields]="fields"></dynamic-form>'
})
class DynamicFormMultiColumnComponent implements OnInit {
  fields: FormlyFieldConfig[];
  model = {};

  ngOnInit() {
    const className = 'p-col-12 p-md-6 p-lg-6 p-xl-4';
    this.fields = [
      {
        'wrappers': [
          'rbn-form-group'
        ],
        'templateOptions': {
          'label': 'LDAP Realm Properties',
          'selected': true
        },
        'fieldGroup': [
          {
            'key': 'ldap.url',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'LDAP server URL',
              'required': true,
              'description': 'The fully qualified domain name of LDAP server'
            },
            'id': 'ldap.url',
            'defaultValue': 'ldap://',
            'className': className
          },
          {
            'key': 'ldap.systemUsername',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'System Username',
              'required': true,
              'description': 'The system username required to connect to the LDAP server.'
            },
            'id': 'ldap.systemUsername',
            'className': className
          },
          {
            'key': 'ldap.systemPassword',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'password',
              'label': 'System Password',
              'required': true,
              'description': 'The system password required to connect to the LDAP server.'
            },
            'id': 'ldap.systemPassword',
            'className': className
          },
          {
            'key': 'ldap.userDnTemplate',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'User DN Template',
              'required': true,
              'description': 'The template for mapping the structure of the data as defined within the LDAP.'
            },
            'id': 'ldap.userDnTemplate',
            'className': className
          },
          {
            'key': 'ldap.searchBase',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'Search Base',
              'required': true,
              'description': 'The base search filter to search for users in LDAP.'
            },
            'id': 'ldap.searchBase',
            'className': className
          },
          {
            'key': 'ldap.searchFilter',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'Search Filter',
              'required': true,
              'description': 'The search filter to find users on LDAP server.'
            },
            'id': 'ldap.searchFilter',
            'className': className
          },
          {
            'key': 'ldap.referral',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'Referral',
              'required': true,
              'description': 'The flag to enable referrals.'
            },
            'id': 'ldap.referral',
            'defaultValue': 'ignore',
            'className': className
          },
          {
            'key': 'ldap.returningAttribute',
            'type': 'rbn-input',
            'templateOptions': {
              'type': 'text',
              'label': 'Returning Attribute',
              'required': true,
              'description': 'The name of the attribute used to retrieve the User Group value from the LDAP search.'
            },
            'id': 'ldap.returningAttribute',
            'className': className
          },
          {
            'key': 'ldap.ignorePartialResultException',
            'type': 'rbn-switch',
            'templateOptions': {
              'label': 'Ignore Partial Result Exception',
              'required': true,
              'description': 'The flag for LDAP to ignore partial result exception.'
            },
            'id': 'ldap.ignorePartialResultException',
            'defaultValue': true,
            'className': className
          },
          {
            'key': 'ldap.testConnectionButton',
            'type': 'rbn-button',
            'templateOptions': {
              'text': 'Test Connection',
              'icon': 'pi pi-pw pi-check'
            },
            'id': 'ldap.testConnectionButton',
            'className': 'p-col-12 p-pr-5 p-d-flex p-jc-end'
          }
        ],
        'fieldGroupClassName': 'p-grid p-fluid'
      }
    ];
  }
}

export default {
  title: 'rbn-dynamic-forms/DynamicFormMultiColumns',
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({
      declarations: [DynamicFormMultiColumnComponent],
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ],
      providers: [TranslateService]
    })
  ]
};

export const dynamic_form_multi_column = () => ({
  template: '<rbn-dynamic-form-multi-column></rbn-dynamic-form-multi-column>'
});
