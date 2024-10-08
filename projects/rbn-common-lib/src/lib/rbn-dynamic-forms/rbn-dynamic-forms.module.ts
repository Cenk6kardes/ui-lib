import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';

import { DynamicBaseComponent } from './dynamic-base/dynamic-base.component';
import { DynamicButtonComponent } from './dynamic-button/dynamic-button.component';
import { DynamicCheckboxComponent } from './dynamic-checkbox/dynamic-checkbox.component';
import { DynamicRadioboxComponent } from './dynamic-radiobox/dynamic-radiobox.component';
import { DynamicTextareaComponent } from './dynamic-textarea/dynamic-textarea.component';
import { DynamicWrapperFieldComponent } from './dynamic-wrapper-field/dynamic-wrapper-field.component';
import { DynamicPanelComponent } from './dynamic-panel/dynamic-panel.component';
import { DynamicSingleselectComponent } from './dynamic-singleselect/dynamic-singleselect.component';
import { DynamicMultiselectComponent } from './dynamic-multiselect/dynamic-multiselect.component';
import { DynamicArrayComponent } from './dynamic-array/dynamic-array.component';
import { DynamicFileInputComponent } from './dynamic-file-input/dynamic-file-input.component';
import { DynamicObjectComponent } from './dynamic-object/dynamic-object.component';
import { HttpLoaderFactory } from '../shared/http-loader';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { RbnFormControlTypes } from './rbn-form-controls';
import { RbnFormValidators } from './rbn-form-validators';
import { DynamicWrapperGroupComponent } from './dynamic-wrapper-group/dynamic-wrapper-group.component';
import { DynamicWrapperSubGroupComponent } from './dynamic-wrapper-sub-group/dynamic-wrapper-sub-group.component';
import { RbnValidationMessages } from './rbn-validation-messages';
import { DynamicSwitchComponent } from './dynamic-switch/dynamic-switch.component';
import { DynamicDatetimepickerComponent } from './dynamic-datetimepicker/dynamic-datetimepicker.component';
import { DynamicCheckboxInputComponent } from './dynamic-checkbox-input/dynamic-checkbox-input.component';
import { FormToolbarModule } from '../components/form-toolbar/form-toolbar.module';
import { DynamicWrapperCardComponent } from './wrappers/dynamic-wrapper-card/dynamic-wrapper-card.component';
import { DynamicWrapperCardGroupComponent } from './wrappers/dynamic-wrapper-card-group/dynamic-wrapper-card-group.component';
import { DynamicLabelComponent } from './dynamic-label/dynamic-label.component';
import { DynamicFileUploadsComponent } from './dynamic-file-uploads/dynamic-file-uploads.component';
import { MessageModule } from '../components/message/message.module';
import { DragDropModule } from 'primeng/dragdrop';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from '../components/confirm-dialog/confirm-dialog.module';
import { FileUploadModule } from '../components/file-upload/file-upload.module';
import { DynamicMessagesComponent } from './dynamic-messages/dynamic-messages.component';
import { DialogModule } from 'primeng/dialog';
import { PanelMessagesModule } from '../components/panel-mesages/panel-messages.module';
import { DynamicShowPasswordComponent } from './dynamic-show-password/dynamic-show-password.component';
import { DynamicWrapperEdgemarcComponent } from './wrappers/dynamic-wrapper-edgemarc/dynamic-wrapper-edgemarc.component';



