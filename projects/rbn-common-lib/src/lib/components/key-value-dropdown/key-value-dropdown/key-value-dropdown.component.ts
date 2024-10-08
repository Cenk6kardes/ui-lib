import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'rbn-key-value-dropdown',
  templateUrl: './key-value-dropdown.component.html',
  styleUrls: ['./key-value-dropdown.component.scss']
})
export class KeyValueDropdownComponent implements OnChanges {
  @Input() keyOption: any[] = [];
  @Input() valueOption: any[] = [];
  @Input() isShowEdit = false;
  @Input() mappingsSet: any | undefined;
  @Input() placeholderTextValue = '';
  @Input() placeholderTextKey = '';
  @Input() isDropdownRequired = false;
  @Input() keyName = '';
  @Input() valueName = '';
  @Output() sendMappingList = new EventEmitter();
  keyNameDisplay: any[] = [];
  valueNameDisplay: any[] = [];
  i = 0;
  isMinusDisabled: any[] = [];
  isDisplayAdd: any[] = [];
  keyValueForm: FormGroup;


  constructor(private fb: FormBuilder) {
    // form init
    this.keyValueForm = fb.group({
      'mappings': fb.array([])
    });
  }

  ngOnChanges() {
    this.i = 0;
    this.keyValueForm = this.fb.group({
      'mappings': this.fb.array([])
    });
    this.keyNameDisplay = [];
    this.valueNameDisplay = [];
    if (this.isShowEdit) {
      for (let i = 0; i < this.mappingsSet.length; i++) {
        this.addFormFieldBlock(-1, false, this.mappingsSet[i][this.keyName], this.mappingsSet[i][this.valueName]);
        this.keyNameDisplay[i] = this.mappingsSet[i][this.keyName];
        this.valueNameDisplay[i] = this.mappingsSet[i][this.valueName];
      }
    } else {
      this.addFormFieldBlock(-1, true, 'None', 'None');
    }
  }

  changeKeyValue() {
    this.sendMappingList.emit(this.keyValueForm.value.mappings);
  }

  get settingBlock() {
    return <FormArray>this.keyValueForm.get('mappings');
  }

  addFormFieldBlock(indexItemFormArrayMappings?: number, newFrom?: boolean, keyDisplay?: string, valueDisplay?: string) {
    if (Number(indexItemFormArrayMappings) <= -1) {
      this.settingBlock.push(this.fb.group({ [this.keyName]: keyDisplay, [this.valueName]: valueDisplay }));
    } else {
      this.settingBlock.insert(
        Number(indexItemFormArrayMappings) + 1, this.fb.group({ [this.keyName]: keyDisplay, [this.valueName]: valueDisplay }));
    }
    if (newFrom) {
      this.keyNameDisplay[this.i] = 'None';
      this.valueNameDisplay[this.i] = 'None';
    }
    this.isDisplayAdd[this.i] = true;
    for (let index = 0; index < this.isDisplayAdd.length - 1; index++) {
      // this.isDisplayAdd[index] = false;
      this.isMinusDisabled[index] = false;
    }
    this.i++;
    if (this.settingBlock.length === 1) {
      this.isMinusDisabled[0] = true;
    } else {
      this.isMinusDisabled[0] = false;
      // this.isMinusDisabled[this.settingBlock.length - 1] = true;
    }
    this.sendMappingList.emit(this.keyValueForm.value.mappings);
  }

  removeFormFieldBlock(id: number) {
    this.keyNameDisplay[id] = 'None';
    this.valueNameDisplay[id] = 'None';
    this.settingBlock.removeAt(id);
    this.isDisplayAdd.splice(id, 1);
    this.isDisplayAdd[this.isDisplayAdd.length - 1] = true;
    this.i--;
    if (this.settingBlock.length === 1) {
      this.isMinusDisabled[0] = true;
    } else {
      this.isMinusDisabled[0] = false;
      // this.isMinusDisabled[this.settingBlock.length - 1] = true;
    }
    if (this.keyValueForm.value.mappings !== undefined) {
      for (let i = 0; i < this.keyValueForm.value.mappings.length; i++) {
        this.keyNameDisplay[i] = this.keyValueForm.value.mappings[i][this.keyName];
        this.valueNameDisplay[i] = this.keyValueForm.value.mappings[i][this.valueName];
      }
    }
    this.sendMappingList.emit(this.keyValueForm.value.mappings);
  }

}
