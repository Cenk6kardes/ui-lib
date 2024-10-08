import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { IProfileInfoData, IProfileInfoShowing } from '../profile.model';
import { FormToolbarEmit } from '../../form-toolbar/form-toolbar.model';

@Component({
  selector: 'rbn-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnChanges {

  @Input() showProfileInfo = false;
  @Input() showingConfigs: IProfileInfoShowing;
  @Input() defaultData: IProfileInfoData;
  @Input() idProfileInfo = 'profile-info';

  @Output() profileInfoEmit = new EventEmitter();

  expiredPassword = false;
  forcedToResetPassword = false;
  pwdDangerMessages = [];

  translateResults: any = {};
  generalForm: FormGroup;
  timezoneForm: FormGroup;

  validMsg: any;
  ValidatorLength = {
    username: {
      minlength: 3,
      maxlength: 40
    },
    fullname: {
      minlength: 3,
      maxlength: 40
    },
    description: {
      minlength: 3
    }
  };

  showConfirmation = false;
  passwordValuesChanges = null;
  generalValuesChanges = null;
  timezoneValuesChanges = null;

  constructor( private translateService: TranslateService ) {
    // Set danger notification message for password form
    this.translateService.get('PROFILE_INFO').subscribe(res => {
      this.translateResults = res || {};
      if (this.expiredPassword) {
        this.pwdDangerMessages.push(this.translateResults.EXPWD_ERROR);
      }
      if (this.forcedToResetPassword) {
        this.pwdDangerMessages.push(this.translateResults.RESET_PWD_ERROR);
      }
    });
    this.translateService.get('VALIDATION').subscribe(res => {
      this.validMsg = {
        required: res.REQUIRED,
        minlength: res.MIN,
        maxlength: res.MAX
      };
    });
  }

  ngOnInit(): void {
    if (this.showingConfigs && this.showingConfigs.general) {
      this.generalForm = new FormGroup({
        username: new FormControl(this.defaultData?.general?.username, [
          Validators.required,
          Validators.minLength(this.ValidatorLength.username.minlength),
          Validators.maxLength(this.ValidatorLength.username.maxlength)]),
        fullname: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.ValidatorLength.fullname.minlength),
          Validators.maxLength(this.ValidatorLength.fullname.maxlength)]),
        description: new FormControl(null, [
          Validators.minLength(this.ValidatorLength.description.minlength)])
      });

      this.generalForm.valueChanges.subscribe(values => {
        if (this.generalForm.valid) {
          this.generalValuesChanges = values;
        } else {
          this.generalValuesChanges = null;
        }
      });
    }

    if (this.showingConfigs && this.showingConfigs.timezone) {
      this.timezoneForm = new FormGroup({
        local: new FormControl(null),
        coordinated: new FormControl(null),
        another: new FormControl(null)
      });

      this.timezoneForm.valueChanges.subscribe(values => {
        this.timezoneValuesChanges = values;
      });
    }
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showingConfigs && this.showingConfigs.changePassword) {
      if (this.showingConfigs.changePassword.hasOwnProperty('expiredPassword')) {
        this.expiredPassword = this.showingConfigs.changePassword.expiredPassword;
      }
      if (this.showingConfigs.changePassword.hasOwnProperty('forcedToResetPassword')) {
        this.forcedToResetPassword = this.showingConfigs.changePassword.forcedToResetPassword;
      }
    }
    if (changes) {
      this.initData();
    }
  }

  initGeneralForm() {
    if (this.generalForm && this.defaultData.general) {
      this.generalForm.get('username').setValue(this.defaultData.general.username);
      this.generalForm.get('fullname').setValue(this.defaultData.general.fullname);
      this.generalForm.get('description').setValue(this.defaultData.general.description);
      this.generalForm.updateValueAndValidity();
    } else if (this.generalForm) {
      this.generalForm.reset();
    }
  }

  initTimezonelForm(): void {
    if (this.timezoneForm && this.defaultData.timezone) {
      this.timezoneForm.get('local').setValue(this.defaultData.timezone.local);
      this.timezoneForm.get('coordinated').setValue(this.defaultData.timezone.coordinated);
      this.timezoneForm.get('another').setValue(this.defaultData.timezone.another);
      this.timezoneForm.updateValueAndValidity();
    } else if (this.timezoneForm) {
      this.timezoneForm.reset();
    }
  }

  initData(): void {
    this.initGeneralForm();
    this.initTimezonelForm();
  }

  valiMessage(err: string, field: string) {
    const validText = this.validMsg[err];
    const validLeng = this.ValidatorLength[field][err];
    return validText.replace('{0}', validLeng);
  }

  onButtonClick($event, formName: string) {
    switch ($event) {
      case FormToolbarEmit.primary:
        this.formSubmit(formName);
        break;
      case FormToolbarEmit.secondary:
        this.resetForm(formName);
        break;
    }
  }

  onPassworDataEmit($event) {
    if ($event.submit) {
      const profileInfoData: IProfileInfoData =  {
        changePassword: $event.data
      };
      this.profileInfoEmit.emit(profileInfoData);
    } else {
      this.passwordValuesChanges = $event.data;
    }
  }

  closeDialog() {
    this.showProfileInfo = false;
    if (this.getProfileInfoChanges()) {
      this.showConfirmation = true;
    }
  }

  onComfirmation($event) {
    if ($event) {
      const profileInfoData: IProfileInfoData = this.getProfileInfoChanges();
      if (profileInfoData) {
        this.profileInfoEmit.emit(profileInfoData);
      }
    }
    this.showConfirmation = false;
  }

  getProfileInfoChanges(): IProfileInfoData {
    const profileInfoData: IProfileInfoData = {};
    if (this.generalValuesChanges
      && (JSON.stringify(this.generalValuesChanges) !== JSON.stringify(this.defaultData.general))) {
      profileInfoData.general = this.generalValuesChanges;
    }
    if (this.passwordValuesChanges) {
      profileInfoData.changePassword = this.passwordValuesChanges;
    }
    if (this.timezoneValuesChanges
      && (JSON.stringify(this.timezoneValuesChanges) !== JSON.stringify(this.defaultData.timezone))) {
      profileInfoData.timezone = this.timezoneValuesChanges;
    }
    return (JSON.stringify(profileInfoData) === '{}') ? null : profileInfoData;
  }

  formSubmit(formName: string) {
    let profileInfoData: IProfileInfoData;
    switch (formName) {
      case 'generalForm':
        profileInfoData = {
          general: this.generalForm.value
        };
        break;
      case 'timezoneForm':
        profileInfoData = {
          timezone: this.timezoneForm.value
        };
        break;
    }
    this.profileInfoEmit.emit(profileInfoData);
  }

  resetForm(formName: string) {
    switch (formName) {
      case 'generalForm':
        this.initGeneralForm();
        break;
      case 'timezoneForm':
        this.initTimezonelForm();
        break;
    }
  }
}
