import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ServicesCardComponent } from './services-card/services-card.component';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    ServicesCardComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    TooltipModule
  ],
  exports: [
    ServicesCardComponent
  ]
})
export class ServicesCardModule { }
