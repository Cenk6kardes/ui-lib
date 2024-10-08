import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { RbnDynamicFormsModule } from './rbn-dynamic-forms/rbn-dynamic-forms.module';
import { RbnSecurityRealmsModule } from './rbn-security-realms/rbn-security-realms.module';
import { RbnCommonTableModule } from './rbn-common-table/rbn-common-table-lib.module';
import { RbnTimePickerModule } from './rbn-time-picker/rbn-time-picker-lib.module';
import { FieldSearchViewModule } from './field-search/view/field-search-view.module';
import { FieldSearchModule } from './field-search/field-search.module';
import { ConfirmDialogModule } from './components/confirm-dialog/confirm-dialog.module';
import { DaterangepickerModule } from './components/daterangepicker/daterangepicker.module';
import { DialogLoaderModule } from './components/dialog-loader/dialog-loader.module';
import { FileUploadModule } from './components/file-upload/file-upload.module';
import { MessageModule } from './components/message/message.module';
import { HeaderalertModule } from './components/headeralert/headeralert.module';
import { HeaderlogoModule } from './components/headerlogo/headerlogo.module';
import { HeaderuserModule } from './components/headeruser/headeruser.module';
import { NotificationsModule } from './components/notifications/notifications.module';
import { KeyValueModule } from './components/key-value/key-value.module';
import { KeyValueDropdownModule } from './components/key-value-dropdown/key-value-dropdown.module';
import { LoginModule } from './components/login/login.module';
import { NotificationGlobalModule } from './components/notification-global/notification-global.module';
import { PageHeaderModule } from './components/page-header/page-header.module';
import { PageTopModule } from './components/page-top/page-top.module';
import { ProfileModule } from './components/profile/profile.module';
import { ReadOnlyFormModule } from './components/read-only-form/read-only-form.module';
import { SearchGlobalModule } from './components/search-global/search-global.module';
import { ServicesCardModule } from './components/services-card/services-card.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { SidenavModule } from './components/sidenav/sidenav.module';
import { StepperModule } from './components/stepper/stepper.module';
import { TopbarModule } from './components/topbar/topbar.module';
import { PickListTableModule } from './components/pick-list/pick-list.module';
import { MessageToggleModule } from './components/message-toggle/message-toggle.module';
import { PasswordValidationModule } from './components/password-validation/password-validation.module';
import { PanelMessagesModule } from './components/panel-mesages/panel-messages.module';
import { DynamicTabsModule } from './components/dynamic-tabs/dynamic-tabs.module';
import { AttributeListModule } from './components/attribute-list/attribute-list.module';

@NgModule({
  imports: [
    RbnSecurityRealmsModule,
    RbnCommonTableModule,
    RbnTimePickerModule,
    FieldSearchViewModule,
    FieldSearchModule,
    RbnDynamicFormsModule,
    ConfirmDialogModule,
    DynamicTabsModule,
    AttributeListModule,
    DaterangepickerModule,
    DialogLoaderModule,
    FileUploadModule,
    MessageModule,
    HeaderalertModule,
    HeaderlogoModule,
    HeaderuserModule,
    NotificationsModule,
    KeyValueModule,
    KeyValueDropdownModule,
    LoginModule,
    NotificationGlobalModule,
    PageHeaderModule,
    PageTopModule,
    ProfileModule,
    ReadOnlyFormModule,
    SearchGlobalModule,
    ServicesCardModule,
    SidebarModule,
    SidenavModule,
    StepperModule,
    TopbarModule,
    PickListTableModule,
    MessageToggleModule,
    PasswordValidationModule,
    PanelMessagesModule
  ],
  declarations: [
  ],
  exports: [
    RbnSecurityRealmsModule,
    RbnCommonTableModule,
    RbnTimePickerModule,
    FieldSearchViewModule,
    FieldSearchModule,
    RbnDynamicFormsModule,
    ConfirmDialogModule,
    DynamicTabsModule,
    AttributeListModule,
    DaterangepickerModule,
    DialogLoaderModule,
    FileUploadModule,
    MessageModule,
    HeaderalertModule,
    HeaderlogoModule,
    HeaderuserModule,
    NotificationsModule,
    KeyValueModule,
    KeyValueDropdownModule,
    LoginModule,
    NotificationGlobalModule,
    PageHeaderModule,
    PageTopModule,
    ProfileModule,
    ReadOnlyFormModule,
    SearchGlobalModule,
    ServicesCardModule,
    SidebarModule,
    SidenavModule,
    StepperModule,
    TopbarModule,
    PickListTableModule,
    MessageToggleModule,
    PasswordValidationModule,
    PanelMessagesModule
  ]
})

export class RbnCommonLibModule {
  constructor(public translate: TranslateService) {
    // set defaut language to english
    let defaultLang = 'en';
    if (localStorage.getItem('lang')) {
      defaultLang = localStorage.getItem('lang');
    }
    if (translate) {
      translate.addLangs([defaultLang]);
      translate.setDefaultLang(defaultLang);
      this.translate.get('COMMON').subscribe();
    }
  }
}



