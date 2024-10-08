import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { AttributeListComponent } from './attribute-list/attribute-list.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardTableComponent } from './card-table/card-table.component';


@NgModule({
  declarations: [
    AttributeListComponent,
    CardTableComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    PanelModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    AttributeListComponent,
    CardTableComponent
  ]
})
export class AttributeListModule { }
