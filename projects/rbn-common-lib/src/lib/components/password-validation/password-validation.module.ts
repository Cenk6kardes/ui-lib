import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { PasswordValidationComponent } from './password-validation/password-validation.component';
import { RbnFocusPasswordModule } from '../../directives/focus-password/rbn-focus-password.module';
import { RbnMsgModule } from '../../directives/rbn-msg/rbn-msg.module';

@NgModule({
  declarations: [PasswordValidationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    TabViewModule,
    FormsModule,
    RbnFocusPasswordModule,
    RbnMsgModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    PasswordValidationComponent
  ]
})
export class PasswordValidationModule { }
