import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageToggleHiddenComponent } from './message-toggle-hidden/message-toggle-hidden.component';
import { MessageToggleComponent } from './message-toggle/message-toggle.component';


@NgModule({
  declarations: [
    MessageToggleComponent,
    MessageToggleHiddenComponent
  ],
  imports: [
    CommonModule,
    ToastModule
  ],
  exports: [
    MessageToggleComponent
  ]
})
export class MessageToggleModule { }
