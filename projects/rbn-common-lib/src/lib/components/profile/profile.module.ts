import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { HttpLoaderFactory } from '../../shared/http-loader';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { PasswordValidationModule } from '../password-validation/password-validation.module';

import { AboutInfoComponent } from './about-info/about-info.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormToolbarModule } from '../form-toolbar/form-toolbar.module';
import { RbnFocusOverlayPanelModule } from '../../directives/rbn-focus-overlaypanel/rbn-focus-overlaypanel.module';
import { RbnFocusPanelMenuModule } from '../../directives/rbn-focus-panelmenu/rbn-focus-panelmenu.module';

@NgModule({
  declarations: [
    ProfileComponent,
    AboutInfoComponent,
    LogoutComponent,
    ProfileInfoComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    OverlayPanelModule,
    RbnFocusOverlayPanelModule,
    PanelMenuModule,
    RbnFocusPanelMenuModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    TabViewModule,
    InputSwitchModule,
    ReactiveFormsModule,
    ToolbarModule,
    PasswordModule,
    InputTextModule,
    PasswordValidationModule,
    FormToolbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    ProfileComponent,
    AboutInfoComponent,
    LogoutComponent,
    ChangePasswordComponent,
    ProfileInfoComponent
  ]
})
export class ProfileModule { }
