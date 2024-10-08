import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SelectItem } from 'primeng/api';
import { KeyValue } from '../../../models/key-value';

@Component({
  selector: 'rbn-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent implements OnInit {
  keyValueForm: FormGroup;

  @Input() placeholderTextKey = '';
  @Input() placeholderTextValue = '';
  @Input() keyOption: SelectItem[] = [];
  @Input() valueOption: SelectItem[] = [];
  @Input() isDropdownRequired = false;
  @Input() needFormTag = true;
  @Input() idPrefix = '';

  // emit clear dropdown
  @Output() addRemoveEvent = new EventEmitter();

  i = 0;
  selectedOption: string = null;
  keyValues: KeyValue[] = [];
  isMinusDisabled: any[] = [];
  isDisplayAdd: any[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.keyValueForm = this.fb.group({
      'mappings': this.fb.array([this.fb.group
      ({
        key_root: '',
        valuePair_root: ''
      })
      ])
    });
    this.isDisplayAdd[this.i] = true;
    this.isMinusDisabled[this.i] = true;
  }

  selectedOptionEvent(optionValue: string) {
    this.selectedOption = optionValue;
  }

  onBlurInput() {
    this.addRemoveEvent.emit({ action: 'blur', keyValues: this.keyValues, keyValueFormValue: this.keyValueForm.value });
  }

  get settingBlock() {
    return <FormArray>this.keyValueForm.get('mappings');
  }

  addConfigBlock() {
    this.settingBlock.push(this.fb.group({
      key_root: '',
      valuePair_root: ''
    }));

    for (let index = 0; index < this.settingBlock.length; index++) {
      this.isDisplayAdd[index] = false;
      this.isMinusDisabled[index] = false;
    }
    this.isDisplayAdd[this.settingBlock.length - 1] = true;
    this.isMinusDisabled[this.settingBlock.length - 1] = false;
    this.addRemoveEvent.emit({ action: 'add', keyValues: this.keyValues, keyValueFormValue: this.keyValueForm.value });
  }

  removeConfigBlock(index: number) {
    this.settingBlock.removeAt(index);
    for (let i = 0; i < this.settingBlock.length; i++) {
      this.isDisplayAdd[i] = false;
      this.isMinusDisabled[i] = false;
    }
    this.isDisplayAdd[this.settingBlock.length - 1] = true;
    this.isMinusDisabled[this.settingBlock.length - 1] = this.settingBlock.length === 1;
    this.addRemoveEvent.emit({ action: 'remove', keyValues: this.keyValues, keyValueFormValue: this.keyValueForm.value });
  }
}
