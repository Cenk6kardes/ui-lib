import {
  Component, EventEmitter, Input, Output, OnChanges,
  ViewEncapsulation, SimpleChanges, AfterViewChecked
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  SearchField, FieldType, InputType, SearchFieldData,
  DataType, SearchConfig
} from './search-criteria.interface';

@Component({
  selector: 'rbn-search-criteria',
  templateUrl: 'search-criteria.component.html',
  styleUrls: ['./field-search.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchCriteriaComponent implements OnChanges, AfterViewChecked {

  @Input() searchConfig!: SearchConfig;
  @Input() searchCriteriaForm!: FormGroup;
  @Input() index: number;
  @Input() disableEvent = false;
  @Input() hasFieldInsertedFirstPos: boolean;

  @Output() removeSearch = new EventEmitter();
  @Output() addSearches = new EventEmitter();
  @Output() enableButtonCheck = new EventEmitter();
  @Output() duplicateRow = new EventEmitter();

  readonly numberType = ['number', 'integer', 'short', 'int', 'long', 'float', 'double'];
  basicFieldsName = [];
  andOr = [
    { label: 'And', value: 1 },
    { label: 'Or', value: 2 }
  ];

  brackets = [
    { label: '', value: 0 },
    { label: '(', value: 1 },
    { label: '((', value: 2 },
    { label: ')', value: 3 },
    { label: '))', value: 4 }
  ];

  bracketsOpening = [
    { label: '', value: 0 },
    { label: '(', value: 1 },
    { label: '((', value: 2 }
  ];

  bracketsClosing = [
    { label: '', value: 0 },
    { label: ')', value: 3 },
    { label: '))', value: 4 }
  ];

  expressionValues: SearchFieldData[] = [];
  expressionDefaultStrValues: SearchFieldData[];
  expressionStrValues: SearchFieldData[];
  expressionDefaultNumValues: SearchFieldData[];
  expressionNumValues: SearchFieldData[];
  defaultConditionValues: SearchFieldData[];
  conditionValues: SearchFieldData[];
  expressionDefaultEnumValues: SearchFieldData[];

  parameterField: SearchField;
  expressionField: SearchField;
  valuesField: SearchField;
  otherFields: SearchField[];
  bracketsEnable: boolean;
  required: boolean;
  enumFieldItem: object;

  isValuefocused: boolean;
  multiSelectOptions = [];
  expressionMultiSelectValues = [];
  resetValues = false;
  floatCheckflag = false;
  hexErr = false;

  fieldType = FieldType;
  dataType = DataType;

  width60 = 60;
  width80 = 80;
  itemWidth = 210;
  minWidth = this.itemWidth;
  disableEventAtCurrentChecking = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.searchConfig && changes.searchConfig.firstChange) {
      this.initDefaultExpressions();
    }
    this.initDefaultValues();

    if (changes.searchCriteriaForm && changes.searchCriteriaForm.firstChange) {
      // If a prefilled form has been initiated, update the expressionValues.  This
      // will occur when a saved query has been loaded.  This is the only way to ensure
      // that the proper expressionValues are existing when the contoller is added.
      if (this.searchCriteriaForm.value[this.parameterField.name] !== '') {
        this.onSelectFieldType(this.searchCriteriaForm.value[this.parameterField.name]);
      }
      this.checkValueValidator(changes.searchCriteriaForm.currentValue.value.operator);
    }
    let fieldtype = this.getFieldType(this.searchCriteriaForm.value[this.parameterField.name]);
    // TEMPORARY FOR RECORD TYPE ENUM
    if (this.enumFieldItem.hasOwnProperty('name') &&
      this.searchCriteriaForm.value[this.parameterField.name] === this.enumFieldItem['name']) {
      fieldtype = 'enum';
    }
    this.updateSearchExpressions(fieldtype);
    // If the parameterField.name type is a boolean, disable the textarea
    if (fieldtype && fieldtype.includes('boolean')) {
      // Update the expressionField.name value to the valuesField.name.  This is due to the way the
      // request is being handled on the backend.  This rebuilds the dropdowns
      // properly in the form
      if ((this.searchCriteriaForm.value[this.valuesField.name] !== null) &&
        (this.searchCriteriaForm.value[this.valuesField.name] !== undefined) &&
        (this.searchCriteriaForm.value[this.valuesField.name][0] !== '')) {
        this.searchCriteriaForm.value[this.expressionField.name] = this.searchCriteriaForm.value[this.valuesField.name][0];
        this.searchCriteriaForm.patchValue({ [this.expressionField.name]: this.searchCriteriaForm.value[this.valuesField.name][0] });
        this.searchCriteriaForm.patchValue({ [this.valuesField.name]: [''] });
      }
      this.searchCriteriaForm.controls[this.valuesField.name].disable();
    } else {
      // For normal types, if the expressionField.name contains Null (ie: isNull, !isNull)
      // disable the text area
      if ((this.searchCriteriaForm.value[this.expressionField.name] != null) &&
        (this.searchCriteriaForm.value[this.expressionField.name].includes('Null'))) {
        this.searchCriteriaForm.controls[this.valuesField.name].disable();
      }
    }
    if (changes && changes.disableEvent && !changes.disableEvent.currentValue) {
      this.disableEventAtCurrentChecking = true;
    }
  }

  ngAfterViewChecked(): void {
    if (!this.disableEvent) {
      if (!this.disableEventAtCurrentChecking) {
        const enable = this.enableButton();
        this.enableButtonCheck.emit(enable);
      } else {
        this.disableEventAtCurrentChecking = false;
      }
    }
  }

  initDefaultExpressions() {
    this.expressionValues = [];

    this.defaultConditionValues = [
      { label: 'And', value: 'and' },
      { label: 'Or', value: 'or' }
    ];

    this.expressionDefaultStrValues = [
      { label: 'Equals [Ab]', value: '=', type: 'input' },
      { label: 'Not Equals [Ab]', value: '!=', type: 'input' },
      { label: 'Starts With [Ab]', value: 'STARTS WITH', type: 'input' },
      { label: 'Contains', value: 'CONTAINS', type: 'input' }
    ];

    this.expressionDefaultNumValues = [
      { label: '=', value: '=', type: 'input' },
      { label: '!=', value: '!=', type: 'input' },
      { label: '<', value: '<', type: 'input' },
      { label: '<=', value: '<=', type: 'input' },
      { label: '>', value: '>', type: 'input' },
      { label: '>=', value: '>=', type: 'input' }
    ];

    this.expressionDefaultEnumValues = [
      { label: 'Equals', value: '=', type: 'input' },
      { label: 'Not Equals', value: '!=', type: 'input' }
    ];

    this.expressionMultiSelectValues = [
      { label: 'Equals', value: 'equals', type: 'input' },
      { label: 'Not Equals', value: 'ne', type: 'input' }
    ];
  }

  initDefaultValues() {
    if (this.searchConfig) {
      this.parameterField = this.searchConfig.parameterField;
      this.expressionField = this.searchConfig.expressionField;
      this.valuesField = this.searchConfig.valuesField;
      this.otherFields = this.searchConfig.otherFields;
      this.conditionValues = this.searchConfig.conditionValues;
      this.expressionStrValues = this.searchConfig.expressionStrValues;
      this.expressionNumValues = this.searchConfig.expressionNumValues;
      this.bracketsEnable = typeof this.searchConfig.bracketsEnable === 'boolean' ? this.searchConfig.bracketsEnable : true;
      this.required = this.searchConfig.required;
      this.enumFieldItem = this.searchConfig.enumFieldItem || {};
    }
    if (!this.parameterField) {
      this.parameterField = {
        name: 'fieldId',
        label: 'Parameter',
        dataType: DataType.String,
        type: FieldType.Input
      };
    }
    if (!this.parameterField.dataType) {
      this.parameterField.dataType = DataType.String;
    }
    if (!this.parameterField.type) {
      this.parameterField.type = FieldType.Input;
    }
    if (!this.valuesField) {
      this.valuesField = {
        name: 'values',
        label: 'Value',
        dataType: DataType.String,
        type: FieldType.Input
      };
    }
    if (!this.valuesField.dataType) {
      this.valuesField.dataType = DataType.String;
    }
    if (!this.valuesField.type) {
      this.valuesField.type = FieldType.Input;
    }
    if (!this.conditionValues) {
      this.conditionValues = this.defaultConditionValues;
    }
    this.parameterField.name = this.parameterField.name || 'fieldId';
    this.expressionField.name = this.expressionField.name || 'comparison';
    this.valuesField.name = this.valuesField.name || 'values';
    this.basicFieldsName = [this.parameterField.name, this.expressionField.name, this.valuesField.name];
  }

  onSelectExpression(event) {
    const item = this.expressionValues.find(x => x.value === event);
    if (item) {
      if (item.type.includes('boolean') || event.includes('Null')) {
        // disable the text area
        this.searchCriteriaForm.controls[this.valuesField.name].setValue('');
        this.searchCriteriaForm.controls[this.valuesField.name].disable();
      } else {
        this.searchCriteriaForm.controls[this.valuesField.name].enable();
      }
    }
    this.checkValueValidator(event);
  }

  // Check if value of each operator is required or not
  checkValueValidator(expressionValue: string) {
    if ((this.expressionStrValues || this.expressionNumValues)
      && this.expressionStrValues.find((el) => el?.isRequiredValue === false && el.value === expressionValue)) {
      this.searchCriteriaForm.controls[this.valuesField.name]?.clearValidators();
    } else {
      this.searchCriteriaForm.controls[this.valuesField.name]?.setValidators([Validators.required]);
    }
    this.searchCriteriaForm.controls[this.valuesField.name]?.updateValueAndValidity();
  }

  checkHexValue(event) {
    const x = this.searchCriteriaForm.value[this.parameterField.name];
    const value = event.target.value;
    if (x === 'sbccallid') {
      if (value.match(/^(?:0x[\da-f]+|\d+)$/i)) {
        this.hexErr = false;
      } else {
        this.hexErr = true;
      }
    } else {
      this.hexErr = false;
    }
  }

  /** LadderD: Update search field validation */
  onValidateTypeValue(event, index) {
    if (event.key === 'Enter' && this.enableButton()) {
      this.addCriteriaRow(index);
    }
    const type = this.getFieldType(this.searchCriteriaForm.value[this.parameterField.name]);
    if (this.searchCriteriaForm.value[this.parameterField.name] === 'sbccallid') {
      return true;
    }

    if (this.numberType.indexOf(type) !== -1) {
      if (event.key === '.' && this.floatCheckflag) {
        return false;
      }
      if (event.key === '.') {
        this.floatCheckflag = true;
        return true;
      }
      if ((event.target.value.match(/^\d+$/)) || event.target.value === '') {
        this.floatCheckflag = false;
      }

      const numbers = /^[0-9]+$/;
      if (!(event.key).match(numbers)) {
        return false;
      }
    }
  }

  getFieldType(event) {
    if (this.parameterField.type === FieldType.Input) {
      return this.valuesField.dataType;
    }
    let expressionType = '';
    if (this.parameterField && this.parameterField.data && this.parameterField.data.length > 0) {
      // examine SearchFields for selection and obtain type
      const item = (this.parameterField.data as SearchFieldData[]).find(x => x.value === event);
      if (item) {
        if (this.enumFieldItem.hasOwnProperty('name') && event.includes(this.enumFieldItem['name'])) {
          expressionType = 'enum';
        } else {
          expressionType = item.type;
        }
      }
    }
    return expressionType;
  }

  onSelectFieldType(event, templateFlag?: number) {
    if (this.valuesField.type === FieldType.MultiSelect) {
      if (this.valuesField.data) {
        this.multiSelectOptions = this.valuesField.data[event] || [];
      }
      if (this.searchCriteriaForm.controls[this.valuesField.name] && this.resetValues) {
        this.searchCriteriaForm.controls[this.valuesField.name].setValue([]);
      }
    } else {
      if (this.searchCriteriaForm.controls[this.valuesField.name] && this.resetValues) {
        this.searchCriteriaForm.controls[this.valuesField.name].setValue('');
      }
    }
    if (this.searchCriteriaForm.controls[this.expressionField.name] && this.resetValues) {
      this.searchCriteriaForm.controls[this.expressionField.name].setValue([]);
    }

    if (this.otherFields) {
      this.otherFields.forEach(({ type, name }) => {
        const control = this.searchCriteriaForm.controls[name];
        if (control && this.resetValues) {
          let value: any = '';
          if (type === FieldType.MultiSelect) {
            value = [];
          }
          control.setValue(value);
        }
      });
    }

    let expressionType;
    if (this.parameterField.type === FieldType.Input) {
      expressionType = this.valuesField.dataType;
      this.resetValues = this.checkClearValue();
      this.updateSearchExpressions(expressionType, templateFlag);
    } else {
      if (event) {
        if (this.searchCriteriaForm.value[this.expressionField.name] && this.resetValues) {
          this.searchCriteriaForm.controls[this.expressionField.name].setValue('');
        }
        expressionType = this.getFieldType(event);
        // TEMPORARY FOR RECORD TYPE ENUM
        if (this.enumFieldItem.hasOwnProperty('name') && event.includes(this.enumFieldItem['name'])) {
          expressionType = 'enum';
        }
        this.updateSearchExpressions(expressionType, templateFlag);
      }
      this.resetValues = true;
    }
  }

  onSelectDropdown(event, controlName) {
    const refValue = (this.expressionField && this.expressionField.referencesField) ? this.expressionField.referencesField : '';
    if (controlName === refValue) {
      const arrItemHasRefValues = this.expressionStrValues.filter((x) => x.referencesValue);
      const field: any = this.otherFields.find((item) => item.name === refValue);
      if (field && arrItemHasRefValues) {
        const refValues: any = arrItemHasRefValues.map((it) => it.referencesValue);
        const dropDownValues = field.data ? field.data.map(a => a.value) : [];
        const hasReferData = this.checkHasRefField(arrItemHasRefValues, dropDownValues);
        if (hasReferData && refValues.includes(event)) {
          const controlVal = this.searchCriteriaForm.controls[this.expressionField.name].value;
          this.expressionValues = this.expressionStrValues.filter((x) => x.referencesValue === event);
          const arrVals: any = this.expressionValues.map((it) => it.value);
          if (!arrVals.includes(controlVal)) {
            this.searchCriteriaForm.controls[this.expressionField.name].setValue('');
          }
        } else {
          if (this.expressionStrValues && this.expressionStrValues.length > 0) {
            this.expressionValues = this.expressionStrValues.filter(x => x.type.includes('input')) || [];
          } else {
            this.expressionValues = this.expressionDefaultStrValues;
          }
        }
      }
    }
  }

  checkHasRefField(arrItemHasRefValues, arrDropDownData) {
    for (const item of arrItemHasRefValues) {
      if (arrDropDownData.includes(item.referencesValue)) {
        return true;
      }
    }
    return false;
  }

  checkClearValue() {
    if (this.parameterField.type === FieldType.Input && this.valuesField.dataType === InputType.Number) {
      return !this.searchCriteriaForm.controls[this.valuesField.name].value.match(/^\d+$/);
    }
  }

  // Update the expressions based upon the selected type which is passed in from
  // the search-criteria emitter.
  updateSearchExpressions(fieldtype, templateFlag?: number) {
    this.expressionValues = [];
    if (this.numberType.indexOf(fieldtype) !== -1) {
      // Check if the client has passed in expression [this.valuesField.name] to use
      if (this.expressionNumValues && this.expressionNumValues.length > 0) {
        this.expressionValues = this.expressionNumValues;
      } else {
        this.expressionValues = this.expressionDefaultNumValues;
      }
      // Added to reset value field during string to number type field selection, triggering only from HTML
      if (templateFlag) {
        this.searchCriteriaForm.controls[this.valuesField.name].setValue('');
      }
    } else {
      switch (fieldtype) {
        case DataType.Boolean:
          if (this.expressionStrValues && this.expressionStrValues.length > 0) {
            this.expressionValues = this.expressionStrValues.filter(x => x.type === fieldtype) || [];
          }
          break;
        case DataType.String:
        case DataType.Attribute:
          // Check if the client has passed in expression values to use
          if (this.expressionField && this.expressionField.referencesField) {
            const control = this.searchCriteriaForm.controls[this.expressionField.referencesField].value;
            if (control) {
              if (this.expressionStrValues && this.expressionStrValues.length > 0) {
                const refValues = this.expressionStrValues.filter(it => it.referencesValue);
                const arrRef: any = (refValues && refValues.length > 0) ? refValues.map((it) => it.referencesValue) : [];
                if (arrRef.includes(control)) {
                  this.expressionValues = this.expressionStrValues.filter((it) => it.referencesValue === control);
                  break;
                }
              }
            }
          }
          if (this.expressionStrValues && this.expressionStrValues.length > 0) {
            this.expressionValues = this.expressionStrValues.filter(x => x.type.includes('input')) || [];
          } else {
            this.expressionValues = this.expressionDefaultStrValues;
          }
          break;
        case DataType.Enum:
          this.expressionValues = this.expressionDefaultEnumValues;
          break;
        case DataType.MultiSelect:
          this.expressionValues = this.expressionMultiSelectValues.slice(0);
          break;
      }
    }
  }

  enableButton = () => {
    let enable = true;
    let invalid = (this.searchCriteriaForm.value[this.valuesField.name] === ''
      || this.searchCriteriaForm.value[this.valuesField.name] == null) &&
      (this.searchCriteriaForm.value[this.expressionField.name] === ''
        || this.searchCriteriaForm.value[this.expressionField.name] == null) &&
      (this.searchCriteriaForm.value[this.parameterField.name] === '' ||
        this.searchCriteriaForm.value[this.parameterField.name] == null);
    if (this.otherFields) {
      this.otherFields.forEach(({ name }) => {
        invalid = invalid &&
          (this.searchCriteriaForm.controls[name].value === ''
            || this.searchCriteriaForm.controls[name].value === null);
      });
    }
    if (invalid) {
      enable = false;
    }
    return enable;
  };

  addItem() {
    this.addSearches.emit();
  }

  /**
   * Emits an event to add the row to duplicate the data in it
   * @author dsaini
   *
   * @param index - the index of the row to duplicate
   */
  addCriteriaRow(index) {
    this.duplicateRow.emit(index);
  }

  removeItem(i) {
    this.removeSearch.emit(i);
  }

  clearItem() {
    const resetData: any = {
      [this.expressionField.name]: null,
      [this.parameterField.name]: null,
      [this.valuesField.name]: null
    };
    if (!this.searchConfig.hideLogical) {
      resetData.logical = '';
    }
    if (this.otherFields) {
      this.otherFields.forEach(field => {
        resetData[field.name] = null;
      });
    }
    this.searchCriteriaForm.reset(resetData);
    // Select expression dropdown value clear
    // this.expressionValues = [];
    let fieldtype = this.getFieldType(this.searchCriteriaForm.value[this.parameterField.name]);
    // TEMPORARY FOR RECORD TYPE ENUM
    if (this.enumFieldItem.hasOwnProperty('name') &&
      this.searchCriteriaForm.value[this.parameterField.name] === this.enumFieldItem['name']) {
      fieldtype = 'enum';
    }
    this.updateSearchExpressions(fieldtype);

  }

  clearExpressions() {
    this.expressionValues = [];
  }

  /**
   * Checks to see whether a field is empty or not
   *
   * @author mrafeq
   *
   * @param type - filed type
   *
   * @returns True if empty, false if not
   */
  empty(type: string) {
    let required = this.required;
    if (this.basicFieldsName.indexOf(type) < 0 && this.otherFields) {
      required = this.otherFields.find(x => x.name === type).required;
    }
    if (required && (this.checkNull(type) || this.checkEmpty(type))) {
      if (type === this.valuesField.name && this.searchCriteriaForm.value[this.expressionField.name] != null &&
        (this.searchCriteriaForm.value[this.expressionField.name].includes('isNull') ||
          this.searchCriteriaForm.value[this.expressionField.name] === 'true' ||
          this.searchCriteriaForm.value[this.expressionField.name] === 'false')) {
        this.searchCriteriaForm.controls[this.valuesField.name].setValue('');
        return false;
      }
      return true;
    }
    if ((type === this.expressionField.name) &&
      (!this.checkNull(this.parameterField.name) && !this.checkEmpty(this.parameterField.name)) &&
      (this.checkNull(this.expressionField.name) || this.checkEmpty(this.expressionField.name))) {
      return true;
    }
    if ((type === this.valuesField.name) &&
      (!this.checkNull(this.parameterField.name) && !this.checkEmpty(this.parameterField.name)) &&
      (this.checkNull(this.valuesField.name) || this.checkEmpty(this.valuesField.name)) &&
      this.searchCriteriaForm.value[this.expressionField.name] != null &&
      (!(this.searchCriteriaForm.value[this.expressionField.name].includes('isNull')) &&
        this.searchCriteriaForm.value[this.expressionField.name] !== 'true' &&
        this.searchCriteriaForm.value[this.expressionField.name] !== 'false'
      )) {
      return true;
    }

    return false;
  }

  /**
   * checks the form value is null or not
   * @author mrafeq
   *
   * @param type - filed type
   * @returns True if empty, false if not
   */
  checkNull(val) {
    const type = (this.searchCriteriaForm.value[val] == null) ? true : false;
    return type;
  }

  /**
   * checks the form value is null or not
   * @author mrafeq
   *
   * @param type -filed type
   * @returns True if empty, false if not
   */
  checkEmpty(val) {
    const type = (this.searchCriteriaForm.value[val] === '') ? true : false;
    return type;
  }

  /**
   * Sets Focus State of "Value" Element (Under Criteria)to true/false depending on whether the textbox is focused or not
   * @author dsaini
   *
   * @param bool - true if focused, false otherwise
   */
  setValueFocusState(bool: boolean) {
    this.isValuefocused = bool;
  }

  getMinWidth() {
    let width = this.width80 + this.minWidth * 3 + this.width60;
    width += this.bracketsEnable ? this.width60 * 2 : 0;
    if (this.otherFields && this.otherFields.length > 0) {
      width += this.minWidth * this.otherFields.length;
    }
    return width;
  }

  getControl(controlName) {
    return controlName && this.searchCriteriaForm.get(controlName);
  }
}
