import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';

import { SearchConfig, ButtonOptions, SearchField } from './search-criteria.interface';
import { SearchCriteriaComponent } from './search-criteria.component';

@Component({
  selector: 'rbn-field-search',
  templateUrl: 'field-search.component.html'
})
export class FieldSearchComponent implements OnChanges {
  @Input() searchConfig: SearchConfig;
  @Input() searchForm: FormArray;
  @Input() hasFieldInsertedFirstPos = false;

  // Get access into the Field Search template to allow execute
  // the clearing of the search function resetSearch()
  @ViewChild('SearchCriteria', { static: false }) searchCriteria: SearchCriteriaComponent;

  enableButton: boolean;
  buttonOptions: ButtonOptions;
  otherFields: SearchField[];
  parameterField: SearchField;
  expressionField: SearchField;
  valuesField: SearchField;
  required = true;
  disableEvent = false;

  constructor(
    public formB: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.searchConfig) {
      this.buttonOptions = this.searchConfig.buttonOptions;
      this.parameterField = (changes.searchConfig.currentValue &&
        changes.searchConfig.currentValue.parameterField) ||
      {
        name: 'fieldId',
        label: ''
      };
      this.expressionField = (changes.searchConfig.currentValue &&
        changes.searchConfig.currentValue.expressionField) ||
      {
        name: 'comparison',
        label: ''
      };
      this.valuesField = (changes.searchConfig.currentValue &&
        changes.searchConfig.currentValue.valuesField) ||
      {
        name: 'values',
        label: 'Value'
      };
      this.otherFields =
        (changes.searchConfig.currentValue &&
          changes.searchConfig.currentValue.otherFields) ||
        undefined;
      this.required =
        this.searchConfig && this.searchConfig.required !== undefined
          ? this.searchConfig.required
          : true;
      if (changes.searchConfig.currentValue) {
        // add initial search elements
        const control = this.searchForm;
        if (control && control.length === 0) {
          this.addSearches();
        } else {
          this.initDefaultControl();
        }
      }
    }
  }

  initDefaultControl() {
    const arrControls = this.searchForm;
    if (arrControls && arrControls.length > 0) {
      arrControls.controls.forEach((group: FormGroup) => {
        if (!group.get(this.parameterField.name)) {
          group.addControl(this.parameterField.name, new FormControl(null, this.required ? Validators.required : null));
        }
        if (!group.get(this.expressionField.name)) {
          group.addControl(this.expressionField.name, new FormControl(null, this.required ? Validators.required : null));
        }
        if (!group.get(this.valuesField.name)) {
          group.addControl(this.valuesField.name, new FormControl(null, this.required ? Validators.required : null));
        }
      });
    }
  }

  addSearches(formdata: any = null) {
    if (this.searchForm) {
      const control = this.searchForm;
      // If a search is being added from a saved query, update the contoller values.
      // This will ensure we can set the expressionValues based upon the fieldId type
      const addCtrl = this.addedSearch();
      if (formdata != null) {
        addCtrl.patchValue(formdata);
      }
      if (control) {
        control.push(addCtrl);
      }
    }
  }

  addedSearch(comparison?: any, fieldId?: any, values?: any, logical?: any, otherFields?: any) {
    const form = this.formB.group({
      logical: [
        logical !== undefined && logical !== null ? logical : 'and',
        this.required ? Validators.required : null
      ],
      [this.parameterField.name]: [
        fieldId ? fieldId : '',
        this.required ? Validators.required : null
      ],
      [this.expressionField.name]: [
        comparison ? comparison : '',
        this.required ? Validators.required : null
      ],
      [this.valuesField.name]: [
        values ? values : '',
        this.required ? Validators.required : null
      ]
    });

    if (form.controls.logical) {
      form.controls.logical.enable();
      if (this.searchConfig.hideLogical) {
        form.controls.logical.disable();
      }
    }

    if (this.otherFields && this.otherFields.length > 0) {
      this.otherFields.forEach(({ name, required }) => {
        const value = otherFields && otherFields[name] ? otherFields[name] : '';
        form.addControl(
          name,
          new FormControl(value, required ? Validators.required : null)
        );
      });
    }
    return form;
  }

  /**
   * Duplicates the row in which enter was hit into the value box
   * @author dsaini
   *
   * @param index - the index of the item to duplicate
   */
  duplicateRow(index: number) {
    const control = this.searchForm;
    const row = control.value[index];
    control.insert(
      index + 1,
      this.addedSearch(row[this.expressionField.name], row[this.parameterField.name], '', 'or', row)
    );
  }

  // Remove a specific search criteria element
  removeSearch(i: number) {
    this.searchForm.removeAt(i);
  }

  resetSearch() {
    const control = this.searchForm;
    for (let i = control.value.length, len = 0; i >= len; i--) {
      if (i !== 0) {
        control.removeAt(i);
      } else {
        control.reset();
      }
    }
  }

  // setValueAt(i: number, entry) {
  //   const control = <FormArray>this.searchForm.controls['searches'];
  //   if (i > 0) {
  //     // Check if there is a control at position i, if not, add one
  //     if (typeof control.controls[i] === 'undefined') {
  //       // Pass in the new object to be created.  Because it is a new object, we need to do
  //       // some things in the ngOnInit to preload the expressionValues
  //       this.addSearches(entry);
  //       control.at(i).enable();
  //     }
  //   } else {
  //     control.at(i).setValue({ ...entry, logical: undefined });
  //   }
  // }

  clearExpressions() {
    this.searchCriteria.clearExpressions();
  }

  checkButton(val) {
    if (val !== undefined) {
      this.disableEvent = true;
      this.enableButton = !!val;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.disableEvent = false;
      }, 0);
    }
  }
}
