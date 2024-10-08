import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueComponent } from './key-value/key-value.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
  declarations: [
    KeyValueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule
  ],
  exports: [
    KeyValueComponent
  ]
})
export class KeyValueModule { }
