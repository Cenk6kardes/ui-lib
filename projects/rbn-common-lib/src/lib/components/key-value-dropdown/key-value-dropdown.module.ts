import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { KeyValueDropdownComponent } from './key-value-dropdown/key-value-dropdown.component';



@NgModule({
  declarations: [
    KeyValueDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule
  ],
  exports: [
    KeyValueDropdownComponent
  ]
})
export class KeyValueDropdownModule { }
