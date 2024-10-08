import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { SecurityRealmsInterfaceService } from '../services/security-realms-interface.service';

@Component({
  selector: 'rbn-security-realms-delete',
  templateUrl: './security-realms-delete.component.html'
})
export class SecurityRealmsDeleteComponent {

  @Input() isShowContent = false;
  @Input() realm?: any | undefined;
  @Output() emitCloseDelete = new EventEmitter();

  constructor(@Inject('SecurityRealmsInterfaceService') private securRealmsService: SecurityRealmsInterfaceService) { }

  deleteSecurityRealm() {
    this.securRealmsService.deleteSecurityRealm(this.realm.name).subscribe(() => {
      this.emitCloseDelete.emit(true);
    },
    err => {
      this.emitCloseDelete.emit(false);
    });
  }

  securityRealmCloseDialogDelete() {
    this.emitCloseDelete.emit(false);
  }

  onClickCancel() {
    this.isShowContent = false;
  }


}
