import { Component, OnInit, Inject } from '@angular/core';
import { SecurityRealmsInterfaceService } from '../services/security-realms-interface.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../base.component';
import { SecurityRealms } from '../securityRealms';
import { ActivatedRoute } from '@angular/router';
import { NavigateCommonService } from '../services/navigate-common.service';
import { FilterTypes, ItemDropdown } from '../../models/common-table';

@Component({
  selector: 'rbn-security-realms',
  templateUrl: './security-realms.component.html',
  styleUrls: ['./security-realms.component.scss']
})
export class SecurityRealmsComponent extends BaseComponent implements OnInit {
  data: SecurityRealms[] = [];
  selectedRow?: any;
  selectedRealm: SecurityRealms | undefined;
  isShowDelete = false;
  isShowEnableDisable = false;
  isDisableSelected = false;
  isEnableSelected = false;
  translateAdminResults: any;
  actions = {
    enable: 'enable',
    disable: 'disable',
    delete: 'delete'
  };

  cols: any[] = [
    { field: 'reorder', header: '', sort: false, colsEnable: true },
    { field: 'sequence', header: '', sort: true, colsEnable: true, options: { model: '' }, data: [] },
    {
      field: 'name', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown,
      options: { model: '', usingLink: true }, data: []
    },
    { field: 'type', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, options: { model: '' }, data: [] },
    { field: 'enabled', header: '', sort: true, colsEnable: true, type: FilterTypes.Dropdown, options: { model: '' }, data: [] },
    { field: 'action', header: '', sort: false, colsEnable: true }
  ];

  constructor(@Inject('SecurityRealmsInterfaceService') private securRealmsService: SecurityRealmsInterfaceService,
    private translate: TranslateService, private route: ActivatedRoute, private navigateService: NavigateCommonService) {
    super();
    this.tableName = 'tableSecurityRealms';
    this.translate.get('ADMIN').subscribe((result: any) => {
      this.cols[0].header = result.REORDER;
      this.cols[1].header = result.SEQUENCE;
      this.cols[2].header = result.REALM;
      this.cols[3].header = result.TYPE;
      this.cols[4].header = result.STATUS;
      this.cols[5].header = result.ACTIONS;

      this.translateAdminResults = result;
    });
    this.translate.get('COMMON').subscribe((result: any) => {
      this.translateResults = result;
    });
  }

  ngOnInit() {
    this.getRealms();
  }

  createActionsDropdown(status: boolean) {
    const actionsList = [
      { label: this.translateAdminResults.ENABLE, value: this.actions.enable },
      { label: this.translateAdminResults.DELETE, value: this.actions.delete }
    ];
    if (status) {
      actionsList[0] = { label: this.translateAdminResults.DISABLE, value: this.actions.disable };
    }
    return actionsList;
  }

  getRealms() {
    // reset data
    this.data = [];
    this.securRealmsService.getRealms().subscribe((data) => {
      this.data = data.body;
      this.data.map((item: any) => {
        item.actions = this.createActionsDropdown(item.enabled);
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => { },
    () => {
      this.initDropdownData(this.cols);
      this.data.map((item: any) => {
        this.cols.map(col => {
          if (col.type === FilterTypes.Dropdown) {
            this.dataDropdown(col.data, item, col.field);
          }
        });
      });
      this.cleanDataTableFilter(this.data, this.cols);
    }
    );
  }

  dataDropdown(arr: ItemDropdown[], item: any, title: any) {
    if (item[title] === true) {
      item[title] = this.translateResults.ENABLED;
    } else if (item[title] === false) {
      item[title] = this.translateResults.DISABLED;
    }
    if (arr.findIndex(i => i.label === item[title]) === -1) {
      if (item[title] !== undefined) {
        arr.push(new ItemDropdown(item[title], item[title]));
      }
    }
  }

  // select row of table
  onLinkClick(selectedRow: any) {
    this.navigateService.navigateToForm(this.route, selectedRow.id);
  }

  // click refesh button
  refreshData() {
    this.selectedRow = undefined;
    this.resetActionsMode();
    this.getRealms();
  }

  // click add button
  addRealm = () => {
    this.navigateService.navigateToForm(this.route);
  };

  // on reOrder row
  onEventRowReorder() {
    const reorderedArr = [];
    for (let i = 0; i < this.data.length; i++) {
      reorderedArr.push(this.data[i].name);
    }
    this.securRealmsService.reorderSecurityRealm(reorderedArr).subscribe(() => {
      setTimeout(() => {
        this.refreshData();
      }, 1000);
    },
    err => {
      if (err.status !== 403) {
        setTimeout(() => {
          this.refreshData();
        }, 1000);
      }
    });
  }

  // Select Action
  onChangeActions({ rowData, event, rowIndex }: { rowData: SecurityRealms, event: any, rowIndex: number }) {
    this.selectedRow = rowData;
    if (event && ('value' in event)) {
      this.resetActionsMode();
      switch (event.value) {
        // Action Disable
        case this.actions.disable:
          this.isShowEnableDisable = true;
          this.isDisableSelected = true;
          break;
        // Action Enable
        case this.actions.enable:
          this.isShowEnableDisable = true;
          this.isEnableSelected = true;
          break;
        // Action Delete
        case this.actions.delete:
          this.isShowDelete = true;
          break;
      }
    }
  }

  resetActionsMode() {
    this.isShowDelete = false;
    this.isShowEnableDisable = false;
    this.isEnableSelected = false;
    this.isDisableSelected = false;
  }

  // event close Detete popup
  eventCloseDelete(event: boolean) {
    this.isShowDelete = false;
    this.closeDialog(event);
  }
  // evet Close Disable/Enable popup
  eventCloseEnableDisable(event: boolean) {
    this.isShowEnableDisable = false;
    this.closeDialog(event);
  }

  closeDialog(event: boolean) {
    this.selectedRow = undefined;
    this.resetFilter();
    this.resetAllDropDownActions(this.data);
    if (event) {
      this.data = [];
      this.getRealms();
    }
  }

}
