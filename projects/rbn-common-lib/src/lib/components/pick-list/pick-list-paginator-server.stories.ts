import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../rbn-common-lib.module';
import { PickListComponent } from './pick-list.component';
import { IColsPickList, FilterTypesPickList, BodyTextType, TypeHide, TypePickList, IPaginatorConfig, IPageChangeEvent } from './model';
import { Component, OnInit } from '@angular/core';
import { FilterTypes } from '../../models/common-table';
import { Observable, of } from 'rxjs';
import { withA11y } from '@storybook/addon-a11y';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'rbn-paginator-server',
  template: `<rbn-pick-list [cols]="cols" [dataSource]="dataSource" [showPaginator]="true" [paginatorConfig]="paginator"
  (pageChange)="onPageChanged($event)" [paginatorMode]="'server'" [showSearch]="true"
  (searchEvent)="searchData($event)"></rbn-pick-list>`,
  styles: []
})

class PaginatorServerComponent implements OnInit {
  cols = [
    {
      field: 'name', header: '', sort: false, data: [], colsEnable: true, type: FilterTypes.InputText,
      options: { usingLink: true }
    }];

  originData = [
    { name: 'name 1' },
    { name: 'name 2' },
    { name: 'name 3' },
    { name: 'name 4' },
    { name: 'name 5' },
    { name: 'name 6' },
    { name: 'name 7' },
    { name: 'name 8' },
    { name: 'name 9' },
    { name: 'name 10' },
    { name: 'name 11' },
    { name: 'name 12' },
    { name: 'name 13' },
    { name: 'name 14' },
    { name: 'name 15' },
    { name: 'name 16' },
    { name: 'name 17' },
    { name: 'name 18' },
    { name: 'name 19' },
    { name: 'name 20' },
    { name: 'name 21' },
    { name: 'name 22' },
    { name: 'name 23' },
    { name: 'name 24' },
    { name: 'name 25' },
    { name: 'name 26' },
    { name: 'name 27' },
    { name: 'name 28' },
    { name: 'name 29' },
    { name: 'name 30' }
  ];

  dataSource = [];

  start = 0;
  stop: number;

  paginator: IPaginatorConfig[] = [{
    id: TypePickList.SOURCE,
    numberRowPerPage: 100,
    totalRecords: 0,
    rowsPerPageOptions: [100, 500, 1000]
  }, {
    id: TypePickList.TARGET,
    numberRowPerPage: 100,
    totalRecords: 0,
    rowsPerPageOptions: [100, 500, 1000]
  }];

  ngOnInit(): void {

    const tmp = this.originData;
    this.originData.forEach(element => {
      this.originData = tmp.concat(this.originData);
    });

    this.getTotal();
    this.getData(0, this.paginator[0].numberRowPerPage);
  }

  returnTotal(): Observable<any> {
    return of(this.originData.length);
  }

  returnData(start: number, stop: number): Observable<any> {
    return new Observable(obs => {
      obs.next(this.originData.slice(start, stop));
      obs.complete();
    });
  }

  returnSearchData(key: string): Observable<any> {
    return new Observable(obs => {
      obs.next(this.originData.find(x => x.name === key));
      obs.complete();
    });
  }

  getTotal(): void {
    this.returnTotal().subscribe(res => {
      const tmp: IPaginatorConfig[] = JSON.parse(JSON.stringify(this.paginator));
      tmp[0].totalRecords = res;
      this.paginator = tmp;
    });
  }

  getData(start: number, stop: number): void {
    this.returnData(start, stop).subscribe(res => {
      this.dataSource = res;
      console.log('dataSource', this.dataSource);
    });
  }

  onPageChanged(event: IPageChangeEvent): void {
    console.log('onPageChanged', event);
    if (event.id === TypePickList.SOURCE) {
      this.getData(event.first, event.first + event.rows);
    }
  }

  searchData(event: any): void {
    if (event.removeKey) {
      this.getData(0, this.paginator[0].numberRowPerPage);
      return;
    }
    if (event.id === TypePickList.SOURCE) {
      this.returnSearchData(event.key).subscribe(res => {
        this.dataSource = [res];
      });
    }
  }
}

export default {
  title: 'Components/PickList/PaginatorMode_Server_PickList',
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({

      declarations: [PaginatorServerComponent],
      imports: [
        ButtonModule,
        BrowserAnimationsModule,
        DropdownModule,
        RbnCommonLibModule,
        HttpClientModule,
        BrowserModule,
        RouterModule.forRoot([], { useHash: true })
      ],
      providers: [TranslateService]
    })
  ]
};
export const PaginatorMode_Server_PickList = () => ({
  template: '<rbn-paginator-server></rbn-paginator-server>'
});
