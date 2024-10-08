import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogLoaderComponent } from './dialog-loader/dialog-loader.component';



@NgModule({
  declarations: [
    DialogLoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogLoaderComponent
  ]
})
export class DialogLoaderModule { }
