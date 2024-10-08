import { NgModule } from '@angular/core';
import { RbnFocusSliderDirective } from './rbn-focus-slider.directive';

@NgModule({
  declarations: [RbnFocusSliderDirective],
  exports: [
    RbnFocusSliderDirective
  ]
})
export class RbnFocusSliderModule { }
