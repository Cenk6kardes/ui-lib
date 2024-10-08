import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PickListComponent } from './pick-list.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { PaginatorModule } from 'primeng/paginator';
import { SearchGlobalModule } from '../search-global/search-global.module';
@NgModule({
  declarations: [PickListComponent],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    PanelModule,
    TableModule,
    InputTextModule,
    CardModule,
    FormsModule,
    DragDropModule,
    MultiSelectModule,
    PaginatorModule,
    SearchGlobalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    PickListComponent
  ]
})
export class PickListTableModule { }
