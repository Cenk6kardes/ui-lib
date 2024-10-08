import { Component, OnInit, Inject } from '@angular/core';
import { SecurityRealmsInterfaceService } from '../services/security-realms-interface.service';
import { SecurityRealms } from '../securityRealms';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateCommonService } from '../services/navigate-common.service';
import { removeUnusedPropObject, BaseComponent } from '../base.component';
import { ItemDropdown } from '../../models/common-table';

@Component({
  selector: 'rbn-security-realms-actions',
  templateUrl: './security-realms-actions.component.html',
  styleUrls: ['./security-realms-actions.component.scss']
})
export class SecurityRealmsActionsComponent extends BaseComponent implements OnInit {
  realm: SecurityRealms | undefined;
  header_securityRealm = '';
  securityRealmForm: FormGroup | any;
  realmTypes: any[] = [];
  selectedRealmType = '';
  isRealmTypeSelected = true;
  isEdit = false;
  realm_new: any;
  realm_action: any;
  selectedTypeValue = '';
  propertiesMapping: any[] | undefined;
  keypair_valueDisplay: any[] = [];
  valueName = 'keypair_value';
  i = 0;
  realmPropertiesPresent = false;
  menuItems: MenuItem[] = [];
  translateRealm: any;

  constructor(@Inject('SecurityRealmsInterfaceService') private securRealmsService: SecurityRealmsInterfaceService,
    private fb: FormBuilder, private translate: TranslateService, private route: ActivatedRoute,
    private navigateService: NavigateCommonService) {
    super();
    this.translate.get('ADMIN.SECURITY_REALM_ACTION').subscribe((result: any) => {
      this.translateRealm = result;
    });
    this.securityRealmForm = this.fb.group({
      'SecurityRealmName': new FormControl('', Validators.required),
      'RealmType': new FormControl('', Validators.required),
      'SequenceRank': new FormControl('', Validators.required),
      'mappings': this.fb.array([])
    });
  }

  ngOnInit() {
    // Set data for realm - Get data by route
    this.route.data.subscribe((data: any) => {
      this.realm = data.realm;
    });

    this.realm_new = {
      name: '',
      type: '',
      sequence: 999,
      properties: [{
        keypair_attribute: '',
        keypair_value: ''
      }],
      enabled: false
    };
    this.i = 0;
    if (this.realm === undefined) {
      this.isEdit = false;
      this.header_securityRealm = this.translateRealm.TITLE_ADD;
      this.realm_action = this.realm_new;
    } else {
      this.isEdit = true;
      this.header_securityRealm = this.translateRealm.TITLE_EDIT;
      this.realm_action = this.realm;
    }
    this.initialForm();
    this.menuItems = [
      { label: this.translateRealm.MENU_SECURITY_REALMS, command: () => {
        this.cancelActions();
      } },
      { label: this.header_securityRealm }
    ];
  }

  dataDropdown(arr: ItemDropdown[]) {
    const aArry: any[] = [];
    aArry.push({ label: this.translateRealm.SELECT_REALM_TYPE, value: '' });
    for (let i = 0; i < arr.length; i++) {
      aArry.push({ label: arr[i], value: arr[i] });
    }
    return aArry;
  }

  initialForm() {
    this.securRealmsService.getRealmsTypes().subscribe((data) => {
      this.realmTypes = this.dataDropdown(data.body);
      this.setValueInput(this.realm_action.name, this.realm_action.type, this.realm_action.sequence, true);
    });
  }

  setValueInput(realmName: string, realmType: string, realmSequence: number, edit: boolean) {
    this.securityRealmForm.controls['SecurityRealmName'].setValue(realmName);
    for (let i = 0; i < this.realmTypes.length; i++) {
      if (realmType === this.realmTypes[i].value) {
        this.selectedRealmType = this.realmTypes[i];
        this.selectedTypeValue = this.realmTypes[i].value;
        if (this.selectedTypeValue !== '') {
          this.onChangeRealmType(this.selectedTypeValue, edit, realmName);
        }
        this.realmPropertiesPresent = true;
      } else {
        this.selectedRealmType = '';
        this.realmPropertiesPresent = false;
      }
    }
    if (edit) {
      this.securityRealmForm.controls['SequenceRank'].setValue(realmSequence);
    } else {
      this.securityRealmForm.controls['SequenceRank'].setValue('');
    }
  }

  get getSecurityRealmNameInput() {
    return this.securityRealmForm.get('SecurityRealmName');
  }

  get getSequenceRank() {
    return this.securityRealmForm.get('SequenceRank');
  }

