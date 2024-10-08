import { Component, OnInit } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-multiselect',
  templateUrl: './dynamic-multiselect.component.html',
  styleUrls: ['./dynamic-multiselect.component.scss']
})
export class DynamicMultiselectComponent  extends DynamicBaseComponent implements OnInit {

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
    return this.dropdownOption[indexDescription].description || '';
  }
}
