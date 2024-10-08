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
import { ExpandDataMode, ExpandDisplayType, Icols, IdefaultSortSingle } from '../../models/common-table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import calculateSize from 'calculate-size';

@Component({
  selector: 'rbn-client-header',
  template: `<rbn-table [cols]="cols" [defaultSortSingle]=defaultSortSingle 
  [data]="data" [tableConfig]="tableConfig" (switchChange)="switchChange($event)"
  (colsChanged)="colsChanged($event)" (fetchChildItem)="fetchChildItem($event)" 
  (colResize)="colResize(cols)" [tableColumnComponents]="localComponents"
  [filterColumnComponents]="filterMultiselectComponent"></rbn-table>
    <ng-template #tableChildren let-dataDropdown  let-service="extensibleHeaderService">
      <rbn-table [cols]="colsChildren" [data]="dataChildren" [tableConfig]="tableConfigChildren">
      </rbn-table>
    </ng-template>
    <ng-template #info let-params="params">
      <div *ngIf="params.rowdata['severity'] === 'Medium'">
          <i class="pi pi-chevron-circle-down"></i>
      </div>
      <div *ngIf="params.rowdata['severity'] === 'High'">
          <i class="pi pi-chevron-circle-left"></i>
      </div>
    </ng-template>
    <ng-template #infoIcon let-params="params">
      <div *ngIf="params.rowdata === 'Medium'">
          <i class="pi pi-chevron-circle-down"></i>
      </div>
      <div *ngIf="params.rowdata === 'High'">
          <i class="pi pi-chevron-circle-left"></i>
      </div>
    </ng-template>`
})
class ClientHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('tableChildren', { static: false }) elHeader;
  @ViewChild('info') info;
  @ViewChild('infoIcon') infoIcon;
  dataForMultiDropdown: ItemDropdown[] = [];
  defaultSortSingle: IdefaultSortSingle;
  data = [];
  dataChildren: any[] = [];
  localComponents: any = {};
  filterMultiselectComponent: any = {};
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
      isCellSearchDropdown: true,
      show3DotsButton: true,
      btn3DotsConfig: {
        exportCSVByLib: true
      }
    },
    isResizableColumns: true,
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
    expandDataMode: ExpandDataMode.Client,
    expandDisplayType: ExpandDisplayType.Table,
    columnHidingMode: ColumnHidingMode.Simple,
    loading: false,
    isShowContextMenu: true,
    filterIdFromHeader: true,
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
    { label: 'Lifecycle' }],
    allowFrozenColumn: true
  };

  tableConfigChildren: any = {
    showCloseTableButton: false,

    tableOptions: {
      dataKey: 'interface',
      selectionMode: 'multiple',
      hideTableButtons: false,
      hideCheckboxAll: false,
      hideColumnInLib: true
    },
    selectedRows: [],
    tableName: 'tableChildrenClient',
    paginatorMode: PaginatorMode.Client,
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isSupportGrouping: false,
    isScrollable: true,
    // scrollX: true,
    enableSearchGlobal: true,
    enableFilter: true,
    columnHidingMode: ColumnHidingMode.Simple,
    loading: false,
    actionColumnConfig: {
      actions: [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test',
          onClick: 'table action 1'
        },
        {
          icon: 'fas fa-search',
          label: 'search action',
          tooltip: 'test',
          onClick: 'table action 2'
        },
        {
          icon: 'fas fa-lock',
          label: 'lock action',
          tooltip: 'test',
          onClick: 'table action 3'
        },
        {
          icon: 'fas fa-unlock',
          label: 'unlock action',
          tooltip: 'test',
          onClick: 'table action 4'
        }
      ]
    },
    breadCrumb: [{
      label: 'VNF',
      command: (event) => {
        console.log('call back');
      }
    },
    { label: 'Lifecycle' }],
    isTableChildren: true,
    isUsingAppendTo: false,
    isResizableColumns: true
  };

  dataDropdown = [
    { 'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true },
    { 'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false },
    { 'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false },
    { 'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false },
    { 'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined }
  ];

  cols: Icols[] = [];
  colsChildren;
  colsNotHide = [
    FieldName.Checkbox,
    FieldName.Expand,
    FieldName.RowGroup
  ];

  ngOnInit() {
    this.convertDataForMultiDropdown();
    this.initCols();
    setTimeout(() => {
      this.data = [
        {
          'brand': 'Honda', 'year': 2012, date: '2021-03-10','severity':'High',
          'color': 'Yellow', 'vin': 'g43gr', 'seller': true, 'actions': [
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
          'brand': 'Jaguar', 'year': 2013, date: '2021-03-10','severity':'High', 'color': 'Orange', 'vin': 'greg34', 'seller': true,
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
          'brand': 'Ford', 'year': 2000, date: '2021-03-10','severity':'High', 'color': 'Black',
          'vin': 'h54hw5', 'seller': true, 'actions': [
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
          'brand': 'Fiat', 'year': 2013, date: '2021-03-10','severity':'High', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat1', 'year': 2013, date: '2021-03-10', 'severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        },
        {
          'brand': 'Fiat2', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat3', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        },
        {
          'brand': 'Fiat4', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        },
        {
          'brand': 'Fiat5', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat6', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat7', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160']
        },
        {
          'brand': 'Fiat8', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat9', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        },
        {
          'brand': 'Fiat10', 'year': 2013, date: '2021-03-10','severity':'Medium', 'color': 'Red', 'vin': '245t2s', 'seller': true,
          'ellipsis': ['760160', '762090', '252540', '254170', '160180', '252540', '254170', '160180']
        }
      ];
      this.setNumberOfDisplay(this.cols);
    }, 500);
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleTemplateTableChildren = this.elHeader;
    this.tableConfig = newConfig;
  }

  ngAfterViewInit(): void {
    this.localComponents = {
      info: this.info
    };
    this.filterMultiselectComponent = {
      infoIcon: this.infoIcon
    };
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
        field: 'year', header: 'Year', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {
          model: '2013'
        },
        colDisable: false
      },
      {
        field: 'date', header: 'Date', sort: true, data: [],
        colsEnable: true, type: FilterTypes.Calendar,
        options: { model: '', format: 'MM/dd/YYYY' },
        colDisable: false
      },
      {
        field: 'ellipsis', header: 'Ellipsis', sort: true, colsEnable: true, type: FilterTypes.InputText,
        options: { usingElipsis: true, isLinkColor: true, numberOfDisplay: 2 }
      },
      {
        field: 'severity',
        header: 'Severity',
        sort: true,
        data: null,
        colsEnable: true,
        type: FilterTypes.Multiselect,
        options: {},
        colDisable: false,
        loadLocalComponent: {
          keyName: 'info'
        },
        filterMultiselectComponent: {
          keyName: 'infoIcon'
        }
      },
      {
        field: 'color', header: 'Color', sort: true, data: [], colsEnable: true, type: FilterTypes.Multiselect, options: {
          model: ['Yellow', 'Orange', 'Red']
        },
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

    this.defaultSortSingle = {
      field: this.cols[2].field,
      sortOrder: 'DES'
    };


    this.colsChildren = [
      {
        field: 'interface', header: 'Interface', sort: false, data: [],
        colsEnable: true, type: FilterTypes.InputText, options: {},
        colDisable: false,
        allowHide: false
      },
      {
        field: 'fixedIp', header: 'Fixed IPs', sort: true, data: [], colsEnable: true, type: FilterTypes.Dropdown, options: {},
        colDisable: false
      },
      {
        field: 'floatingIp', header: 'Floating Ips', sort: true, data: [], colsEnable: true,
        type: FilterTypes.Dropdown, options: {},
        colDisable: false
      }
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

  fetchChildItem(event: any) {
    this.dataChildren = event.rowData.dataExpand;
    this.removeDataColumn(this.colsChildren);
    this.initDataDropdownTableChildren(this.dataChildren, this.colsChildren);
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

  removeDataColumn(cols: any[]) {
    if (cols && cols.length > 0) {
      cols.forEach(element => {
        if (element.data && element.data.length > 0) {
          element.data = [];
        }
      });
    }
  }

  initDataDropdownTableChildren(data: any[], cols: any[]) {
    if (data && data.length > 0 && cols && cols.length > 0) {
      data.forEach(row => {
        cols.map((itemDropdown: any) => {
          this.initDataDropdown(itemDropdown.data, row, itemDropdown.field);
        });
      });
    }
  }

  colResize(cols) {
    this.setNumberOfDisplay(cols);
  }

  setNumberOfDisplay(cols) {
    const storage = sessionStorage.getItem('storage_' + this.tableConfig.tableName + '_resize');
    if (storage) {
      const storageParse = JSON.parse(storage) as Array<any>;
      const indexElipsis = cols.findIndex((n: any) => n.options && n.options.usingElipsis === true);
      if (indexElipsis !== -1) {
        const fieldElipsis = cols[indexElipsis].field;
        const index = storageParse.findIndex(n => n.field === fieldElipsis);
        if (index !== -1) {
          const widthPx = storageParse[index].style.width as string;
          const width = widthPx.substring(0, widthPx.length - 2);
          let textfieldElipsis = this.data[0][fieldElipsis][0].name;
          if (textfieldElipsis === undefined) {
            textfieldElipsis = this.data[0][fieldElipsis][0];
          }
          const calSizeField = calculateSize(textfieldElipsis + ' | ', {
            font: 'Open Sans',
            fontSize: '14px'
          });
          const numberColChange = Math.round(Number(width) / calSizeField.width);
          if (numberColChange <= 2) {
            cols[index].options.numberOfDisplay = 1;
          } else {
            cols[index].options.numberOfDisplay = numberColChange - 2;
          }
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
  title: 'Rbn-Table/PaginatorMode_Client',
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({

      declarations: [ClientHeaderComponent],
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

export const PaginatorMode_Client = () => ({
  template: '<rbn-client-header></rbn-client-header>'
});
