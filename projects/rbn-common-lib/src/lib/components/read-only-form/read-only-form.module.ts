import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadOnlyFormComponent } from './read-only-form/read-only-form.component';



@NgModule({
  declarations: [
    ReadOnlyFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadOnlyFormComponent
  ]
})
export class ReadOnlyFormModule { }
