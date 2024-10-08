import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class SearchArrayForm {
  myForm: any;
  expressionStrValues = [
    { label: 'Equals', value: 'equals', type: 'input' },
    { label: 'Not Equals', value: 'ne', type: 'input' },
    { label: 'Null', value: 'isNull', type: 'input_boolean' },
    { label: 'Not Null', value: '!isNull', type: 'input_boolean' },
    { label: 'Null', value: 'isNull', type: 'boolean' },
    { label: 'Not Null', value: '!isNull', type: 'boolean' },
    { label: 'False', value: 'false', type: 'boolean' },
    { label: 'True', value: 'true', type: 'boolean' },
    { label: 'Starts With', value: 'iStartsWith', type: 'input' },
    { label: 'Not Starts With', value: '!iStartsWith', type: 'input' },
    { label: 'Ends With', value: 'iEndsWith', type: 'input' },
    { label: 'Not Ends With', value: '!iEndsWith', type: 'input' },
    { label: 'Contains', value: 'iContains', type: 'input' },
    { label: 'Not Contains', value: '!iContains', type: 'input' },
    { label: 'Like', value: 'iLike', type: 'input' },
    { label: 'Not Like', value: '!iLike', type: 'input' },
    { label: 'Regex', value: 'iRegexp', type: 'input' },
    { label: 'Not Regex', value: '!iRegexp', type: 'input' },
    { label: 'Starts With [Ab]', value: 'startsWith', type: 'input' },
    { label: 'Ends With [Ab]', value: 'endsWith', type: 'input' },
    { label: 'Contains [Ab]', value: 'contains', type: 'input' },
    { label: 'Not Contains [Ab]', value: '!contains', type: 'input' },
    { label: 'Like [Ab]', value: 'like', type: 'input' },
    { label: 'Not Like [Ab]', value: '!like', type: 'input' },
    { label: 'Regex [Ab]', value: 'regexp', type: 'input' },
    { label: 'Not Regex [Ab]', value: '!regexp', type: 'input' }
  ];

  expressionNumValues = [
    { label: '=', value: 'equals', type: 'input' },
    { label: '!=', value: 'ne', type: 'input' },
    { label: '<', value: 'lt', type: 'input' },
    { label: '<=', value: 'le', type: 'input' },
    { label: '>', value: 'gt', type: 'input' },
    { label: '>=', value: 'ge', type: 'input' },
    { label: 'Starts With', value: 'iStartsWith', type: 'input' },
    { label: 'Not Starts With', value: '!iStartsWith', type: 'input' },
    { label: 'Ends With', value: 'iEndsWith', type: 'input' },
    { label: 'Not Ends With', value: '!iEndsWith', type: 'input' },
    { label: 'Contains', value: 'iContains', type: 'input' },
    { label: 'Not Contains', value: '!iContains', type: 'input' },
    { label: 'Null', value: 'isNull', type: 'input' },
    { label: 'Not Null', value: '!isNull', type: 'input' }
  ];

  constructor(private fb: FormBuilder) {
  }

  createForm = () => {
    this.myForm = this.fb.group({
      searches: this.fb.array([])
    });
  };

  getSearchExpressions() {
    const searchArray = this.myForm.get('searches').value;
    const expressionArray = [];
    if (searchArray[0] && !this.isEmptyObject(searchArray[0].comparison)) {
      for (const entry of Object.keys(searchArray)) {
        const expression = {};
        for (const value of Object.keys(searchArray[entry])) {
          if (searchArray[entry][value] !== '') {
            if (searchArray[entry]['fieldId'] &&
                            searchArray[entry]['fieldId'] === 'sbccallid' &&
                            searchArray[entry]['values'] &&
                            searchArray[entry]['values'].toString().match(/^0x[\da-f]+$/i)
            ) {
              searchArray[entry]['values'] = parseInt(searchArray[entry]['values'], 16).toString();
            }
            if (value === 'values') {
              if (typeof searchArray[entry][value] === 'string') {
                const valuesArray = searchArray[entry][value].replace(/^\s+|\s+$/g, '').split('\n');
                expression[value] = valuesArray;
              } else {
                expression[value] = searchArray[entry][value].slice(0);
              }
            } else if (value === 'comparison') {
              expression['comparisonNegation'] = false;
              let expressionStr = searchArray[entry][value];
              if (expressionStr.includes('!')) {
                expression['comparisonNegation'] = true;
                expressionStr = expressionStr.replace(/\!/g, '');
              }
              if ((expressionStr.includes('true')) || (expressionStr.includes('false'))) {
                switch (expressionStr) {
                  case 'true':
                    expression['values'] = [true];
                    break;
                  case 'false':
                    expression['values'] = [false];
                    break;
                }
                expressionStr = 'equals';
              }
              expression[value] = expressionStr;
            } else {
              expression[value] = searchArray[entry][value];
            }
          }
          if (!this.isEmptyObject(expression)) {
            expression['multiValueOperator'] = 'or';
          }
        }
        if (!this.isEmptyObject(expression)) {
          expressionArray.push(JSON.parse(JSON.stringify(expression)));
        }
      }
    }

    const hasOrDups = {};
    let i = 0;
    const criteriaArray = [];
    for (const criteriaItem of Object.keys(expressionArray)) {
      const operator = expressionArray[criteriaItem]['operator'];
      const value = expressionArray[criteriaItem]['values'];

      if (operator === 'or' || !operator) {

        const combine = expressionArray[criteriaItem]['comparison'] + expressionArray[criteriaItem]['fieldId'];

        if (hasOrDups[combine] !== undefined) {
          const index = hasOrDups[combine];
          if (criteriaArray[index] && Array.isArray(criteriaArray[index]['values'])) {
            if (operator === 'and') {
              criteriaArray[index]['multiValueOperator'] = 'and';
            }
            criteriaArray[index]['values'].push(...value);
          } else {
            criteriaArray[index]['values'] = [criteriaArray[index]['values'], ...value];
          }
          continue;
        } else {
          criteriaArray.push(expressionArray[criteriaItem]);
          hasOrDups[combine] = i;
        }

      } else {
        criteriaArray.push(expressionArray[criteriaItem]);
      }
      i += 1;
    }
    return criteriaArray;
  }

  isEmptyObject(obj) {
    if (obj) {
      for (const key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
    }
    return true;
  }
}

