import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { TooltipModule } from 'primeng/tooltip';
import { FormControlValidationDirective } from '../../directives/form-control-validation.directive';
import { FormGroupValidationDirective } from '../../directives/form-group-validation.directive';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { FieldErrorComponent } from '../stepper/field-error/field-error.component';
import { StepperConfirmBoxComponent } from './stepper-tab/stepper-confirm-box/stepper-confirm-box.component';
import { StepperTabComponent } from './stepper-tab/stepper-tab.component';
import { StepperComponent } from './stepper.component';


@NgModule({
  declarations: [
    StepperComponent,
    StepperTabComponent,
    StepperConfirmBoxComponent,
    FieldErrorComponent,
    FormGroupValidationDirective,
    FormControlValidationDirective
  ],
  imports: [
    CommonModule,
    StepsModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    StepperComponent,
    StepperTabComponent,
    StepperConfirmBoxComponent,
    FieldErrorComponent,
    FormControlValidationDirective,
    FormGroupValidationDirective
  ]
})
export class StepperModule { }
