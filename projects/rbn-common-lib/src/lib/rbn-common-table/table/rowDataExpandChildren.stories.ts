import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { FilterTypes, RbnCommonLibModule, FieldName, PaginatorMode, ColumnHidingMode, ItemDropdown } from '../../../public_api';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { action } from '@storybook/addon-actions';
import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ExpandDataMode, ExpandDisplayType, Icols } from '../../models/common-table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'rbn-rowdata-expand-children',
  template: `<rbn-table [cols]="cols" [data]="data"
  [tableConfig]="tableConfig" (switchChange)="switchChange($event)" 
  (colsChanged)="colsChanged($event)"></rbn-table>`
})
class RowDataExpandChildrenComponent implements OnInit, AfterViewInit {
  @ViewChild('tableChildren', { static: false }) elHeader;
  dataForMultiDropdown: ItemDropdown[] = [];

  data = [
    {
      'brand': 'Honda', 'year': 2012, date: '2021-03-10', 'color': 'Yellow', 'vin': 'g43gr', 'seller': true, 'actions': [
        {
          icon: 'fas fa-lock',
          label: 'lock action',
          tooltip: 'test',
          onClick: () => {
            console.log('click onClick lock');
          },
          id: 'fa-lock'
        },
        {
          icon: 'fas fa-unlock',
          label: 'unlock action',
          tooltip: 'test',
          onClick: () => {
            console.log('click onClick unlock');
          }
        }
      ], 'ellipsis': [
        {
          id : '1',
          name: '760160'
        },
        {
          id : '2',
          name: '762092'
        },
        {
          id : '3',
          name: '2525430'
        },
        {
          id : '4',
          name: '252544'
        },
        {
          id : '5',
          name: '252545'
        }
      ],
      children: [
        {
          'brand': 'Honda1', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        }
      ]
    },
    {
      'brand': 'Jaguar', 'year': 2013, date: '2021-03-10', 'color': 'Orange', 'vin': 'greg34', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180'],
      children: [
        {
          'brand': 'Jaguar', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Jaguar1', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        }
      ]
    },
    {
      'brand': 'Ford', 'year': 2000, date: '2021-03-10', 'color': 'Black', 'vin': 'h54hw5', 'seller': true, 'actions': [
        {
          icon: 'fas fa-lock',
          label: 'lock action',
          tooltip: 'test',
          onClick: () => {
            console.log('click onClick lock');
          },
          id: 'fa-lock'
        },
        {
          icon: 'fas fa-unlock',
          label: 'unlock action',
          tooltip: 'test',
          onClick: () => {
            console.log('click onClick unlock');
          }
        }
      ], 'ellipsis': ['760160', '762090'],
      children: [
        {
          'brand': 'Ford1', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Ford2', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        }
      ]
    },
    {
      'brand': 'Fiat', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180'],
      children: [
        {
          'brand': 'Fiat1', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        },
        {
          'brand': 'Fiat2', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        }
      ]
    },
    {
      'brand': 'Fiat1', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160']
    },
    {
      'brand': 'Fiat2', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    },
    {
      'brand': 'Fiat3', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160']
    },
    {
      'brand': 'Fiat4', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160']
    },
    {
      'brand': 'Fiat5', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    },
    {
      'brand': 'Fiat6', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    },
    {
      'brand': 'Fiat7', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160']
    },
    {
      'brand': 'Fiat8', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    },
    {
      'brand': 'Fiat9', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    },
    {
      'brand': 'Fiat10', 'year': 2013, date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
      'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
    }
  ];

  tableConfig: any = {
    header: {
      title: 'Page Header',
      breadcrumb: [{
        label: 'VNF',
        command: (event) => {
          console.log('call back');
        }
      },
      { label: 'Lifecycle' }],
      topButton: {
        label: 'Table action',
        icon: 'fab fa-jedi-order',
        title: 'Test action',
        onClick: ('topButton Action'),
        iconPos: 'right'
      }
    },
    showCloseTableButton: false,
    refeshTableBtn: 'refeshTableBtn',
    tableOptions: {
      dataKey: 'brand',
      selectionMode: 'multiple',
      hideTableButtons: false,
      hideCheckboxAll: false,
      hideColumnInLib: true,
      show3DotsButton: true,
      btn3DotsConfig: {
        resetTableLayoutByLib: true,
        exportCSVByLib: true,
        exportPDFByLib: true
      }
    },
    selectedRows: [],
    tableName: 'tableClientMode',
    paginatorMode: PaginatorMode.Client,
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isSupportGrouping: true,
    isScrollable: true,
    scrollX: false,
    enableSearchGlobal: true,
    enableFilter: true,
    columnHidingMode: ColumnHidingMode.Simple,
    loading: false,
    isShowContextMenu: true,
    actionColumnConfig: {
      actions: [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test',
          onClick: (data, index) => {
            console.log('table action 1');
          }
        },
        {
          icon: 'fas fa-search',
          label: 'search action',
          tooltip: 'test',
          onClick: (data, index) => {
            console.log('table action 2');
          },
          disableAction: {
            field: 'color',
            value: 'Yellow'
          }
        }
      ]
    },
    breadCrumb: [{
      label: 'VNF',
      command: (event) => {
        console.log('call back');
      }
    },
    { label: 'Lifecycle' }]
  };


  cols;
  colsNotHide = [
    FieldName.Checkbox,
    FieldName.Expand,
    FieldName.RowGroup
  ];

  ngOnInit() {
    this.convertDataForMultiDropdown();
    this.initCols();
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleTemplateTableChildren = this.elHeader;
    this.tableConfig = newConfig;
  }

  ngAfterViewInit(): void {
    this.data.forEach(row => {
      this.cols.map((itemDropdown: any) => {
        this.initDataDropdown(itemDropdown.data, row, itemDropdown.field);
      });
    });
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleTemplateTableChildren = this.elHeader;
    // newConfig.extensibleHeaderService = this.service;
    newConfig.extensibleHeaderData = [
      {
        label: 'Select Action',
        value: ''
      },
      {
        label: 'action 1',
        value: 'action 1'
      },
      {
        label: 'action 2',
        value: 'action 2'
      }
    ];
    this.tableConfig = newConfig;
  }

  initDataDropdown(arr: ItemDropdown[], item: any, title: any) {
    if (arr && arr.findIndex(i => i.value === item[title]) === -1) {
      if (item[title]) {
        arr.push(new ItemDropdown(item[title], item[title]));
      }
    }
  }

  colsChanged(event: Icols[] | any) {
    const tableActive = event.tableActive;
    if (event && event.colsChange) {
      if (tableActive === this.tableConfig.tableName) {
        this.cols = this.handleChangeCols(this.cols, event);
      }
    }
  }

  handleChangeCols(colsOrigin, event) {
    let colsChange = event.colsChange ? event.colsChange : [];
    const checkboxEvent = event.checkboxEvent;
    let data;
    let colsAfterChange;

    data = JSON.parse(JSON.stringify(colsOrigin.filter(d => !this.colsNotHide.includes(d.field) && d.allowHide !== false)));
    if (!checkboxEvent) {
      const dataNotChanged = JSON.parse(JSON.stringify(colsOrigin.filter(d =>
        this.colsNotHide.includes(d.field) || d.allowHide === false)));

      const arrColsChange = data.filter(x => !colsChange.some(i => i.field === x.field));
      arrColsChange.forEach(colChange => {
        colChange.colsEnable = false;
        colChange.colDisable = !colChange.colsEnable;
      });
      colsChange.forEach(element => {
        element.colsEnable = true;
        element.colDisable = !element.colsEnable;
      });
      colsChange = colsChange.concat(arrColsChange);

      colsAfterChange = dataNotChanged.concat(colsChange);
    } else {
      data = JSON.parse(JSON.stringify(colsOrigin));
      data.forEach(d => {
        const condition = colsChange.some(x => x.field === d.field);
        d.colsEnable = condition ? false : true;
        d.colDisable = !d.colsEnable;
      });
      colsAfterChange = data;

    }
    return colsAfterChange;
  }


  initCols() {
    this.cols = [
      { field: FieldName.Expand, header: '', sort: false, data: [], colsEnable: true, colDisable: false },
      {
        field: 'brand', header: 'Brand', sort: false, data: this.dataForMultiDropdown,
        colsEnable: true, type: FilterTypes.Multiselect, options: { usingLink: true },
        colDisable: false,
        allowHide: false
      },
      {
        field: 'year', header: 'Year', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {},
        colDisable: false
      },
      {
        field: 'date', header: 'Date', sort: true, data: [],
        colsEnable: true, type: FilterTypes.Calendar, options: { model: '', format: 'MM/dd/YYYY' },
        colDisable: false
      },
      {
        field: 'ellipsis', header: 'Ellipsis', sort: true, colsEnable: true, type: FilterTypes.InputText,
        options: { usingElipsis: true, isLinkColor: true, numberOfDisplay: 3 }
      },
      {
        field: 'color', header: 'Color', sort: true, data: [], colsEnable: true, type: FilterTypes.Dropdown, options: {},
        colDisable: false
      },
      {
        field: 'vin', header: 'Vin', sort: false, data: [], colsEnable: false, type: FilterTypes.InputText, options: {},
        colDisable: true
      },
      {
        field: 'seller', header: 'Seller', sort: false, data: [], colsEnable: true, options: { usingInputSwitch: true },
        colDisable: false
      },
      { field: FieldName.Action, header: 'Action', sort: false, data: [], colsEnable: true, type: null, colDisable: false }
    ];

    this.tableConfig.header.topButton = {
      label: 'New VNF',
      icon: 'pi pi-plus',
      title: 'Test action',
      onClick: () => this.onClick(),
      iconPos: 'left',
      isDisplay: true
    };
  }

  onClick() {
    console.log('click top button');
  }

  convertDataForMultiDropdown() {
    if (this.data && this.data.length > 0) {
      for (const item of this.data) {
        const index = this.dataForMultiDropdown.findIndex(x => x.value === item.brand);
        if (index === -1) {
          this.dataForMultiDropdown.push({ label: item.brand, value: item.brand });
        }
      }
    }
  }

  switchChange($event) {
    action('switchChange')($event);
  }
  clickTableActions($event) {
    action('asdasd')($event);
  }
  refreshData($event) {
    action('refreshData')($event);
  }
}

export default {
  title: 'Rbn-Table/RowDataExpandChildren',
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({

      declarations: [RowDataExpandChildrenComponent],
      imports: [
        ButtonModule,
        BrowserAnimationsModule,
        DropdownModule,
        RbnCommonLibModule, HttpClientModule, BrowserModule, RouterModule.forRoot([], { useHash: true })
      ],
      providers: [TranslateService]
    })
  ]
};

export const RowDataExpandChildren = () => ({
  template: '<rbn-rowdata-expand-children></rbn-rowdata-expand-children>'
});
