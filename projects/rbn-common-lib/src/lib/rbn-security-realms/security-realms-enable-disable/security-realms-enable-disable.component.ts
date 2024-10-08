import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { SecurityRealmsInterfaceService } from '../services/security-realms-interface.service';

@Component({
  selector: 'rbn-security-realms-enable-disable',
  templateUrl: './security-realms-enable-disable.component.html'
})
export class SecurityRealmsEnableDisableComponent {

  @Input() isShowContent = false;
  @Input() realm?: any | undefined;
  @Input() isEnableSelected = false;
  @Input() isDisableSelected = false;
  @Output() emitCloseEnableDisable = new EventEmitter();

  constructor(@Inject('SecurityRealmsInterfaceService') private securRealmsService: SecurityRealmsInterfaceService) { }

  securityRealmCloseDialogEnableDisable() {
    this.emitCloseEnableDisable.emit(false);
  }

  enableSecurityRealm() {
    this.formatDataRealm();
    this.realm.enabled = true;
    this.securRealmsService.updateSecurityRealm(this.realm).subscribe(() => {
      this.emitCloseEnableDisable.emit(true);
    },
    err => {
      if (err.status === 403) {
        this.emitCloseEnableDisable.emit(false);
      } else {
        this.emitCloseEnableDisable.emit(true);
      }
    });
  }

  disableSecurityRealm() {
    this.formatDataRealm();
    this.realm.enabled = false;
    this.securRealmsService.updateSecurityRealm(this.realm).subscribe(() => {
      this.emitCloseEnableDisable.emit(true);
    },
    err => {
      if (err.status === 403) {
        this.emitCloseEnableDisable.emit(false);
      } else {
        this.emitCloseEnableDisable.emit(true);
      }
    });
  }

  formatDataRealm() {
    if (this.realm) {
      // Delete item added into datatable on security realms component
      if (this.realm.hasOwnProperty('actions')) {
        delete this.realm['actions'];
      }
      if (this.realm.hasOwnProperty('ngModel')) {
        delete this.realm['ngModel'];
      }
    }
  }

  closeDialog() {
    this.isShowContent = false;
  }

}
