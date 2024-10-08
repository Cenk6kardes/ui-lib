import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IPwValidationConfig } from '../../../models/password-validation';

@Component({
  selector: 'rbn-password-validation',
  templateUrl: './password-validation.component.html',
  styleUrls: ['./password-validation.component.scss']
})
export class PasswordValidationComponent implements OnInit, OnChanges {

  @Input() usePasswordPolicy = true;
  @Input() pwNoSpecialCharacter = true;
  @Input() requiredSpecialCharacter = false;
  @Input() specialCharacterList: RegExp;
  @Input() minLength = 6;
  @Input() maxLength = 32;

  @Input() usePasswordRequired = false;

  @Input() resetPwdData = false;
  // Use for display element on HTML
  @Input() idElm = 'pwdConfirm';
  @Input() pwdClass = '';
  @Input() displayInRow = false;
  @Input() overridePwConfig: IPwValidationConfig;
  @Input() isToggleMask = true;

  @Output() passwordData = new EventEmitter();

  checkClass = '';
  passwordForm: FormGroup;
  validatorMessages: any;
  notMatchMessage: string;
  defaultSpecialCharacterList = /(?=.*[!@#$%^&*])/;
  translateResults: any = {};

  constructor(private translateService: TranslateService, private elementRef: ElementRef, private liveAnnouncer: LiveAnnouncer) {
    this.translateService.get(['VALIDATION.PASSWORD', 'PASSWORD']).subscribe(res => {
      const validationTrans = res['VALIDATION.PASSWORD'] || {};
      this.translateResults = res;
      const passwordTrans = res.PASSWORD || {};
      if (this.usePasswordPolicy) {
        this.validatorMessages = {
          required: validationTrans.REQUIRED.replace('{min}', this.minLength).replace('{max}', this.maxLength),
          beginLetter: validationTrans.BEGIN_LETTER,
          containUpperAndLower: validationTrans.CONTAIN_UPER_LOWER,
          containNumber: validationTrans.CONTAIN_NUMBER,
          containSpecialCharacter: validationTrans.CONTAIN_SPECIAL_CHARACTER + ' (' + this.getStringOfSpecialCharacterList() + ')'
        };
        if (this.pwNoSpecialCharacter) {
          this.validatorMessages.noSpecialCharacter = validationTrans.NO_SPECIAL_CHARACTER;
          delete this.validatorMessages.containSpecialCharacter;
        }
      }
      this.notMatchMessage = validationTrans.NOT_MATCH.replace('{field}', passwordTrans.NEWPWD);
    });
  }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      newpwd: new FormControl(null, [this.validatePassword]),
      cnewpwd: new FormControl(null, [Validators.required])
    }, {
      validators: this.password.bind(this)
    });
    this.passwordForm.valueChanges.subscribe(val => {
      if (this.passwordForm.valid) {
        this.passwordData.emit(this.passwordForm.get('newpwd')?.value);
      } else {
        this.passwordData.emit(false);
      }
    });
    this.setLiveAnnouncer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.overridePwConfig && this.overridePwConfig && Object.keys(this.overridePwConfig).length > 0) {
      Object.keys(this.overridePwConfig).forEach(key => {
        this[key] = this.overridePwConfig[key];
      });
    }
    if (changes && changes.resetPwdData) {
      this.resetData();
    }
    if ((changes.pwNoSpecialCharacter || this.hasOverridePwConfig('pwNoSpecialCharacter')) && !this.pwNoSpecialCharacter) {
      if (this.validatorMessages && this.validatorMessages.noSpecialCharacter) {
        delete this.validatorMessages.noSpecialCharacter;
      }
    }
    this.translateService.get('VALIDATION.PASSWORD').subscribe((res) => {
      if (res && changes) {
        if (changes.minLength || changes.maxLength || this.hasOverridePwConfig('minLength') || this.hasOverridePwConfig('maxLength')) {
          this.validatorMessages.required = res.REQUIRED.replace('{min}', this.minLength).replace('{max}', this.maxLength);
        }
        if ((changes.requiredSpecialCharacter || changes.specialCharacterList || this.hasOverridePwConfig('requiredSpecialCharacter')
          || this.hasOverridePwConfig('specialCharacterList')) && this.isRequiredSpecialCharacter()) {
          if (this.validatorMessages) {
            this.validatorMessages.containSpecialCharacter = res.CONTAIN_SPECIAL_CHARACTER
              + ' (' + this.getStringOfSpecialCharacterList() + ')';
          }
        } else {
          delete this.validatorMessages?.containSpecialCharacter;
        }
      }
    });
  }

  isRequiredSpecialCharacter() {
    return this.requiredSpecialCharacter && !this.pwNoSpecialCharacter;
  }

  hasOverridePwConfig(key: string) {
    if (this.overridePwConfig && Object.keys(this.overridePwConfig).length > 0) {
      const index = Object.keys(this.overridePwConfig).findIndex(keyConfig => keyConfig === key);
      return index !== -1 ? true : false;
    }
    return false;
  }

  resetData() {
    if (this.passwordForm) {
      this.passwordForm.reset();
      this.passwordForm.updateValueAndValidity();
      const elements = this.elementRef.nativeElement.querySelectorAll('.password-confirm-content .p-password-input');
      if (elements && elements.length > 0) {
        [...elements].forEach((ele) => {
          ele.value = '';
        });
      }
    }
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('newpwd');
    const { value: confirmPassword } = formGroup.get('cnewpwd');
    const hasRequiredError = formGroup.get('cnewpwd').errors?.hasOwnProperty('required');
    const errors = password === confirmPassword ? null : { passwordNotMatch: true };
    if (!hasRequiredError) {
      formGroup.get('cnewpwd').setErrors(errors);
    }
    return errors;
  }

  validatePassword = (control: AbstractControl): { [key: string]: any } | null => {
    const rs: any = {};
    const value = control.value;
    // Empty value
    if (!value) {
      rs.required = true;
      return rs;
    }

    if (!this.usePasswordPolicy) {
      return null;
    }

    // Min length, Max length
    if (value.length < this.minLength || value.length > this.maxLength) {
      rs.required = true;
    }

    // Start with character
    const beginLetter = /^(?=[A-Za-z])/;
    if (!value.match(beginLetter)) {
      rs.beginLetter = true;
    }
    // Contains uppercase and lowercase letters
    const containUpperAndLower = /(?=.*[a-z])(?=.*[A-Z])/;
    if (!value.match(containUpperAndLower)) {
      rs.containUpperAndLower = true;
    }
    // Contains number(s)
    const containNumber = /(?=.*[0-9])/;
    if (!value.match(containNumber)) {
      rs.containNumber = true;
    }
    // No special characters
    const specialCharacter = this.specialCharacterList ? this.specialCharacterList : this.defaultSpecialCharacterList;
    if (this.pwNoSpecialCharacter && value.match(/\W/)) {
      rs.noSpecialCharacter = true;
    } else if (this.requiredSpecialCharacter && !value.match(specialCharacter)) {
      rs.containSpecialCharacter = true;
    }

    if (Object.keys(rs).length === 0) {
      this.checkClass = 'rbn-valid';
    } else {
      this.checkClass = '';
    }
    return Object.keys(rs).length > 0 ? rs : null;
  };

  replaceIconEye() {
    const tList = this.elementRef.nativeElement.querySelectorAll('p-password');
    if (tList.length > 0) {
      for (let i = 0; i < tList.length; i++) {
        const t = tList[i];
        const t2 = t.querySelector('input').getAttribute('type');
        if (t2 === 'password') {
          const t3 = t.querySelector('input+i');
          t3.classList.remove('pi-eye');
          t3.classList.add('pi-eye-slash');
          t3.role = 'button';
          t3.ariaLabel = this.translateResults?.PASSWORD?.SHOW;
        }
        if (t2 === 'text') {
          const t3 = t.querySelector('input+i');
          t3.classList.remove('pi-eye-slash');
          t3.classList.add('pi-eye');
          t3.role = 'button';
          t3.ariaLabel = this.translateResults?.PASSWORD?.HIDE;
        }
      }
    }
  }

  getStringOfSpecialCharacterList() {
    // Convert RegExp to string and remove backslash of escaped characters
    const specialCharString = (this.specialCharacterList ?
      this.specialCharacterList
      : this.defaultSpecialCharacterList).toString().replace(/(?:\\(.))/g, '$1');
    // Get beginning of RegExp
    const removedBeginRegExp = specialCharString.substring(0, specialCharString.indexOf('[') + 1);

    // Get end of RegExp
    const removeEndRegExp = specialCharString.substring(specialCharString.lastIndexOf(']'));

    const result = specialCharString.replace(removedBeginRegExp, '').replace(removeEndRegExp, '');
    return result;
  }

  onNewpwdFocus() {
    this.announcePasswordError(this.passwordForm.get('newpwd')?.value);
  }

  setLiveAnnouncer(): void {
    this.passwordForm.get('newpwd')?.valueChanges.subscribe(val => this.announcePasswordError(val));
  }

  announcePasswordError(val?: string) {
    let announceMsg = this.translateResults?.PASSWORD.NEWPWD + ' ';
    if (val) {
      const errors = this.passwordForm.get('newpwd')?.errors;
      if (errors && Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(key => {
          if (errors[key] && this.validatorMessages[key]) {
            announceMsg += ' ' + this.validatorMessages[key] + ';';
          }
        });
        this.liveAnnouncer.announce(announceMsg);
      }
    } else if (this.validatorMessages) {
      Object.values(this.validatorMessages).forEach(value => {
        if (value) {
          announceMsg += ' ' + value + ';';
        }
      });
      this.liveAnnouncer.announce(announceMsg);
      // handle the case of presssing and releasing Backspace key
      const newpwdInputEl = this.elementRef.nativeElement.querySelector('#' + this.idElm + 'Newpwd input') as HTMLElement;
      newpwdInputEl.addEventListener('keyup', () => {
        if (!this.passwordForm.get('newpwd')?.value) {
          this.liveAnnouncer.announce(announceMsg);
        }
      });
    }
  }
}
