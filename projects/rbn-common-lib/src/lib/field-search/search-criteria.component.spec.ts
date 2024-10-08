import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { SearchConfig, FieldType, DataType } from './search-criteria.interface';
import { SearchCriteriaComponent } from './search-criteria.component';
import { SearchCriteriaModule } from './search-criteria.module';

describe('SearchCriteriaComponent', () => {
  let component: SearchCriteriaComponent;
  let fixture: ComponentFixture<SearchCriteriaComponent>;

  const basicConfig: SearchConfig = {
    buttonOptions: {},
    parameterField: {
      label: 'parameterField',
      name: 'parameter'
    },
    expressionField: {
      label: 'expressionField',
      name: 'comparison'
    },
    valuesField: {
      label: 'valuesField',
      name: 'value'
    },
    otherFields: [{
      label: 'test1',
      name: 'test1',
      type: FieldType.MultiSelect
    }],
    required: true
  };

  let searchConfig: SearchConfig = JSON.parse(JSON.stringify(basicConfig));

  let searchCriteriaForm = new FormGroup({
    [searchConfig.parameterField.name]: new FormControl('test', Validators.required),
    [searchConfig.expressionField.name]: new FormControl(null, Validators.required),
    [searchConfig.valuesField.name]: new FormControl(null, Validators.required)
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchCriteriaComponent],
      imports: [
        HttpClientTestingModule,
        SearchCriteriaModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCriteriaComponent);
    component = fixture.componentInstance;
    searchCriteriaForm = new FormGroup({
      [searchConfig.parameterField.name]: new FormControl('test', Validators.required),
      [searchConfig.expressionField.name]: new FormControl(null, Validators.required),
      [searchConfig.valuesField.name]: new FormControl(null, Validators.required)
    });
    searchConfig = JSON.parse(JSON.stringify(basicConfig));
    // fixture.detectChanges();
  });

  afterEach(() => {
    component.searchCriteriaForm = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    spyOn(component, 'onSelectFieldType');
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.ngOnChanges({
      searchConfig: new SimpleChange(null, searchConfig, true),
      searchCriteriaForm: new SimpleChange(null, searchCriteriaForm, true)
    });
    expect(component.onSelectFieldType).toHaveBeenCalled();
  });

  it('should call ngOnChanges and disable values when expression is null', () => {
    spyOn(component, 'onSelectFieldType');
    const value = searchCriteriaForm.value;
    component.searchCriteriaForm = searchCriteriaForm;
    value[searchConfig.expressionField.name] = 'Null';
    component.searchCriteriaForm.setValue(value);

    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.ngOnChanges({
      searchConfig: new SimpleChange(null, searchConfig, true),
      searchCriteriaForm: new SimpleChange(null, searchCriteriaForm, true)
    });
    expect(component.searchCriteriaForm.controls[component.valuesField.name].disable).toBeTruthy();
  });

  it('should call ngOnChanges valueField is boolean', () => {
    spyOn(component, 'onSelectFieldType');
    searchCriteriaForm.reset();
    component.searchCriteriaForm = searchCriteriaForm;
    const value = searchCriteriaForm.value;
    value[searchConfig.parameterField.name] = 'parameterField';
    value[searchConfig.expressionField.name] = 'expressionValue';
    value[searchConfig.valuesField.name] = ['valuesField'];
    component.searchCriteriaForm.setValue(value);
    const newsearchConfig: SearchConfig = JSON.parse(JSON.stringify(searchConfig));
    newsearchConfig.parameterField.type = FieldType.MultiSelect;
    newsearchConfig.parameterField.data = [{
      label: 'Test1',
      value: 'parameterField',
      type: 'boolean'
    }];
    newsearchConfig.enumFieldItem = {};
    component.searchConfig = newsearchConfig;

    component.ngOnChanges({
      searchConfig: new SimpleChange(null, newsearchConfig, true),
      searchCriteriaForm: new SimpleChange(null, searchCriteriaForm, true)
    });
    expect(component.searchCriteriaForm.controls[component.expressionField.name].value).toEqual('valuesField');
  });

  it('should call onSelectExpression when select item.type = string', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].disable();
    component.expressionValues = [{
      value: '=',
      label: 'Equal',
      type: 'input'
    }];
    const event = '=';
    component.onSelectExpression(event);
    expect(component.searchCriteriaForm.controls[component.valuesField.name].enabled).toBeTruthy();
  });

  it('should call onSelectExpression when select item.type = boolean', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].setValue('test');
    component.expressionValues = [{
      value: 'isNull',
      label: 'Null',
      type: 'boolean'
    }];
    const event = 'isNull';
    component.onSelectExpression(event);
    expect(component.searchCriteriaForm.controls[component.valuesField.name].disabled).toBeTruthy();
  });

  it('should call checkHexValue when parameterField.name = sbccallid', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('sbccallid');
    component.hexErr = false;
    const event = {
      target: {
        value: ''
      }
    };
    component.checkHexValue(event);
    expect(component.hexErr).toBeTruthy();
  });

  it('should call checkHexValue when parameterField.name = sbccallid and value is heximal format', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('sbccallid');
    component.hexErr = false;
    const event = {
      target: {
        value: '0xa35'
      }
    };
    component.checkHexValue(event);
    expect(component.hexErr).toBeFalsy();
  });

  it('should call checkHexValue when parameterField.name != sbccallid', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.hexErr = false;
    const event = {
      target: {
        value: '0xa35'
      }
    };
    component.checkHexValue(event);
    expect(component.hexErr).toBeFalsy();
  });

  it('should call onValidateTypeValue when parameterField.name = sbccallid and press Enter', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('sbccallid');
    spyOn(component, 'addCriteriaRow');
    const event = {
      key: 'Enter'
    };
    const rs = component.onValidateTypeValue(event, 0);
    expect(rs).toBeTruthy();
    expect(component.addCriteriaRow).toHaveBeenCalledWith(0);
  });

  it('should call onValidateTypeValue when valuesField.dataType = number and floatCheckflag = true', () => {
    searchConfig.valuesField.dataType = DataType.Number;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.floatCheckflag = true;
    const event = {
      key: '.'
    };
    const rs = component.onValidateTypeValue(event, 0);
    expect(rs).toBeFalsy();
  });

  it('should call onValidateTypeValue when valuesField.dataType = number and press .', () => {
    searchConfig.valuesField.dataType = DataType.Number;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.floatCheckflag = false;
    const event = {
      key: '.'
    };
    const rs = component.onValidateTypeValue(event, 0);
    expect(component.floatCheckflag).toBeTruthy();
    expect(rs).toBeTruthy();
  });

  it('should call onValidateTypeValue when valuesField.dataType = number', () => {
    searchConfig.valuesField.dataType = DataType.Number;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.floatCheckflag = true;
    const event = {
      key: 'a',
      target: {
        value: ''
      }
    };
    const rs = component.onValidateTypeValue(event, 0);
    expect(component.floatCheckflag).toBeFalsy();
    expect(rs).toBeFalsy();
  });

  it('should call enableButton', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.reset();
    component.searchCriteriaForm.addControl(searchConfig.otherFields[0].name, new FormControl());
    const rs = component.enableButton();
    expect(rs).toBeFalsy();
  });

  it('should call onSelectFieldType when valuesField.type === FieldType.MultiSelect', () => {
    searchConfig.valuesField.type = FieldType.MultiSelect;
    searchConfig.valuesField.data = {
      test: [{
        label: 'Test1',
        value: 'test',
        type: 'boolean'
      }]
    };
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.addControl(searchConfig.otherFields[0].name, new FormControl());
    component.resetValues = true;
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].setValue('test');
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('test');
    component.searchCriteriaForm.controls[searchConfig.otherFields[0].name].setValue('test');
    spyOn(component, 'updateSearchExpressions');
    component.onSelectFieldType('test');
    expect(component.searchCriteriaForm.controls[searchConfig.valuesField.name].value).toEqual([]);
    expect(component.searchCriteriaForm.controls[searchConfig.expressionField.name].value).toEqual([]);
    expect(component.searchCriteriaForm.controls[searchConfig.otherFields[0].name].value).toEqual([]);
    expect(component.updateSearchExpressions).toHaveBeenCalled();
  });

  it('should call onSelectFieldType when parameterField.type == FieldType.Dropdown', () => {
    searchConfig.valuesField.type = FieldType.Input;
    searchConfig.parameterField.type = FieldType.Dropdown;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('test');
    component.resetValues = true;
    spyOn(component, 'updateSearchExpressions');
    component.onSelectFieldType('test');
    expect(component.searchCriteriaForm.controls[searchConfig.expressionField.name].value).toEqual('');
    expect(component.updateSearchExpressions).toHaveBeenCalled();
  });

  it('should call checkClearValue', () => {
    searchConfig.parameterField.type = FieldType.Input;
    searchConfig.valuesField.dataType = DataType.Number;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].setValue('5');
    const rs = component.checkClearValue();
    expect(rs).toBeFalsy();
  });

  it('should call updateSearchExpressions with fieldtype=number and has input for expression', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.expressionNumValues = [{
      label: 'test',
      value: 'test'
    }];
    component.updateSearchExpressions('number', 1);
    expect(component.expressionValues).toEqual(component.expressionNumValues);
    expect(component.searchCriteriaForm.controls[searchConfig.valuesField.name].value).toEqual('');
  });

  it('should call updateSearchExpressions with fieldtype = number', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultExpressions();
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.expressionNumValues = undefined;
    component.updateSearchExpressions('number');
    expect(component.expressionValues).toEqual(component.expressionDefaultNumValues);
  });

  it('should call updateSearchExpressions with fieldtype = boolean', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultExpressions();
    component.initDefaultValues();
    component.expressionStrValues = [{
      label: 'test',
      value: 'test',
      type: 'boolean'
    }, {
      label: 'test1',
      value: 'test1',
      type: 'string'
    }];
    component.updateSearchExpressions('boolean');
    expect(component.expressionValues.length).toBe(1);
  });

  it('should call updateSearchExpressions with fieldtype = string', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultExpressions();
    component.initDefaultValues();
    component.expressionStrValues = [{
      label: 'test',
      value: 'test',
      type: 'input'
    }, {
      label: 'test1',
      value: 'test1',
      type: 'string'
    }];
    component.updateSearchExpressions('string');
    expect(component.expressionValues.length).toBe(1);
  });

  it('should call updateSearchExpressions with fieldtype = string when having references field in expression Field', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.expressionField = {
      name: 'comparison',
      label: 'Comparison',
      dataType: 'string',
      referencesField: 'comparison'
    };
    component.searchCriteriaForm = searchCriteriaForm;
    const value = searchCriteriaForm.value;
    value[searchConfig.parameterField.name] = 'parameterField';
    value[searchConfig.expressionField.name] = 'expressionField';
    value[searchConfig.valuesField.name] = ['valuesField'];
    component.searchCriteriaForm.setValue(value);
    component.searchCriteriaForm.controls['comparison'].setValue('vars');
    component.expressionStrValues = [{
      label: 'Update',
      value: 'update',
      type: 'input',
      referencesValue: 'vars'
    }, {
      label: 'test1',
      value: 'test1',
      type: 'string'
    }];

    component.updateSearchExpressions(DataType.String);
    expect(component.expressionValues.length).toBe(1);
  });

  it('should call updateSearchExpressions with fieldtype = enum', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultExpressions();
    component.initDefaultValues();
    component.updateSearchExpressions('enum');
    expect(component.expressionValues).toEqual(component.expressionDefaultEnumValues);
  });

  it('should call updateSearchExpressions with fieldtype = MultiSelect', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultExpressions();
    component.initDefaultValues();
    component.updateSearchExpressions(DataType.MultiSelect);
    expect(component.expressionValues).toEqual(component.expressionMultiSelectValues);
  });

  it('should call addItem', () => {
    spyOn(component.addSearches, 'emit');
    component.addItem();
    expect(component.addSearches.emit).toHaveBeenCalled();
  });

  it('should call addCriteriaRow', () => {
    spyOn(component.duplicateRow, 'emit');
    component.addCriteriaRow(0);
    expect(component.duplicateRow.emit).toHaveBeenCalledWith(0);
  });

  it('should call removeItem', () => {
    spyOn(component.removeSearch, 'emit');
    component.removeItem(0);
    expect(component.removeSearch.emit).toHaveBeenCalledWith(0);
  });

  it('should call clearItem', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    spyOn(component, 'updateSearchExpressions');
    component.clearItem();
    expect(component.updateSearchExpressions).toHaveBeenCalled();
    expect(component.searchCriteriaForm.controls[searchConfig.parameterField.name].value).toBeNull();
  });

  it('should call clearExpressions', () => {
    component.clearExpressions();
    expect(component.expressionValues.length).toEqual(0);
  });

  it('should call checkNull', () => {
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.reset();
    const rs = component.checkNull(searchConfig.parameterField.name);
    expect(rs).toBeTruthy();
  });

  it('should call checkEmpty', () => {
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('');
    const rs = component.checkEmpty(searchConfig.parameterField.name);
    expect(rs).toBeTruthy();
  });

  it('should call setValueFocusState', () => {
    component.isValuefocused = false;
    component.setValueFocusState(true);
    expect(component.isValuefocused).toBeTruthy();
  });

  it('should call getMinWidth', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.bracketsEnable = true;
    const rs = component.getMinWidth();
    expect(rs).toEqual(1100);
  });

  it('should call empty when type belongs to otherFields', () => {
    searchConfig.otherFields[0].required = true;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    const rs = component.empty(searchConfig.otherFields[0].name);
    expect(rs).toBeTruthy();
  });

  it('should call empty when type is valuesField.name and value = isNull', () => {
    component.required = true;
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('isNull');
    const rs = component.empty(searchConfig.valuesField.name);
    expect(component.searchCriteriaForm.controls[searchConfig.valuesField.name].value).toEqual('');
    expect(rs).toBeFalsy();
  });

  it('should call empty when type is expressionField.name', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('');
    component.required = false;
    const rs = component.empty(searchConfig.expressionField.name);
    expect(rs).toBeTruthy();
  });

  it('should call empty when type is valuesField.name', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('=');
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].setValue('');
    component.required = false;
    const rs = component.empty(searchConfig.valuesField.name);
    expect(rs).toBeTruthy();
  });

  it('should call empty when type is valuesField.name is null and expressionField.name is true', () => {
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.searchCriteriaForm.controls[searchConfig.parameterField.name].setValue('test');
    component.searchCriteriaForm.controls[searchConfig.expressionField.name].setValue('true');
    component.searchCriteriaForm.controls[searchConfig.valuesField.name].setValue('');
    component.required = false;
    const rs = component.empty(searchConfig.valuesField.name);
    expect(rs).toBeFalsy();
  });

  it('should have clear button', () => {
    searchCriteriaForm.addControl(searchConfig.otherFields[0].name, new FormControl());
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.index = 0;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#clear-button.p-button')).nativeElement;
    expect(el).toBeTruthy();
    spyOn(component, 'clearItem');
    el.click();
    fixture.detectChanges();
    expect(component.clearItem).toHaveBeenCalled();
  });

  it('should have remove button', () => {
    searchCriteriaForm.addControl(searchConfig.otherFields[0].name, new FormControl());
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    component.initDefaultValues();
    component.searchCriteriaForm = searchCriteriaForm;
    component.index = 1;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.p-button')).nativeElement;
    expect(el).toBeTruthy();
    spyOn(component, 'removeItem');
    el.click();
    fixture.detectChanges();
    expect(component.removeItem).toHaveBeenCalled();
  });

  it('should call onSelectDropdown function', () => {
    component.expressionField = {
      name: 'operation',
      label: 'Operation',
      dataType: 'string',
      referencesField: 'scope'
    };
    component.expressionStrValues = [{
      label: 'Update',
      value: 'update',
      type: 'input',
      referencesValue: 'vars'
    }, {
      label: 'test1',
      value: 'test1',
      type: 'string'
    }];
    component.otherFields = [{
      name: 'scope', label: 'Scope', dataType: 'string',
      data: [{ value: 'vars', label: 'vars', type: 'input', referencesValue: '' }]
    }];
    const event = 'scope';
    component.onSelectDropdown(event, 'scope');
    expect(component.expressionValues).toEqual([{
      label: 'Update',
      value: 'update',
      type: 'input',
      referencesValue: 'vars'
    }]);
  });
});

