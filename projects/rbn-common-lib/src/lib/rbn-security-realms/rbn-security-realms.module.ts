import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';

import { RbnCommonTableModule } from '../rbn-common-table/rbn-common-table-lib.module';
import { HttpLoaderFactory } from '../shared/http-loader';

import { SecurityRealmsComponent } from './security-realms/security-realms.component';
import { SecurityRealmsActionsComponent } from './security-realms-actions/security-realms-actions.component';
import { SecurityRealmsDeleteComponent } from './security-realms-delete/security-realms-delete.component';
import { SecurityRealmsEnableDisableComponent } from './security-realms-enable-disable/security-realms-enable-disable.component';

@NgModule({
  declarations: [
    SecurityRealmsComponent,
    SecurityRealmsActionsComponent,
    SecurityRealmsDeleteComponent,
    SecurityRealmsEnableDisableComponent
  ],
  imports: [
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CommonModule,
    DialogModule,
    ButtonModule,
    BreadcrumbModule,
    PanelModule,
    FormsModule,
    RbnCommonTableModule,
    DropdownModule,
    ToolbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SecurityRealmsComponent,
    SecurityRealmsActionsComponent,
    SecurityRealmsDeleteComponent,
    SecurityRealmsEnableDisableComponent
  ]
})
export class RbnSecurityRealmsModule { }
