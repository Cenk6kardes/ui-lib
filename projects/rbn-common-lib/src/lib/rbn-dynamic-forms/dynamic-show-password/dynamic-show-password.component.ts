import { Component, OnInit } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-show-password',
  templateUrl: './dynamic-show-password.component.html',
  styleUrls: ['./dynamic-show-password.component.scss']
})
export class DynamicShowPasswordComponent extends DynamicBaseComponent {

  showPasswordType = {
    password: false
  };

  constructor() {
    super();
  }

  showHidePassword() {
    this.showPasswordType['password'] = !this.showPasswordType['password'];
  }

}
