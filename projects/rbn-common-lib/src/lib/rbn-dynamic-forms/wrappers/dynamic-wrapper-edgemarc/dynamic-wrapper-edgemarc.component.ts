import { Component, ComponentRef, OnInit } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { DynamicWrapperGroupComponent } from '../../dynamic-wrapper-group/dynamic-wrapper-group.component';

@Component({
  selector: 'rbn-dynamic-wrapper-edgemarc',
  templateUrl: './dynamic-wrapper-edgemarc.component.html',
  styleUrls: ['./dynamic-wrapper-edgemarc.component.scss']
})
export class DynamicWrapperEdgemarcComponent extends FieldWrapper implements OnInit {
  chkboxEnabled = false;
  displayPushParamLabel = false;
  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.field.fieldGroup) {
      this.displayPushParamLabel = true;
    } else {
      this.displayPushParamLabel = false;
    }
    if (!this.field?.fieldGroupClassName) {
      this.field.fieldGroupClassName = 'test-class';
    }
    this.enableFields(this.field.fieldGroup,  { checked: false });
    this.field.fieldGroup?.forEach(group => {
      if (group && group.type === 'rbn-checkbox') {
        // adding a class with padding of 0.5rem
        group.className = 'pt-half-rem';
      }
    });
  }
  onCheckboxChange(fieldGroup: FormlyFieldConfig[] = [] , event: any): void {
    const componentRefs = (this.field.parent as any)?._componentRefs;
    const component: ComponentRef<DynamicWrapperGroupComponent>
      = componentRefs.find((com: any) => com.instance instanceof DynamicWrapperGroupComponent);
    if(event.checked) {
      component.instance.updateNumberOfElementsChanged(+1);
    } else {
      component.instance.updateNumberOfElementsChanged(-1);
    }
    this.enableFields(fieldGroup, event);
  }
  enableFields(fieldGroup: FormlyFieldConfig[] = [] , event: any): void {
    fieldGroup.forEach(group => {
      if (group && group.props) {
        // if fieldGroup has an expression of props.disbaled, then ignore that field
        if(!(group.expressions && group.expressions.hasOwnProperty('props.disabled'))) {
          group.props.disabled = !event.checked;
        }
      }
      if(group.fieldGroup) {
        this.enableFields(group.fieldGroup, event);
      }
    });
  }
}
