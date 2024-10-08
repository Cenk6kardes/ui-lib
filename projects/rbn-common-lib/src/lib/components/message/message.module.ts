import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule
  ],
  exports: [
    MessageComponent
  ]
})
export class MessageModule { }
