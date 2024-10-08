import { NgModule } from '@angular/core';
import { RbnFocusDropdownDirective } from '../focus-dropdown/rbn-focus-dropdown.directive';
import { RbnFocusTableDirective } from './rbn-focus-table.directive';

@NgModule({
  declarations: [RbnFocusTableDirective],
  exports: [RbnFocusTableDirective],
  providers: [RbnFocusDropdownDirective]
})

export class RbnFocusTableModule { }
