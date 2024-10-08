import { Component, OnInit } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-singleselect',
  templateUrl: './dynamic-singleselect.component.html',
  styleUrls: ['./dynamic-singleselect.component.scss']
})
export class DynamicSingleselectComponent extends DynamicBaseComponent implements OnInit {

  dropdownOption: any = [];
  constructor() {
    super();
    this.defaultOptions.templateOptions = { options: [] };
  }

  ngOnInit() {
    this.dropdownOption = this.props.options;
  }

  getDescription(element) {
    const indexDescription = this.dropdownOption.findIndex(item => item.value === element.value);
    return this.dropdownOption
      && this.dropdownOption[indexDescription]
      && this.dropdownOption[indexDescription].description || '';
  }
}
