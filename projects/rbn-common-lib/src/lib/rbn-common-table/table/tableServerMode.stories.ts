/* eslint-disable max-len */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import {
  FilterTypes, RbnCommonLibModule, FieldName, PaginatorMode, ColumnHidingMode, ITableConfig, ItemDropdown,
  ExpandDataMode, ExpandDisplayType
} from '../../../public_api';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { } from 'prop-types';
import { action } from '@storybook/addon-actions';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
class HeaderService {
  showMessage() {
    alert('Show Message');
  }
}
@Component({
  selector: 'rbn-extensible-header',
  template: `<rbn-table (exportDataModeServerEvent) = "exportDataModeServer($event)" [cols]="cols" [data]="data" [tableConfig]="tableConfig" (pageChanged)="pageChanged($event)"
    (switchChange)="switchChange($event)" (fetchChildItem)="fetchChildItem($event)"></rbn-table>
  <ng-template #name let-dataDropdown  let-service="extensibleHeaderService">
  <button pButton type="button" label="Extensible header action" class="ui-button-success" style="margin: 0 5px;">
  </button>
  <button pButton type="button" label="Extensible header action" class="ui-button-success" style="margin: 0 5px;">
  </button>
  <button pButton type="button" label="Extensible header action" class="ui-button-success" style="margin: 0 5px;">
  </button>
  <p-dropdown [options]="dataDropdown" placeholder="Select Action" [style]="{width: '150px'}"></p-dropdown>
</ng-template>`,
  styles: ['rbn-table ::ng-deep p-dropdown .ui-dropdown-trigger .ui-dropdown-trigger-icon::before { color: #1D1F21 }']
})
class ExtensibleHeaderComponent implements AfterViewInit {
  @ViewChild('name', { static: false }) elHeader;
  tableConfig: ITableConfig = {
    paginatorMode: PaginatorMode.Server,
    allowSelectAllRows: true,
    keepSelectedRows: true,
    header: {
      title: 'Header Test',
      breadcrumb:
        [{
          label: 'VNF',
          command: (event) => {
            console.log('call back');
          }
        },
        { label: 'Lifecycle' }],
      topButton: {
        label: 'New VNF',
        icon: 'pi pi-plus',
        title: 'Test action',
        onClick: action('topButton Action'),
        iconPos: 'left',
        isDisplay: true
      }
    },
    showCloseTableButton: false,
    tableOptions: {
      dataKey: 'brand',
      selectionMode: 'multiple',
      hideTableButtons: false,
      usingTriStateCheckbox: true,
      hideColumnInLib: true,
      show3DotsButton: true,
      btn3DotsConfig: {
        exportCSVByLib: true
      }
    },
    isResizableColumns: true,
    selectedRows: [],
    tableName: 'testTableServerMode',
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isSupportGrouping: true,
    isScrollable: true,
    scrollX: false,
    searchPlaceholderText: 'Search Place holder',
    enableSearchGlobal: true,
    enableFilter: true,
    columnHidingMode: ColumnHidingMode.Simple,
    expandDataMode: ExpandDataMode.Server,
    expandDisplayType: ExpandDisplayType.TabView,
    loading: false,
    translateResults: {},
    isShowContextMenu: true,
    actionColumnConfig: {
      actions: [
        {
          icon: 'fas fa-search',
          label: 'search action',
          tooltip: 'test',
          onClick: action('table action 2')
        },
        {
          icon: 'fas fa-lock',
          label: 'lock action',
          tooltip: 'test',
          onClick: action('table action 3')
        },
        {
          icon: 'fas fa-unlock',
          label: 'unlock action',
          tooltip: 'test',
          onClick: action('table action 4')
        }
      ],
      quantityDisplayed: 2
    }
  };

  cols = [
    { field: FieldName.Checkbox, header: '', sort: false, data: [], colsEnable: true },
    {
      field: 'brand', header: 'Brand', sort: false, data: [], colsEnable: true, type: FilterTypes.InputText,
      options: { usingLink: true }
    },
    {
      field: 'year', header: 'Year', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {},
      allowHide: false
    },
    { field: 'color', header: 'Color', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {} },
    { field: 'vin', header: 'VIN', sort: false, data: [], colsEnable: true, type: FilterTypes.InputText, options: {} },
    { field: 'seller', header: 'Seller', sort: false, data: [], colsEnable: true, options: { usingInputSwitch: true } },
    { field: FieldName.Action, header: 'Action', sort: false, data: [], colsEnable: true, autoSetWidth: false }
  ];

  data: any[] = [];