  onChangeRealmType(event: any, isEdit: boolean | undefined, realmName: string) {
    const settingBlocklen = this.settingBlock.length;
    for (let k = 0; k < settingBlocklen; k++) {
      this.removeFormFieldBlock(0);
    }
    if (isEdit !== undefined && isEdit) {
      this.selectedTypeValue = event;
    } else if (isEdit === undefined) {
      this.selectedTypeValue = event.value.value;
    }
    if (isEdit === undefined) {
      // not edit then take the default values from template.
      this.securRealmsService.getDetailsSecurityRealm(this.selectedTypeValue).subscribe((data) => {
        // this.securityRealmForm.controls['SecurityRealmName'].setValue(data.body.name);
        if (isEdit === undefined) {
          this.securityRealmForm.controls['SequenceRank'].setValue(data.body.sequence);
        }
        if (data.body.properties !== undefined) {
          this.propertiesMapping = data.body.properties;
          this.realmPropertiesPresent = true;
        } else {
          this.propertiesMapping = undefined;
          this.realmPropertiesPresent = false;
        }
        if (this.propertiesMapping !== undefined) {
          for (let i = 0; i < this.propertiesMapping.length; i++) {
            this.addFormFieldBlock(this.propertiesMapping[i].keypair_attribute, this.propertiesMapping[i].keypair_value);
            this.keypair_valueDisplay[i] = this.propertiesMapping[i].keypair_value;
          }
        }
      });
    } else {
      // in case of edit take the properties value from details using the realm name
      this.propertiesMapping = undefined;
      this.securRealmsService.getDetailsSecurityRealmByName(realmName).subscribe((data) => {
        // this.securityRealmForm.controls['SecurityRealmName'].setValue(data.body.name);
        // if (isEdit === undefined) {
        //   this.securityRealmForm.controls['SequenceRank'].setValue(data.body.sequence);
        // }
        if (data.body.properties !== undefined) {
          this.propertiesMapping = data.body.properties;
          this.realmPropertiesPresent = true;
        } else {
          this.propertiesMapping = undefined;
          this.realmPropertiesPresent = false;
        }
        if (this.propertiesMapping !== undefined) {
          for (let i = 0; i < this.propertiesMapping.length; i++) {
            this.addFormFieldBlock(this.propertiesMapping[i].keypair_attribute, this.propertiesMapping[i].keypair_value);
            this.keypair_valueDisplay[i] = this.propertiesMapping[i].keypair_value;
          }
        }
      });
    }
  }

  addFormFieldBlock(keyDisplay: string, valueDisplay: string) {
    const valueName = this.valueName;
    this.settingBlock.push(this.fb.group({ keypair_attribute: keyDisplay, [valueName]: valueDisplay }));
    this.i++;
  }

  removeFormFieldBlock(id: number) {
    this.settingBlock.removeAt(id);
  }

  get settingBlock() {
    return <FormArray>this.securityRealmForm.get('mappings');
  }

  onCheckSecurRealmName() {
    if (this.getSecurityRealmNameInput.errors && this.getSecurityRealmNameInput.errors.required &&
      this.securityRealmForm.controls['SecurityRealmName'].touched) {
      this.securityRealmForm.get('SecurityRealmName').markAsDirty();
    }
  }

  cancelActions() {
    this.navigateService.navBackToTable(this.route, this.isEdit);
  }

  onSubmit() {
    // form validation
    if (!this.securityRealmForm.valid) {
      if (this.selectedTypeValue === '') {
        this.isRealmTypeSelected = false;
      } else {
        this.isRealmTypeSelected = true;
      }
      this.setTouched(true);
      return;
    } else if (this.selectedTypeValue === '') {
      this.isRealmTypeSelected = false;
      return;
    } else {
      this.setValueRealmAction();
      this.callAPI(this.isEdit).subscribe(() => {
        this.navigateService.navBackToTable(this.route, this.isEdit);
      }, (error) => {
        if (error.message) {
          // this.showError(error, this.rbnMessageService);
        }
      });
    }
  }

  setTouched(isTouch: boolean) {
    this.securityRealmForm.controls['SecurityRealmName'].touched = isTouch;
    this.securityRealmForm.controls['SequenceRank'].touched = isTouch;
  }

  setValueRealmAction() {
    this.realm_action.name = this.securityRealmForm.controls['SecurityRealmName'].value;
    this.realm_action.sequence = this.securityRealmForm.controls['SequenceRank'].value;
    this.realm_action.type = this.selectedTypeValue;
    this.realm_action.properties = this.securityRealmForm.value.mappings;
  }

  callAPI(isEdit: boolean) {
    if (this.realm_action) {
      // Delete item added into datatable on security realms component
      this.realm_action = removeUnusedPropObject(this.realm_action);
    }
    if (isEdit && this.realm !== undefined) {
      return this.securRealmsService.updateSecurityRealm(this.realm_action);
    } else {
      return this.securRealmsService.addSecurityRealm(this.realm_action);
    }
  }
}
