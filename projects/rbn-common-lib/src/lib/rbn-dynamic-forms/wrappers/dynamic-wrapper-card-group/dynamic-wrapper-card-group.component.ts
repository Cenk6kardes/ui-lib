import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-wrapper-card-group',
  templateUrl: './dynamic-wrapper-card-group.component.html',
  styleUrls: ['./dynamic-wrapper-card-group.component.css']
})
export class DynamicWrapperCardGroupComponent extends FieldWrapper implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.field?.fieldGroupClassName) {
      this.field.fieldGroupClassName = 'p-grid';
    }

    this.field.fieldGroup.forEach(groupItem => {
      if (!groupItem?.className) {
        groupItem.className = 'p-col-12 p-md-6';
      } else if (groupItem.className.indexOf('p-') === -1) {
        groupItem.className += ' p-col-12 p-md-6';
      }
    });
  }

}
