import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-wrapper-group',
  templateUrl: './dynamic-wrapper-group.component.html',
  styleUrls: ['./dynamic-wrapper-group.component.scss']
})
export class DynamicWrapperGroupComponent extends FieldWrapper implements OnInit {

  numberOfElementsChanged = 0;
  constructor() {
    super();
  }

  ngOnInit() {
    this.props.id = this.props.id ? this.props.id : this.props.label ? 'panel-' + this.props.label.split(' ').join('-').toLowerCase() : '';
  }

  get displaySecondary(): boolean {
    return typeof this.props?.toolbar?.displaySecondary === 'boolean' ? this.props.toolbar.displaySecondary : true;
  }

  updateNumberOfElementsChanged(value: number): void {
    this.numberOfElementsChanged += value;
  }

}
