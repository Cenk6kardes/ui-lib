import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RbnFocusSplitButtonModule } from '../../directives/rbn-focus-splitbutton/rbn-focus-splitbutton.module';



@NgModule({
  declarations: [
    TopbarComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SplitButtonModule,
    RbnFocusSplitButtonModule
  ],
  exports: [
    TopbarComponent
  ]
})
export class TopbarModule { }