  dataGlobal = [
    {
      'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test',
          onClick: 'table action 1'
        }
      ]
    },
    {
      'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test'
        }
      ]
    },
    {
      'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false
    },
    {
      'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false
    },
    {
      'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined
    },
    {
      'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test',
          onClick: 'table action 1'
        }
      ]
    },
    {
      'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test'
        }
      ]
    },
    {
      'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false
    },
    {
      'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false
    },
    {
      'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined
    },
    {
      'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test',
          onClick: 'table action 1'
        }
      ]
    },
    {
      'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false, 'actions': [
        {
          icon: 'fas fa-pen',
          label: 'edit action',
          tooltip: 'test'
        }
      ]
    },
    {
      'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false
    },
    {
      'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false
    },
    {
      'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined
    }
  ];
  totalRecords = 15;
  maxLimitRecordsExportServer = 11;
  currentPage = 0;

  constructor(public service: HeaderService, private translateService: TranslateService) {
    this.translateService.getTranslation('en').subscribe(res => {
      const newConfig = { ...this.tableConfig };
      newConfig.translateResults = res.COMMON;
      this.tableConfig = newConfig;
    });
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.data.forEach(row => {
      this.cols.map((itemDropdown: any) => {
        this.dataDropdown(itemDropdown.data, row, itemDropdown.field);
      });
    });
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleHeaderTemplate = this.elHeader;
    newConfig.extensibleHeaderService = this.service;
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
    newConfig.totalRecords = this.totalRecords;
    newConfig.maxLimitRecordsExportServer = this.maxLimitRecordsExportServer;
    this.tableConfig = newConfig;
  }

  exportDataModeServer(e: any) {
    if (e.command) {
      e.command(this.dataGlobal);
    }
  }

  setTableLoading(loading: boolean): void {
    const newConfig = { ...this.tableConfig };
    newConfig.loading = loading;
    this.tableConfig = newConfig;
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.setTableLoading(true);
    setTimeout(() => {
      this.setTableLoading(false);
      if (event.page === 0) {
        this.initDataTable();
      } else {
        this.initDataTable2();
      }
    }, 1000);
  }

  dataDropdown(arr: ItemDropdown[], item: any, title: any) {
    if (arr && arr.findIndex(i => i.value === item[title]) === -1) {
      if (item[title]) {
        arr.push(new ItemDropdown(item[title], item[title]));
      }
    }
  }

  fetchChildItem(event: any) {
    if ('expanded' in event && !event.expanded) {
      setTimeout(() => {
        event.rowData.dataExpand = [{
          'title': 'PSX File Drop Server',
          'value': 'Multiple rows can be expanded at the same time, if you prefer a single row expansion at any time set rowExpandMode property to single. All rows are collapsed initially and providing expandedRowKeys property whose value is the dataKeys of the rows to be expanded enables rendering these rows as expanded. A dataKey must be defined for this feature.'
        }, {
          'title': 'CUCM File Drop PSX File Drop Server',
          'value': 'Columns can be resized using drag drop by setting the resizableColumns to true. There are two resize modes; "fit" and "expand". Fit is the default one and the overall table width does not change when a column is resized. In "expand" mode, table width also changes along with the column width. onColumnResize is a callback that passes the resized column header as a parameter. For dynamic columns, setting pResizableColumnDisabled property as true disables resizing for that particular column.'
        }, {
          'title': 'C20 File Drop PSX File Drop Server',
          'value': 'It is important to note that when you need to change column widths, since table width is 100%, giving fixed pixel widths does not work well as browsers scale them, instead give percentage widths.'
        }, {
          'title': 'PCAP File Drop PSX File Drop Server',
          'value': 'Note: Scrollable tables require a column group to support resizing.'
        }];
        const tempConfig = { ...this.tableConfig };
        tempConfig.loading = false;
        this.tableConfig = tempConfig;
      }, 1000);
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

  initDataTable() {
    this.data = [
      {
        'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true, 'actions': [
          {
            icon: 'fas fa-pen',
            label: 'edit action',
            tooltip: 'test',
            onClick: 'table action 1'
          }
        ]
      },
      {
        'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false, 'actions': [
          {
            icon: 'fas fa-pen',
            label: 'edit action',
            tooltip: 'test'
          }
        ]
      },
      {
        'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false
      },
      {
        'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false
      },
      {
        'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined
      }
    ];
  }

  initDataTable2() {
    this.data = [
      {
        'brand': 'VW_N', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff', 'seller': true, 'actions': [
          {
            icon: 'fas fa-pen',
            label: 'edit action',
            tooltip: 'test',
            onClick: 'table action 1'
          }
        ]
      },
      {
        'brand': 'Audi_N', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345', 'seller': false, 'actions': [
          {
            icon: 'fas fa-pen',
            label: 'edit action',
            tooltip: 'test'
          }
        ]
      },
      {
        'brand': 'Renault_N', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr', 'seller': false
      },
      {
        'brand': 'BMW_N', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh', 'seller': false
      },
      {
        'brand': 'Volvo_N', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj', 'seller': undefined
      }
    ];
  }
}

export default {
  title: 'Rbn-Table/PaginatorMode_Server',
  decorators: [
    withA11y,
    withKnobs,
    moduleMetadata({

      declarations: [ExtensibleHeaderComponent],
      imports: [
        ButtonModule,
        BrowserAnimationsModule,
        DropdownModule,
        RbnCommonLibModule, HttpClientModule, BrowserModule, RouterModule.forRoot([], { useHash: true })
      ],
      providers: [TranslateService, HeaderService]
    })
  ]
};

export const PaginatorMode_Server = () => ({
  template: '<rbn-extensible-header></rbn-extensible-header>'
});
