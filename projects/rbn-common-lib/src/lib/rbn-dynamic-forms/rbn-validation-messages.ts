import { FormlyFieldConfig } from '@ngx-formly/core';

export function requiredValidationMessage(err, field: FormlyFieldConfig) {
  return `${field.templateOptions.label} is required`;
}

export function minValidationMessage(err, field: FormlyFieldConfig) {
  return `Minimum value for  ${field.templateOptions.label} can be ${err.min}`;
}

export function maxValidationMessage(err, field: FormlyFieldConfig) {
  return `Maximum value for  ${field.templateOptions.label} can be ${err.max}`;
}

export function IpValidatorMessage(err, field: FormlyFieldConfig) {
  return `${field.formControl.value} is not a valid IP Address`;
}

export function Ipv4v6ValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please enter valid IPv4 or IPv6 IP.';
}

export function IntegerValidatorMessage(err, field: FormlyFieldConfig) {
  return 'This value should be a valid integer';
}

export function Ipv6ValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please enter valid IPv6 IP.';
}

export const RbnValidationMessages = [
  { name: 'required', message: requiredValidationMessage },
  { name: 'min', message: minValidationMessage },
  { name: 'max', message: maxValidationMessage },
  { name: 'ip', message: IpValidatorMessage },
  { name: 'integer', message: IntegerValidatorMessage},
  { name: 'ipPattern', message: Ipv4v6ValidatorMessage},
  { name: 'ipv6Pattern', message: Ipv6ValidatorMessage}
];

