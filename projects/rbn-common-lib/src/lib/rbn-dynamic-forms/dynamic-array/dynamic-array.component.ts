import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

export enum ArrayFieldStyles {
  EMS_DM = 'ems-dm',
  LIST_ARRAY_FIELD = 'list-array-field'
};
@Component({
  selector: 'rbn-dynamic-array',
  templateUrl: './dynamic-array.component.html',
  styleUrls: ['./dynamic-array.component.scss']
})
export class DynamicArrayComponent extends FieldArrayType implements OnInit {

  maxItems: number;
  minItems: number;
  eStyles = ArrayFieldStyles;

  constructor() {
    super();
  }

  ngOnInit() {
    this.maxItems = this.props.maxItems;
    this.minItems =this.props.minItems;
    this.props.collapse = true;

    // FOR EMS_DM, adding id for different interfaces
    if (this.props['style'] === this.eStyles.EMS_DM) {
      this.field?.fieldGroup?.forEach(group => {
        const interfaceType = group?.model?.interfaceType;
        group?.fieldGroup?.forEach(item => {
          item.id = `${interfaceType}_${item?.id}`;
        });
      });
    }

    if (this.model && this.props?.forceExpand) {
      this.forceExpand();
    }
  }

  forceExpand() {
    this.props.collapse = false;
  }
  onTabOpen() {
    this.props.collapse = false;
  }

  onTabClose() {
    this.props.collapse = true;
  }

  isShowAdd() {
    if (!this.maxItems) {
      return true;
    }
    const currentLength = this.field?.fieldGroup?.length || 0;
    return this.maxItems > currentLength;
  }

  isShowRemove() {
    if (!this.minItems) {
      return true;
    }
    const currentLength = this.field?.fieldGroup?.length || 0;
    return this.minItems < currentLength;
  }

  checkHideRemoveButtonByIndex(index) {
    let fixedIndexs: any = [];
    if (this.field.props && this.field.props.fixedIndexs) {
      fixedIndexs = this.field.props.fixedIndexs;
      return !fixedIndexs.includes(index);
    }
    return true;
  }
}
