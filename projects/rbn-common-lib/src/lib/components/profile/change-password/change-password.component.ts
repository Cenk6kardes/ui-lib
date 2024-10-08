import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPwValidationConfig } from '../../../models/password-validation';

import { FormToolbarEmit } from '../../form-toolbar/form-toolbar.model';

@Component({
  selector: 'rbn-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  pwdData: any;
  passwordForm: FormGroup;
  resetPwdData = false;

  @Input() emitDataWithoutSubmit = false;
  @Input() idChangePwd = '';
  @Input() overridePwConfig: IPwValidationConfig;

  @Output() passworDataEmit = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      expwd: new FormControl(null, [Validators.required]),
      pwd: new FormControl(this.pwdData)
    });

    this.passwordForm.valueChanges.subscribe(values => {
      if (this.passwordForm.valid) {
        this.emitPasswordData(false, values);
      } else {
        this.emitPasswordData(false, null);
      }
    });
  }

  onButtonClick($event) {
    switch ($event) {
      case FormToolbarEmit.primary:
        this.emitPasswordData(true, this.passwordForm.value);
        break;
      case FormToolbarEmit.secondary:
        this.resetPasswordForm();
        this.emitPasswordData(false, null);
        break;
    }
  }

  emitPasswordData(submit: boolean, data: any) {
    if (this.emitDataWithoutSubmit) {
      this.passworDataEmit.emit({ submit: submit, data });
    } else {
      this.passworDataEmit.emit(data);
    }

  }

  getPasswordData($event): void {
    if ($event === false) {
      this.pwdData = '';
    }
    this.pwdData = $event;
    this.updateFormControlValue('pwd', this.pwdData);
  }

  updateFormControlValue(formControl: string, value: any) {
    if (this.passwordForm.get(formControl)) {
      this.passwordForm.get(formControl).setValue(value);
      this.passwordForm.updateValueAndValidity();
    }
  }

  resetPasswordForm() {
    this.resetPwdData = !this.resetPwdData;
    this.pwdData = '';
    if (this.passwordForm) {
      this.passwordForm.reset();
      const elements = this.elementRef.nativeElement.querySelectorAll('.p-password-input');
      if (elements && elements.length > 0) {
        [...elements].forEach((ele) => {
          ele.value = '';
        });
      }
    }
  }

  setDisableBtnSave() {
    let inValidForm = false;
    if (!this.pwdData || !this.passwordForm || this.passwordForm.invalid) {
      inValidForm = true;
    }
    return inValidForm;
  }
}
