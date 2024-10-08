import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { FilterTypes, RbnCommonLibModule, FieldName, PaginatorMode } from '../../../public_api';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableComponent } from './table.component';

export default {
  title: 'Rbn-Table/Table_config',
  component: TableComponent,
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({
      imports: [
        ButtonModule,
        BrowserAnimationsModule,
        DropdownModule,
        RbnCommonLibModule, HttpClientModule, BrowserModule, RouterModule.forRoot([], { useHash: true })
      ],
      providers: [TranslateService]
    })
  ],
  argTypes: {
    tableConfig: { control: 'object' },
    data: { control: 'array' },
    cols: { control: 'array' }
  }
};

const template = '<rbn-table [cols]="cols" [data]="data" [tableConfig]="tableConfig"></rbn-table>';

export const headerAndTableName = () => ({
  template,
  props: {
    tableConfig: {
      tableName: 'header_tableName',
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
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data: [],
    cols: []
  }
});

export const headerOLAndNumberRow = () => ({
  template,
  props: {
    tableConfig: {
      tableName: 'tableConfig',
      numberRowPerPage: 10,
      rowsPerPageOptions: [10, 20],
      headerOL: {
        title: 'Date of manufacture',
        paras: [{
          header: 'Date description',
          text: ['description-1', 'description-2']
        }]
      },
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data,
    cols: [
      {
        field: 'brand', header: 'Brand', sort: false, data: [],
        colsEnable: true, type: FilterTypes.Multiselect,
        options: { usingLink: true },
        colDisable: false,
        allowHide: false
      },
      {
        field: 'date', header: 'Date', sort: true, data: [],
        colsEnable: true, type: FilterTypes.Calendar,
        options: { model: '', format: 'MM/dd/YYYY', headerOLIcon: 'fas fa-angle-double-up', headerOLtemplate: 'op5' },
        colDisable: false
      }
    ]
  }
});

export const expandRows = () => ({
  template,
  props: {
    tableConfig: {
      expandRows: true,
      tableName: 'expandRows',
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data,
    cols: [
      {
        field: 'brand', header: 'Brand', sort: false, data: [],
        colsEnable: true, type: FilterTypes.Multiselect,
        options: { usingLink: true },
        colDisable: false,
        allowHide: false
      },
      {
        field: 'date', header: 'Date', sort: true, data: [],
        colsEnable: true, type: FilterTypes.Calendar,
        options: { model: '', format: 'MM/dd/YYYY', headerOLIcon: 'fas fa-angle-double-up', headerOLtemplate: 'op5' },
        colDisable: false
      }
    ]
  }
});

export const allowSelectAllRows = () => ({
  template,
  props: {
    tableConfig: {
      allowSelectAllRows: true,
      tableName: 'allowSelectAllRows',
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data,
    cols
  }
});

export const useScrollHeight = () => ({
  template,
  props: {
    tableConfig: {
      useScrollHeight: '100px',
      allowSelectAllRows: true,
      tableName: 'useScrollHeight',
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data,
    cols
  }
});

export const enableSearchGlobalAndFilter = () => ({
  template,
  props: {
    tableConfig: {
      enableSearchGlobal: false,
      enableFilter: false,
      allowSelectAllRows: true,
      tableName: 'searchGlobalAndFilter',
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        isCellSearchDropdown: true
      }
    },
    data,
    cols
  }
});

export const tableOption = () => ({
  template,
  props: {
    tableConfig: {
      tableName: 'tableOption',
      paginatorMode: PaginatorMode.Client,
      tableOptions: {
        dataKey: 'brand',
        selectionMode: 'multiple',
        paginator: PaginatorMode.Client,
        selectionFilterDropdown: false,
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: false,
        hideColumnClear: false,
        isCellSearchDropdown: true
      }
    },
    data,
    cols
  }
});

const data = [
  {
    'brand': 'Honda', date: '2021-03-10', 'color': 'Yellow', 'vin': 'g43gr', 'seller': true, 'actions': [
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
        id: '1',
        name: '760160'
      },
      {
        id: '2',
        name: '762092'
      },
      {
        id: '3',
        name: '2525430'
      },
      {
        id: '4',
        name: '252544'
      },
      {
        id: '5',
        name: '252545'
      }
    ],
    'dataExpand': [{
      'interface': 'eth1',
      'fixedIp': '1.1.1.1',
      'floatingIp': 'Test1'
    }, {
      'interface': 'eth1',
      'fixedIp': '2.2.2.2',
      'floatingIp': 'Test2'
    }, {
      'interface': 'eth2',
      'fixedIp': '3.3.3.3',
      'floatingIp': 'Test3'
    }],
    'choose': [
      { 'label': 'Red', 'value': 'red' },
      { 'label': 'Yellow', 'value': 'yellow' },
      { 'label': 'Blue', 'value': 'blue' }
    ],
    'chooseDrItemSelected': { 'label': 'Yellow', 'value': 'yellow' }
  },
  {
    'brand': 'Jaguar', date: '2021-03-10', 'color': 'Orange', 'vin': 'greg34', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180'],
    'dataExpand': [{
      'interface': 'eth4',
      'fixedIp': '4.4.4.4',
      'floatingIp': 'Test4'
    }, {
      'interface': 'eth5',
      'fixedIp': '5.5.5.5',
      'floatingIp': 'Test5'
    }],
    'choose': [
      { 'label': 'Red', 'value': 'red' },
      { 'label': 'Yellow', 'value': 'yellow' },
      { 'label': 'Blue', 'value': 'blue' },
      { 'label': 'Orange', 'value': 'orange' }
    ],
    'chooseDrItemSelected': { 'label': 'Orange', 'value': 'orange' }
  },
  {
    'brand': 'Ford', date: '2021-03-10', 'color': 'Black', 'vin': 'h54hw5', 'seller': true, 'actions': [
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
    'dataExpand': [{
      'interface': 'eth6',
      'fixedIp': '6.6.6.6',
      'floatingIp': 'Test6'
    }, {
      'interface': 'eth7',
      'fixedIp': '7.7.7.7',
      'floatingIp': 'Test7'
    }]
  },
  {
    'brand': 'Fiat', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat1', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160']
  },
  {
    'brand': 'Fiat2', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat3', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160']
  },
  {
    'brand': 'Fiat4', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160']
  },
  {
    'brand': 'Fiat5', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat6', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat7', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160']
  },
  {
    'brand': 'Fiat8', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat9', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  },
  {
    'brand': 'Fiat10', date: '2021-03-10', 'color': 'Red', 'vin': '245t2s', 'seller': true,
    'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
  }
];

const cols = [
  { field: FieldName.Expand, header: '', sort: false, data: [], colsEnable: true, colDisable: false },
  { field: FieldName.Checkbox, header: '', sort: false, data: [], colsEnable: true, colDisable: false },
  {
    field: 'brand', header: 'Brand', sort: false, data: [],
    colsEnable: true, type: FilterTypes.Multiselect, options: { usingLink: true },
    colDisable: false,
    allowHide: false
  },
  {
    field: 'date', header: 'Date', sort: true, data: [],
    colsEnable: true, type: FilterTypes.Calendar, options: { model: '', format: 'MM/dd/YYYY' },
    colDisable: false
  },
  {
    field: 'ellipsis', header: 'Ellipsis', sort: true, colsEnable: true, type: FilterTypes.InputText,
    options: { usingElipsis: true, isLinkColor: true, numberOfDisplay: 2 }
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
  {
    field: 'choose', header: 'Choose Color', sort: false, data: [], colsEnable: true, options: { usingDropdown: true },
    colDisable: false, type: FilterTypes.InputText
  },
  { field: FieldName.Action, header: 'Action', sort: false, data: [], colsEnable: true, type: null, colDisable: false }
];
