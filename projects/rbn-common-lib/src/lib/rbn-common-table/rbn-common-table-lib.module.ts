import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import {ContextMenuModule} from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PickListModule } from 'primeng/picklist';
import { BlockUIModule } from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

import { RbnTimePickerModule } from '../rbn-time-picker/rbn-time-picker-lib.module';
import { SanitizeHtmlPipe } from './shared/base-table.component';
import { HttpLoaderFactory } from '../shared/http-loader';
import { CommonTableComponent } from './common-table/common-table.component';
import { LegacyTableComponent } from './legacy-table/legacy-table.component';
import { TableComponent } from './table/table.component';
import { ColumnHidingDialogComponent } from './table/column-hiding-dialog/column-hiding-dialog.component';
import { ColumnHidingDialogComplexComponent } from './table/column-hiding-dialog-complex/column-hiding-dialog-complex.component';
import { ColumnHidingSimpleComponent } from './table/column-hiding-simple/column-hiding-simple.component';
import { PageHeaderModule } from '../components/page-header/page-header.module';
import { DialogLoaderModule } from '../components/dialog-loader/dialog-loader.module';
import { SearchGlobalModule } from '../components/search-global/search-global.module';
import { ConfirmDialogModule } from '../components/confirm-dialog/confirm-dialog.module';
import { ExportTableComponent } from './table/export-table/export-table.component';
import { RbnFocusOverlayPanelModule } from '../directives/rbn-focus-overlaypanel/rbn-focus-overlaypanel.module';
import { RbnFocusDialogModule } from '../directives/rbn-focus-dialog/rbn-focus-dialog.module';
import { RbnFocusPTooltipModule } from '../directives/rbn-focus-ptooltip/rbn-focus-ptooltip.module';
import { RbnFocusSplitButtonModule } from '../directives/rbn-focus-splitbutton/rbn-focus-splitbutton.module';
import { RbnFocusMultiselectModule } from '../directives/focus-multiselect/rbn-focus-multiselect.module';
import { RbnFocusDropdownModule } from '../directives/focus-dropdown/rbn-focus-dropdown.module';
import { RbnFocusTableModule } from '../directives/rbn-focus-table/rbn-focus-table.module';
import { RbnFocusPickListModule } from '../directives/rbn-focus-picklist/rbn-focus-picklist.module';
import { PanelMessagesModule } from '../components/panel-mesages/panel-messages.module';


@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PanelModule,
    DropdownModule,
    DialogModule,
    OverlayPanelModule,
    RbnFocusOverlayPanelModule,
    InputSwitchModule,
    TableModule,
    PickListModule,
    MultiSelectModule,
    PaginatorModule,
    RbnTimePickerModule,
    TriStateCheckboxModule,
    ReactiveFormsModule,
    TooltipModule,
    SplitButtonModule,
    BlockUIModule,
    MenuModule,
    BreadcrumbModule,
    TabViewModule,
    InputNumberModule,
    DialogLoaderModule,
    RbnFocusDialogModule,
    SearchGlobalModule,
    ContextMenuModule,
    ConfirmDialogModule,
    RbnFocusPTooltipModule,
    RbnFocusSplitButtonModule,
    RbnFocusMultiselectModule,
    RbnFocusDropdownModule,
    RbnFocusTableModule,
    RbnFocusPickListModule,
    PanelMessagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    PageHeaderModule
  ],
  declarations: [
    CommonTableComponent,
    LegacyTableComponent,
    TableComponent,
    SanitizeHtmlPipe,
    ColumnHidingDialogComponent,
    ColumnHidingDialogComplexComponent,
    ColumnHidingSimpleComponent,
    ExportTableComponent
  ],
  exports: [
    CommonTableComponent,
    LegacyTableComponent,
    TableComponent,
    ColumnHidingDialogComponent,
    ColumnHidingDialogComplexComponent,
    ExportTableComponent
  ],
  providers: [
    MessageService
  ]
})
export class RbnCommonTableModule {
  constructor(public translate: TranslateService) {
    // set defaut language to english
    let defaultLang = 'en';
    if (localStorage.getItem('lang')) {
      defaultLang = localStorage.getItem('lang');
    }
    if (translate) {
      translate.addLangs([defaultLang]);
      translate.setDefaultLang(defaultLang);
    }
  }
}

