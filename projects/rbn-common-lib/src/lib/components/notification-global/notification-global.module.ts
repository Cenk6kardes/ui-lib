import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationGlobalComponent } from './notification-global/notification-global.component';



@NgModule({
  declarations: [
    NotificationGlobalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotificationGlobalComponent
  ]
})
export class NotificationGlobalModule { }
