import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rbn-field-view',
  styleUrls: ['../field-search.scss'],
  templateUrl: 'fieldview.component.html'
})
export class FieldViewComponent implements OnInit {

  @Input() data: any;
  @Input() header: any;
  @Input() type: any;
  @Input() inputDisable: any;
  showOperator = false;

  formClass = 'protect-query-builder--form';

  addClass = 'p-grid p-align-center protect-query-builder--row--nobrackets';

  viewData = [];
  viewHeader = [];
  hideOperatorCol = false;

  readonly numberType = ['number', 'integer', 'short', 'int', 'long', 'float', 'double'];
  strExpression = {
    'equals': 'Equals',
    'ne': 'Not Equals',
    'isNull': 'Null',
    '!isNull': 'Not Null',
    'false': 'False',
    'true': 'True',
    'iStartsWith': 'Starts With',
    '!iStartsWith': 'Not Starts With',
    'iEndsWith': 'Ends With',
    '!iEndsWith': 'Not Ends With',
    'iContains': 'Contains',
    '!iContains': 'Not Contains',
    'iLike': 'Like',
    '!iLike': 'Not Like',
    'iRegexp': 'Regex',
    '!iRegexp': 'Not Regex',
    'startsWith': 'Starts With [Ab]',
    'endsWith': 'Ends With [Ab]',
    'contains': 'Contains [Ab]',
    '!contains': 'Not Contains [Ab]',
    'like': 'Like [Ab]',
    '!like': 'Not Like [Ab]',
    'regexp': 'Regex [Ab]',
    '!regexp': 'Not Regex [Ab]'

  };

  intExpression = {
    'equals': '=',
    'ne': '!=',
    'lt': '<',
    'le': '<=',
    'gt': '>',
    'ge': '>=',
    'iStartsWith': 'Starts With',
    '!iStartsWith': 'Not Starts With',
    'iEndsWith': 'Ends With',
    '!iEndsWith': 'Not Ends With',
    'iContains': 'Contains',
    '!iContains': 'Not Contains',
    'isNull': 'Null',
    '!isNull': 'Not Null'
  };

  ngOnInit() {
    if (this.type === 'condExpression') {
      for (const x of Object.keys(this.data)) {
        this.viewData.push({
          'fieldId': this.data[x].fieldId,
          'expression': this.findDataType(this.data[x]),
          'operator': this.data[x].operator ? this.data[x].operator : '',
          'values': this.data[x].values[0]
        });
      }
      this.showOperator = true;
    } else if (this.type === 'incidentExpression') {
      for (const x of Object.keys(this.data)) {
        this.viewData.push({
          'fieldId': this.data[x].fieldId,
          'ruleValue': this.data[x].ruleValue,
          'operator': this.data[x].operator ? this.data[x].operator : '',
          'values': this.data[x].values[0]
        });
      }
      this.showOperator = true;
    } else {
      this.viewData = this.data;
      this.formClass += '--nooperator';
    }

    for (const x of Object.keys(this.header)) {
      if (this.header[x].isvisible) {
        this.viewHeader.push(this.header[x]);
      }
    }

    this.addClass += this.viewHeader.length === 2 ? '--twocol' : '';
    this.hideOperatorCol = this.viewHeader.length === 2 ? false : true;
    this.formClass = this.viewData.length > 1 ? this.formClass : '';
  }


  findDataType(row) {
    const x = (this.numberType.indexOf(row['dataType']) !== -1) ?
      this.intExpression[row.comparison] : this.strExpression[row.comparison];
    return x;
  }
}