export function formlyValidationConfig(translate: TranslateService) {
  return {
    validationMessages: [
      { name: 'required', message: function () {
        return translate.stream('VALIDATION.REQUIRED');
      } },
      {
        name: 'minLength',
        message: function (err, field) {
          let message = '';
          if (field.type === 'rbn-multiselect') {
            message = field.templateOptions.minLength > 1 ? 'VALIDATION.MINLENGTH_ITEMS' : 'VALIDATION.MINLENGTH_ITEM';
          } else {
            message = field.templateOptions.minLength > 1 ? 'VALIDATION.MINLENGTH_CHARACTERS' : 'VALIDATION.MINLENGTH_CHARACTER';
          }
          return getTranslate(translate, message, field.templateOptions.minLength);
        }
      },
      {
        name: 'maxLength',
        message: function (err, field) {
          let message = '';
          if (field.type === 'rbn-multiselect') {
            message = field.templateOptions.maxLength > 1 ? 'VALIDATION.MAXLENGTH_ITEMS' : 'VALIDATION.MAXLENGTH_ITEM';
          } else {
            message = field.templateOptions.maxLength > 1 ? 'VALIDATION.MAXLENGTH_CHARACTERS' : 'VALIDATION.MAXLENGTH_CHARACTER';
          }
          return getTranslate(translate, message, field.templateOptions.maxLength);
        }
      },
      {
        name: 'min',
        message: function (err, field) {
          return getTranslate(translate, 'VALIDATION.MIN', field.templateOptions.min);
        }
      },
      {
        name: 'max',
        message: function (err, field) {
          return getTranslate(translate, 'VALIDATION.MAX', field.templateOptions.max);
        }
      },
      {
        name: 'pattern',
        message: function (err, field) {
          return getTranslate(translate, 'VALIDATION.PATTERN', field.templateOptions.pattern);
        }
      },
      { name: 'email', message: translate.stream('VALIDATION.EMAIL') }
    ]
  };
}
function getTranslate(translate: TranslateService, key: string, newText: string) {
  return translate.stream(key).pipe(map(function (res) {
    return res.replace('{0}', newText);
  }));
}

// @dynamic
@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicBaseComponent,
    DynamicButtonComponent,
    DynamicCheckboxComponent,
    DynamicCheckboxInputComponent,
    DynamicRadioboxComponent,
    DynamicTextareaComponent,
    DynamicWrapperFieldComponent,
    DynamicPanelComponent,
    DynamicSingleselectComponent,
    DynamicArrayComponent,
    DynamicFileInputComponent,
    DynamicObjectComponent,
    DynamicMultiselectComponent,
    DynamicWrapperGroupComponent,
    DynamicWrapperSubGroupComponent,
    DynamicSwitchComponent,
    DynamicDatetimepickerComponent,
    DynamicWrapperCardComponent,
    DynamicWrapperCardGroupComponent,
    DynamicLabelComponent,
    DynamicFileUploadsComponent,
    DynamicMessagesComponent,
    DynamicShowPasswordComponent,
    DynamicWrapperEdgemarcComponent

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormlyPrimeNGModule,
    FormlySelectModule,
    ButtonModule,
    PanelModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    TooltipModule,
    InputSwitchModule,
    RadioButtonModule,
    DropdownModule,
    AccordionModule,
    MultiSelectModule,
    CalendarModule,
    FormsModule,
    FormToolbarModule,
    MessageModule,
    DragDropModule,
    ToastModule,
    ProgressBarModule,
    ConfirmDialogModule,
    FileUploadModule,
    DialogModule,
    PanelMessagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormlyModule.forRoot({
      types: RbnFormControlTypes,
      validators: RbnFormValidators,
      validationMessages: RbnValidationMessages,
      wrappers: [
        { name: 'rbn-form-panel', component: DynamicPanelComponent },
        { name: 'rbn-wrapper-field', component: DynamicWrapperFieldComponent },
        { name: 'rbn-form-group', component: DynamicWrapperGroupComponent },
        { name: 'rbn-form-sub-group', component: DynamicWrapperSubGroupComponent },
        { name: 'rbn-form-chk-group', component: DynamicCheckboxInputComponent },
        { name: 'rbn-form-card', component: DynamicWrapperCardComponent },
        { name: 'rbn-form-card-group', component: DynamicWrapperCardGroupComponent },
        { name: 'rbn-form-ev', component: DynamicWrapperEdgemarcComponent }
      ],
      extras: {
        resetFieldOnHide: false
      }
    })
  ],
  exports: [
    DynamicFormComponent,
    DynamicButtonComponent,
    DynamicCheckboxComponent,
    DynamicCheckboxInputComponent,
    DynamicRadioboxComponent,
    DynamicTextareaComponent,
    DynamicWrapperFieldComponent,
    DynamicPanelComponent,
    DynamicSingleselectComponent,
    DynamicArrayComponent,
    DynamicFileInputComponent,
    DynamicWrapperGroupComponent,
    DynamicWrapperSubGroupComponent,
    DynamicWrapperCardComponent,
    DynamicWrapperCardGroupComponent,
    DynamicFileUploadsComponent,
    DynamicMessagesComponent,
    DynamicWrapperEdgemarcComponent
  ],
  providers: [
    { provide: FORMLY_CONFIG, multi: true, useFactory: formlyValidationConfig, deps: [TranslateService] }
  ]
})
export class RbnDynamicFormsModule { }

