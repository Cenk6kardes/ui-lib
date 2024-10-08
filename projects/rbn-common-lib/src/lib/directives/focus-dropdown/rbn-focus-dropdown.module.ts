import { NgModule } from '@angular/core';
import { RbnFocusDropdownTemplateDirective } from './rbn-focus-dropdown-template.directive';
import { RbnFocusDropdownDirective } from './rbn-focus-dropdown.directive';
import { RbnFocusDropdownSelectedOptionDirective } from './rbn-focus-dropdown-selected-option.directive';

@NgModule({
  declarations: [
    RbnFocusDropdownDirective,
    RbnFocusDropdownTemplateDirective,
    RbnFocusDropdownSelectedOptionDirective
  ],
  exports: [
    RbnFocusDropdownDirective,
    RbnFocusDropdownTemplateDirective,
    RbnFocusDropdownSelectedOptionDirective
  ]
})
export class RbnFocusDropdownModule { }
