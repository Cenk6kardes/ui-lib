import { NgModule } from '@angular/core';
import { RbnMsgDirective } from './rbn-msg.directive';

@NgModule({
  declarations: [RbnMsgDirective],
  exports: [
    RbnMsgDirective
  ]
})
export class RbnMsgModule { }
