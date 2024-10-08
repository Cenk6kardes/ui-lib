import {
  Component, OnChanges, Output, EventEmitter, Input, SimpleChanges, AfterContentChecked,
  ViewChild, ChangeDetectorRef, OnInit, AfterViewInit, ElementRef, HostListener, QueryList, ViewChildren, OnDestroy, TemplateRef,
  Renderer2,
  SimpleChange
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ColumnHidingMode, ExpandDataMode, ExpandDisplayType, FieldName, FilterTypes, IActionColumn, IActionColumnConfig, Icols,
  IComplexDialogConfig, IFilterServerData, IFilterServerDataEmit, IHiddingColumnComplexEmit, ISearchGlobal, IStorageData,
  ITableConfig, PaginatorMode, rowExpandMode, StatusSelectedRowsTableModeServer, ColEllipsisStatus, ItemDropdown
} from '../../models/common-table';
import { KeyCode, KeyEvent } from '../../models/keyboard';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { BaseTableComponent } from '../shared/base-table.component';
import { ColumnHidingSimpleComponent } from './column-hiding-simple/column-hiding-simple.component';
import { RbnTableService } from '../shared/rbn-table.service';
import { FilterService, MenuItem } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { OverlayPanel } from 'primeng/overlaypanel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportTableComponent } from './export-table/export-table.component';


@Component({
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  selector: 'rbn-table',
  providers: [DatePipe]
})
export class TableComponent extends BaseTableComponent implements OnInit, OnChanges, AfterContentChecked, AfterViewInit, OnDestroy {
  @Input() cols: Icols[] = [];
  @Input() data = [];
  @Input() rowExpansionTpl: any; // add row expand tempalte
  @Input() tableConfig: ITableConfig; // input congif table
  @Input() tableColumnComponents?: any;
  @Input() filterColumnComponents?: any;
  @Input() isClearSelected: boolean;
  @Input() timezoneFormat: string | undefined; // input format date for typetableConfig.tableOptions.formatDate
  @Input() filterData: IFilterServerData; // input filterData PaginatorMode.Server
  @Input() showExportColumns: boolean; // show export columns table
  @Input() filterDelay = 600;

  @Output() backBreadCrumb = new EventEmitter();
  @Output() changeActions = new EventEmitter();
  @Output() changeTableActions = new EventEmitter();
  @Output() checkboxChange = new EventEmitter();
  @Output() clickTableActions = new EventEmitter();
  @Output() closeTable = new EventEmitter();
  @Output() colsChanged = new EventEmitter();
  @Output() customGlobalFilter = new EventEmitter();
  @Output() customSort = new EventEmitter();
  @Output() deleteButtonClick = new EventEmitter();
  @Output() dropdownFilterChanged = new EventEmitter();
  @Output() filter = new EventEmitter();
  @Output() itemEllipsisClick = new EventEmitter();
  @Output() linkClick = new EventEmitter();
  @Output() linkClickField = new EventEmitter();
  @Output() linkClickArrayValue = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Output() resetRowFilter = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  @Output() rowReorder = new EventEmitter();
  @Output() rowUnselect = new EventEmitter();
  @Output() switchChange = new EventEmitter();
  @Output() fetchChildItem = new EventEmitter();
  @Output() changeInputNumber = new EventEmitter();
  @Output() changeInputText = new EventEmitter();
  @Output() changeCellDropdown = new EventEmitter();
  @Output() changeSelectAllPageValue = new EventEmitter();
  @Output() rowExpandEvent = new EventEmitter();
  @Output() emitEventDropdownFilter = new EventEmitter();
  @Output() clearSearchGlobalInput = new EventEmitter();
  @Output() pageChangeOnFilterOrSort = new EventEmitter();
  @Output() exportDataModeServerEvent = new EventEmitter();
  @Output() dataChange = new EventEmitter();// two-way data binding for @Input data. We can use <rbn-table [(data)]="dataTable"></rbn-table>
  @Output() pageChangeClient = new EventEmitter();

  selectedRowData: any;
  itemsContextMenu: MenuItem[] = [];
  isShowContextMenu = false;
  paginatorMode: string;
  allowSelectAllRows = true;
  PaginatorMode = PaginatorMode;
  enableSearchGlobal: boolean;
  enableFilter: boolean;
  showSearchBox = false;
  inputFilterChanged: Subject<any>;
  loading: boolean;
  actionColumnConfig: IActionColumnConfig;
  showingActions: IActionColumn[];
  dropdownActions: IActionColumn[];
  selectedDropdownActionIndex: number;
  selectedDropdownActionData: Object;
  showMoreActionsIndex: number;

  ColumnHidingMode = ColumnHidingMode;
  columnHidingMode: ColumnHidingMode;
  colHidingDialogComplexConfig: IComplexDialogConfig;
  extensibleHeaderTemplate: any;
  extensibleTemplateTableChildren: any;
  extensibleHeaderData: any;
  extensibleHeaderService: any;
  totalRecords: number;
  maxLimitRecordsExportServer: number;

  messageSelect: string;
  selectAllRow: string;
  isSelectAllRows: boolean;
  pCheckbox;
  showColumns = false;
  hideCheckboxAll: boolean;
  fiterData: string[] = [];
  colsNotChanges = [
    FieldName.Checkbox,
    FieldName.Expand,
    FieldName.RowGroup
  ];
  parentData: any;
  isResizableColumns = true;
  isAutoLayout = false;
  contentEllipsisOverlay = '';
  frozenMenuItems: MenuItem[] = [];
  frozenColumnClear = false;
  colsResizeObserver: ResizeObserver;

  @ViewChild(ColumnHidingSimpleComponent) columnHidingSimpleComponent: ColumnHidingSimpleComponent;
  @ViewChild('paginatorMode', { read: ElementRef }) paginatorModeElement: ElementRef;
  @ViewChild('paginatorMode') paginatorModeServer: Paginator;
  @ViewChild('opEllipsis') opEllipsis: OverlayPanel;

  @ViewChild('rbnExportTable') rbnExportTable: ExportTableComponent;

  @ViewChildren('headerSortCol') headerSortCols: QueryList<ElementRef>;
  @ViewChildren('headerCol') headerCols: QueryList<ElementRef>;
  @ViewChildren('tempTxt') tempTxts: QueryList<ElementRef>;
  @ViewChildren('tempTxt2') tempTxt2s: QueryList<ElementRef>;

  isExpanded = false;
  expandedRows = {};
  showingConfigActions: any[];
  moreActions: any[];
  lastRowIndex: number;
  filteredValueLength: number;
  rowPerPage: number;
  classNameEleExpand = 'group-icon pi pi-chevron-down';
  searchConfig: ISearchGlobal = {
    searchData: ''
  };
  expandDataMode: undefined | string;
  expandDisplayType: undefined | string;
  isShowConfirmDialogSettingDefault = false;
  backupCols: Icols[];
  subActionItems: MenuItem[] = [];
  exportColumns: any[] = [];
  colsAutoShowComplex = 12;
  overlayAppendElement: any;
  showCSVContainer = false;
  selectedRowsTemp: any[] = [];
  isPageChange = false;
  firstSpecialCols: string[] = [this.fieldName.Checkbox, this.fieldName.RadioButton, this.fieldName.Expand];
  dataExport: any[] = [];
  @HostListener('window:resize')
  onResize() {
    if (this.tableConfig.allowFrozenColumn) {
      setTimeout(() => {
        this.resizeFrozenCol();
      });
    }
  }

  constructor(
    public translate: TranslateService,
    public datePipe: DatePipe,
    public rbnTableService: RbnTableService,
    public filterService: FilterService,
    public changeDetectorRef: ChangeDetectorRef,
    public elementRef: ElementRef,
    public liveAnnouncer: LiveAnnouncer,
    private render: Renderer2
  ) {
    super(translate, datePipe, rbnTableService, filterService, elementRef);
    this.onOpenAdvanceOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedRows) {
      this.updateCheckboxStatus();
    }
    if (changes.tableConfig) {
      this.updateVariables(changes.tableConfig);
      this.handleSelectedRows();
    }
    if (this.tableConfig.tableOptions && changes.timezoneFormat && changes.timezoneFormat.currentValue) {
      this.tableConfig.tableOptions.formatDate = changes.timezoneFormat.currentValue;
    }
    if (changes.data && changes.data.currentValue && this.cols && this.cols.length > 0) {
      this.updateVariablesDataOnly();
      this.initDropdownData(this.cols);
      this.allCols = this.allCols || this.cols;
      this.setDropdownDataCols(changes.data.currentValue);
      if (this.tableConfig.convertActions === undefined || this.tableConfig.convertActions) {
        this.convertActionData();
      }
      this.handleSelectedRows(true);
    }
    if (changes.filterData && this.tableConfig.paginatorMode === PaginatorMode.Server && this.filterData) {
      Object.entries(this.filterData).forEach(([key, value]) => {
        const col = this.cols.find(x => x.field === key);
        if (col) {
          value = value.filter(x => x !== '');
          const data = value.map((x: string) => ({ label: x, value: x }));
          col.data = data;
        }
      });
      this.initDropdownData(this.cols);
    }
    if (changes.isClearSelected && !changes.isClearSelected.firstChange) {
      this.pCheckbox = false;
      this.selectedRows = [];
      this.onCheckboxHeader();
    }

    super.ngOnChanges(changes);
    const tmpCols = JSON.parse(JSON.stringify(this.cols));
    if (!this.allCols) {
      this.allCols = tmpCols;
    }

    if (changes.cols) {
      if (changes.cols.currentValue !== changes.cols.previousValue) {
        this.allCols = changes.cols && changes.cols.currentValue;
        this.colHidingDialogSimpleConfig.cols = this.allCols;
      }
      this.getColSpanOfRowGroup();
    }

    this.colHidingDialogComplexConfig = {
      displayDialog: this.colHidingDialogComplexConfig && this.colHidingDialogComplexConfig.displayDialog ? true : false,
      possibleCols: this.allCols.filter(x => x.header),
      visibleCols: (this.reorderColsByStorage.length > 0 ? this.reorderColsByStorage : this.allCols)
        .filter(x => x.colsEnable && x.header),
      tableActive: this.colHidingDialogComplexConfig && this.colHidingDialogComplexConfig.tableActive
        ? this.colHidingDialogComplexConfig.tableActive : undefined
    };

    this.colHidingDialogComplexConfig.isFromSimple =
      (this.columnHidingMode && this.columnHidingMode === ColumnHidingMode.Complex) ? false : true;
    this.colHidingDialogSimpleConfig.showAdvancedOption = true;
    this.colHidingDialogSimpleConfig.cols = this.colHidingDialogSimpleConfig?.cols || JSON.parse(JSON.stringify(this.allCols));
    if (this.tableConfig.allowFrozenColumn) {
      // action column is always visible and pushed to last index
      const actionIndex = this.colHidingDialogSimpleConfig.cols.findIndex(col => col.field === FieldName.Action);
      if (actionIndex !== -1) {
        const actionCol = actionIndex !== -1 ? this.colHidingDialogSimpleConfig.cols.splice(actionIndex, 1)[0] : undefined;
        if (actionCol) {
          actionCol.allowHide = false;
          this.colHidingDialogSimpleConfig.cols.push(actionCol);
        }
      }
    }
    this.hideCheckboxAll = this.tableConfig.tableOptions?.hideCheckboxAll;
    this.loading = this.tableConfig.loading;

    this.lastRowIndex = this.first + this.numberRowPerPage - 1;
    this.lastRowIndex = this.lastRowIndex + 1 > this.data?.length ? this.data.length - 1 : this.lastRowIndex;
    this.rowPerPage = this.numberRowPerPage;
    this.configFrozen();
  }

  configFrozen() {
    if (!this.tableConfig.allowFrozenColumn) {
      this.cols.map(el => delete el.frozen);
      return;
    }
    this.cols.map((el, i) => {
      if (this.firstSpecialCols.includes(this.cols[0].field)) {
        if ((i <= 3 || el.field === this.fieldName.Action)) {
          if (el.frozen === undefined) {
            el.frozen = false;
          }
        } else {
          delete el.frozen;
        }
        this.cols[0].frozen = this.cols[1]?.frozen || false;
      } else {
        if ((i <= 2 || el.field === this.fieldName.Action)) {
          if (el.frozen === undefined) {
            el.frozen = false;
          }
        } else {
          delete el.frozen;
        }
      }
      if (el.field === this.fieldName.Action) {
        this.frozenColumnClear = el.frozen as boolean;
      }
    });
    this.setBorderFrozenCol();
    setTimeout(() => {
      this.resizeFrozenCol();
    });
  }

  ngOnInit(): void {
    this.searchConfig.searchData = this.searchData;
    if (!this.isResizableColumns) {
      sessionStorage.removeItem(this.generateKey() + '_resize');
    }
    this.backupCols = JSON.parse(JSON.stringify(this.allCols));
    if (this.isResizableColumns) {
      this.cols = this.cols.filter((col: Icols) => col.colsEnable);
      this.setColsHeaderBorder();
    }
    if (this.tableConfig.actionColumnConfig && this.tableConfig.actionColumnConfig.actions && this.isShowContextMenu) {
      this.setConTextMenu();
    }
  }

  showEllipsisOverlay(e: any, value: string) {
    this.contentEllipsisOverlay = value;
    if (!this.opEllipsis.render) {
      this.opEllipsis.show(e);
    }
  }

  hideEllipsisOverlay() {
    this.contentEllipsisOverlay = '';
    this.opEllipsis.hide();
  }

  setDropdownDataCols(dataChanges?: any) {
    if (dataChanges && this.tableConfig.paginatorMode === PaginatorMode.Client) {
      dataChanges.forEach((currentData, i) => {
        this.cols.forEach((col, index) => {
          if (
            ((col.type === FilterTypes.Dropdown) ||
              (col.type === FilterTypes.Multiselect)) && currentData[col.field]
          ) {
            const tablesDataChange = col.data?.find((el) => el.value === currentData[col.field]);
            if (!tablesDataChange && typeof currentData[col.field] !== 'object') {
              this.cols[index].data?.push(new ItemDropdown(currentData[col.field] + '',
                currentData[col.field]));
            }
            col.data?.forEach((colData) => {
              const colDataChange = dataChanges.find((el) => el[col.field] === colData.value);
              if (!colDataChange && colData.value !== '') {
                this.cols[index].data = this.cols[index].data?.filter((el) => el.value !== colData.value);
              }
            });
          }
        });
      });
    }
    this.cols.forEach((col, index) => {
      if (
        (col.type === FilterTypes.Dropdown &&
          (!col.data || col.data.length <= 1)) ||
        (col.type === FilterTypes.Multiselect &&
          (!col.data || col.data.length <= 0))
      ) {
        if (col.type === FilterTypes.Dropdown) {
          col.data = JSON.parse(JSON.stringify(col.data));
        }
        this.data.forEach(item => {
          this.cols[index].data = this.dataDropdown(col.data, item, col.field);
        });
      }
    });
  }

  setConTextMenu(): void {
    if (this.tableConfig.actionColumnConfig && this.tableConfig.actionColumnConfig.actions) {
      for (let i = 0; i < this.tableConfig.actionColumnConfig.actions.length; i++) {
        if (this.tableConfig.actionColumnConfig.actions[i].label
          || this.tableConfig.actionColumnConfig.actions[i].tooltip) {
          this.itemsContextMenu.push(
            {
              label: this.tableConfig.actionColumnConfig.actions[i].label || this.tableConfig.actionColumnConfig.actions[i].tooltip,
              command: () => this.tableConfig.actionColumnConfig?.actions[i].onClick(this.selectedRowData, i)
            });
        }
      }
    }
  }

  frozenCol(ev, cm, col) {
    if (!this.tableConfig.allowFrozenColumn) {
      return;
    }
    ev.preventDefault();
    if (col?.frozen !== undefined) {
      this.frozenMenuItems = [];
      const frozenLabel = col.frozen ? this.translateResults.TABLE.UNLOCK_COL : this.translateResults.TABLE.LOCK_COL;
      const frozenIcon = col.frozen ? 'fas fa-unlock' : 'fas fa-lock';
      let i = this.getfrozenIndexCol(ev?.target);
      // update index if rowExpand is counted as one column when using rowExpansionTpl
      if (this.rowExpansionTpl && !this.extensibleTemplateTableChildren) {
        i = i - 1;
      }
      this.frozenMenuItems = [{
        label: frozenLabel,
        icon: frozenIcon,
        command: () => this.executeFrozen(i, col)
      }];
      cm?.toggle(ev);
      // setTimeout the overlay is rendered on UI
      setTimeout(() => {
        const link = cm?.containerViewChild?.nativeElement?.querySelector('a');
        if (link) {
          link.focus();
          link.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.key === 'Enter') {
              link.click();
              ev.srcElement.focus();
            } else if (event.key === 'Escape') {
              ev.srcElement.focus();
            } else if (event.key === 'Tab') {
              cm?.toggle(ev);
              ev.srcElement.focus();
            }
          });
        }
      }, 0);
    }
    return false;
  }

  executeFrozen(index: number, col: Icols) {
    if (index === -1) {
      return;
    }
    if (index === 1 && this.firstSpecialCols.includes(this.cols[0].field)) {
      this.cols[0].frozen = !this.cols[0].frozen;
    }
    // execute sibling of current frozen
    if (this.cols[index].frozen) {
      for (let i = index; i < this.cols.length; i++) {
        if (this.cols[i].frozen === undefined) {
          break;
        }
        this.cols[i].frozen = false;
      }
    } else {
      for (let i = index; i >= 0; i--) {
        this.cols[i].frozen = true;
        if (this.cols[i].field === this.fieldName.Action) {
          break;
        }
      }
    }
    this.configFrozen();
    const frozenTranslate = col.frozen ? this.translateResults.TABLE.COL_IS_LOCKED : this.translateResults.TABLE.COL_IS_UNLOCKED;
    if (frozenTranslate) {
      const msg = frozenTranslate.replace('{0}', col.header || '');
      this.liveAnnouncer.announce(msg);
    }
    this.setDataTableToStorage();
  }

  onChangeFrozen(ev) {
    if (ev === null) {
      this.configFrozen();
      return;
    }
    const colIndex = this.cols.findIndex(el => el.field === ev.field);
    this.executeFrozen(colIndex, ev);
  }

  getfrozenIndexCol(target) {
    if (!target) {
      return -1;
    }
    if (!target.cellIndex && typeof target.cellIndex !== 'number') {
      return this.getfrozenIndexCol(target.parentElement);
    }
    return target.cellIndex;
  }

  onRightClick(rowData: any, cm: any): void {
    this.clearStyleContextMenu();
    if (this.tableConfig.actionColumnConfig && this.tableConfig.actionColumnConfig.actions) {
      this.checkDisableItemContextMenu(rowData);
      let countItemsShow = 0;
      this.tableConfig.actionColumnConfig.actions.forEach((action: IActionColumn) => {
        if (!action.label && !action.tooltip) {
          countItemsShow += 1;
        }
      });
      this.itemsContextMenu = this.itemsContextMenu.splice(0, this.tableConfig.actionColumnConfig.actions.length - countItemsShow);
    } else {
      this.itemsContextMenu = [];
    }
    if (rowData?.actions) {
      for (let i = 0; i < rowData.actions.length; i++) {
        this.itemsContextMenu.push(
          {
            label: rowData.actions[i].label,
            command: () => rowData.actions[i].onClick(rowData, i)
          });
      }
    }
    if (this.itemsContextMenu.length === 0) {
      cm.hide();
    }
  }

  checkDisableItemContextMenu(rowData: any): void {
    if (this.tableConfig && this.tableConfig.actionColumnConfig && this.tableConfig.actionColumnConfig.actions) {
      const actionsColumn = this.tableConfig.actionColumnConfig.actions;
      for (let i = 0; i < actionsColumn.length; i++) {
        const action = actionsColumn[i];
        if (action && action.disableAction && rowData && (
          rowData[action.disableAction.field] === action.disableAction.value)) {
          const findElement = this.itemsContextMenu.find((element: MenuItem) =>
            element.label === action.label
          );
          if (findElement) {
            findElement.style = { 'pointer-events': 'none', opacity: 0.5 };
          }
        }
      }
    }
  }

  clearStyleContextMenu(): void {
    this.itemsContextMenu.forEach((element: MenuItem) => {
      element.style = {};
    });
  }

  getColSpanOfRowGroup() {
    this.colSpanOfRowGroup = 1;
    this.cols.forEach((col: any) => {
      if (col.colsEnable || this.colsNotChanges.indexOf(col.field) !== -1) {
        this.colSpanOfRowGroup += 1;
      }
    });
  }

  ngAfterContentChecked(): void {
    this.updateSelectedChilds();
    this.setUsingLinkSpanTabIndex();
  }

  updateSelectedChilds() {
    if (this.parentData?.selected && this.parentData.children?.length > 0 && this.parentData.children[0].selected !== true) {
      const newSelectedChilds = [...this.selectedChilds];
      this.parentData.children.forEach(child => {
        child.selected = true;
        newSelectedChilds.push(child);
      });
      this.selectedChilds = newSelectedChilds;
      this.changeDetectorRef.detectChanges();
    }
  }

  // prevent focus to usingLink span is hidden by overflow: hidden
  setUsingLinkSpanTabIndex() {
    if (!this.tableConfig.colEllipsisStatus || this.cols.findIndex((col: Icols) => col.colsEnable && col.options?.usingLink) < 0) {
      return;
    }
    const usingLinkSpanSwappers = this.elementRef.nativeElement?.querySelectorAll('div.col-ellipsis-show') || [];
    usingLinkSpanSwappers.forEach(div => {
      if (div) {
        const spans = div.querySelectorAll('span.usingLinkSpan') || [];
        const divWidth = div.offsetWidth;
        let totalWidth = 0;
        spans.forEach(span => {
          if (span) {
            if (span.offsetWidth + totalWidth > divWidth) {
              span.setAttribute('tabIndex', '-1');
            } else {
              span.setAttribute('tabIndex', '0');
            }
            const seperateSpan = span?.nextElementSibling?.offsetWidth || 0;
            totalWidth += span.offsetWidth + seperateSpan;
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.setIdsForEachPage(this.paginatorModeElement);
    this.setIdsForPaginatorDropdown(this.paginatorModeElement);
    // if have StorageData then not load the default value
    const parseDataFilter = this.getStorageData();
    if (!parseDataFilter && (this.isColsHasFilterData() || this.defaultSortSingle)) {
      setTimeout(() => {
        this.setDataTableToStorage();
        this.loadDataStorageToTable();
      }, 0);
    }
    const paginatorType = this.paginatorModeElement ? this.paginatorModeElement : this.dataTable.el;
    const autoLoadingOnChangePage = this.tableConfig?.autoLoadingOnChangePage;
    const allowFrozenColumn = this.tableConfig?.allowFrozenColumn;
    this.dataTable.tableService.valueSource$.subscribe(() => {
      if (autoLoadingOnChangePage) {
        this.loading = false;
      }
      if (this.dataTable.totalRecords > 0) {
        if (allowFrozenColumn) {
          this.setBorderFrozenCol();
        }
        this.addAriaLabelForPaginator(paginatorType, true);
      }
      // handle select option of paginator dropdown (server mode) by keyboard
      if (this.paginatorModeElement) {
        this.onKeyBoardPaginatorDropdown(this.paginatorModeElement.nativeElement);
      }
    });
    if (this.tableConfig?.setEllipsisElStyleOnColResize) {
      this.setEllipsisElStyle();
    }

    this.addAriaLabelForPaginator(paginatorType);
    const paginatorCurrentElement = paginatorType.nativeElement.querySelector('.p-paginator-current');
    if (paginatorCurrentElement) {
      paginatorCurrentElement.id = this.tableName ? this.tableName + 'PaginatorCurrent' : 'paginatorCurrent';
    }
    this.setIdsForPaginationAttributes(this.paginatorModeElement);
    // handle select option of paginator dropdown (client mode) by keyboard
    if (!this.paginatorModeElement) {
      this.onKeyBoardClientPaginatorDropdown();
    }
  }

  setEllipsisElStyle(): void {
    const headerElements = [...this.headerSortCols || [], ...this.headerCols || []];
    this.colsResizeObserver = new ResizeObserver(() => {
      headerElements.forEach(elm => {
        this.checkColsEllipsis(elm.nativeElement, true);
      });
      const textElements = [...this.tempTxts || [], ...this.tempTxt2s || []];
      textElements.forEach(elm => {
        this.checkColsEllipsis(elm.nativeElement);
      });
    });

    headerElements.forEach(header => {
      this.colsResizeObserver.observe(header?.nativeElement);
    });
  }

  getNativeElementBySelector(element: ElementRef, strQuerySelector: string) {
    if (!element || !strQuerySelector) {
      return;
    }
    return element.nativeElement.querySelector(strQuerySelector);
  }

  updateVariablesDataOnly() {
    this.totalRecords = this.tableConfig.totalRecords;
    this.maxLimitRecordsExportServer = this.tableConfig.maxLimitRecordsExportServer;
  }

  // * update value of variable
  updateVariables(changes: SimpleChange) {
    if (this.tableConfig) {
      if (this.tableConfig.isShowContextMenu !== undefined) {
        this.isShowContextMenu = this.tableConfig.isShowContextMenu;
      }
      this.header = this.tableConfig.header;
      this.topButton = this.tableConfig.topButton;
      this.tableOptions = this.tableConfig.tableOptions || {};
      // set default hideColumnInLib;
      if (this.tableOptions.hideColumnInLib === undefined) {
        this.tableOptions.hideColumnInLib = true;
      }
      if (changes?.currentValue?.selectedRows !== changes?.previousValue?.selectedRows) {
        this.selectedRows = this.tableConfig.selectedRows;
      }
      if (this.tableConfig.tableName) {
        this.tableName = this.tableConfig.tableName;
      }
      this.paginatorMode = this.tableConfig.paginatorMode === PaginatorMode.Server ? PaginatorMode.Server : PaginatorMode.Client;

      // allowSelectAllRows: should set default value if not set
      // true for Client mode and false for Server mode
      if (this.tableConfig.allowSelectAllRows === undefined) {
        if (this.paginatorMode === PaginatorMode.Server) {
          this.allowSelectAllRows = false;
        } else {
          this.allowSelectAllRows = true;
        }
      } else {
        this.allowSelectAllRows = this.tableConfig.allowSelectAllRows;
      }
      this.numberRowPerPage = this.tableConfig.numberRowPerPage !== undefined ? this.tableConfig.numberRowPerPage : 10;
      // this.totalRecords = this.tableConfig.totalRecords;
      this.updateVariablesDataOnly();
      this.rowsPerPageOptions = this.tableConfig.rowsPerPageOptions;
      this.isSupportGrouping = this.tableConfig.isSupportGrouping;
      this.isCustomSort = this.tableConfig.isCustomSort;
      this.isScrollable = this.tableConfig.isScrollable !== undefined ? this.tableConfig.isScrollable : true;
      this.scrollX = this.tableConfig.scrollX;
      this.tableActions = this.tableConfig.tableActions;
      this.showTableActionDropdown = this.tableConfig.showTableActionDropdown;
      this.isUsingAppendTo = this.tableConfig.isUsingAppendTo === undefined ? true : this.tableConfig.isUsingAppendTo;
      this.selectedTableAction = this.tableConfig.selectedTableAction;
      this.disabledTableActions = this.tableConfig.disabledTableActions !== undefined ?
        this.tableConfig.disabledTableActions : true;
      this.headerButton = this.tableConfig.headerButton;
      this.headerOL = this.tableConfig.headerOL;
      this.searchPlaceholderText = this.tableConfig.searchPlaceholderText;
      this.dropdownTablePlaceholderText = this.tableConfig.dropdownTablePlaceholderText;
      this.showTemplateSummary = this.tableConfig.showTemplateSummary;
      this.keepFilter = this.tableConfig.keepFilter !== undefined ? this.tableConfig.keepFilter : true;
      this.enableSearchGlobal = this.tableConfig.enableSearchGlobal !== undefined ? this.tableConfig.enableSearchGlobal : true;
      this.enableFilter = this.tableConfig.enableFilter !== undefined ? this.tableConfig.enableFilter : true;
      if (this.tableConfig.expandDataMode) {
        this.expandDataMode = this.tableConfig.expandDataMode;
      }
      if (this.tableConfig.expandDisplayType) {
        this.expandDisplayType = this.tableConfig.expandDisplayType;
      }
      this.columnHidingMode = this.tableConfig.columnHidingMode !== undefined ?
        this.tableConfig.columnHidingMode : ColumnHidingMode.Simple;

      if (this.tableConfig.convertActions === undefined || this.tableConfig.convertActions) {
        this.convertActionData();
      }

      if (this.tableConfig.paginatorMode === PaginatorMode.Server) {
        this.enableSearchGlobal = false;
        this.tableOptions.usingTriStateCheckbox = false;
      }
      this.clientMode = this.tableConfig.paginatorMode === PaginatorMode.Client;
      if (this.tableConfig?.translateResults && (Object.keys(this.tableConfig.translateResults).length !== 0)) {
        this.translateResults = this.tableConfig.translateResults;
      }
      this.extensibleHeaderTemplate = this.tableConfig.extensibleHeaderTemplate;
      if (this.tableConfig.extensibleTemplateTableChildren) {
        this.extensibleTemplateTableChildren = this.tableConfig?.extensibleTemplateTableChildren;
      }
      this.extensibleHeaderData = this.tableConfig.extensibleHeaderData;
      this.extensibleHeaderService = this.tableConfig.extensibleHeaderService;
      this.rowsPerPageOptions = this.tableConfig.rowsPerPageOptions;
      if (this.tableConfig.isResizableColumns !== undefined) {
        this.isResizableColumns = this.tableConfig.isResizableColumns;
      }
      this.isAutoLayout = this.tableConfig.autoLayout;
      if (this.tableConfig.isTableChildren === undefined) {
        this.tableConfig.isTableChildren = false;
      }
      this.searchConfig.tableName = this.tableConfig.tableName;
      if (this.tableConfig.colsAutoShowComplex) {
        this.colsAutoShowComplex = this.tableConfig.colsAutoShowComplex;
      }
      if (this.tableConfig.overlayAppendElement) {
        this.overlayAppendElement = this.tableConfig.overlayAppendElement.nativeElement;
      }
      if (!this.tableConfig.colEllipsisStatus || (this.tableConfig.colEllipsisStatus
        && !Object.values(ColEllipsisStatus).includes(this.tableConfig.colEllipsisStatus as ColEllipsisStatus))) {
        this.tableConfig.colEllipsisStatus = ColEllipsisStatus.Show;
      }
      if (!this.tableConfig.headerColEllipsisStatus || (this.tableConfig.headerColEllipsisStatus
        && !Object.values(ColEllipsisStatus).includes(this.tableConfig.headerColEllipsisStatus as ColEllipsisStatus))) {
        this.tableConfig.headerColEllipsisStatus = ColEllipsisStatus.Show;
      }
    }

    if (!this.inputFilterChanged) {
      this.inputFilterChanged = new Subject();
      const time = this.clientMode ? 0 : 400;
      this.inputFilterChanged
        .pipe(
          debounceTime(time),
          distinctUntilChanged()
        )
        .subscribe((data) => {
          this.handleFilterChanges(data.value, data.col);
        });
    }
  }

  // * get action to show on table
  convertActionData() {
    this.showingConfigActions = [];
    // Maximum actions are displayed. Default is 4
    let slots = this.tableConfig?.actionColumnConfig?.quantityDisplayed;
    if (slots === undefined) {
      slots = 4;
    }
    if (this.tableConfig && this.tableConfig.actionColumnConfig &&
      this.tableConfig.actionColumnConfig.actions && this.tableConfig.actionColumnConfig.actions.length > 0) {
      const actions = this.tableConfig.actionColumnConfig.actions;
      const index = Math.min(slots, actions.length);
      this.showingConfigActions = actions.slice(0, index);
      this.moreActions = actions.slice(index);
      slots = slots - this.showingConfigActions.length;
    }
    if (this.data && this.data.length > 0) {
      this.data.forEach(item => {
        item.dropdownActions = this.moreActions || [];
        if (item && item.actions && item.actions.length > 0) {
          // * get action will open by ellipses icon
          let index = Math.min(slots, item.actions.length);
          let checkSlots = slots;
          if (checkSlots && checkSlots < item.actions.length) {
            checkSlots--;
            index = Math.min(checkSlots, item.actions.length);
          }
          item.showingActions = item.actions.slice(0, index);
          if (index >= checkSlots) {
            item.dropdownActions = item.dropdownActions.concat(item.actions.slice(index));
          }
        }
        if (item.dropdownActions && item.dropdownActions.length > 0) {
          item.dropdownActions.forEach(i => {
            i.command = (event) => this.onClickDropdownActions(event, item, i.outputParam);
            if (i.tooltip) {
              i.tooltipOptions = {
                tooltipLabel: i.tooltip,
                tooltipStyleClass: 'rbn-tooltip',
                tooltipPosition: 'left'
              };
            }
          });
        }
      });
    }
  }

  // * event when click on dropdown action
  onClickDropdownActions(event: any, rowData?: any, actionOutputParam?: any) {
    if (event) {
      super.onClickDropdownActions(event.originalEvent);
      const selectItem = event.item;
      if (selectItem && rowData && rowData.dropdownActions) {
        const selectIndex = rowData.dropdownActions.findIndex(x => x.icon === selectItem.icon);
        if (this.selectedDropdownActionIndex > -1 && selectIndex > -1 && selectItem.onClick) {
          if (actionOutputParam) {
            selectItem.onClick(this.selectedDropdownActionData, this.selectedDropdownActionIndex, actionOutputParam);
          } else {
            selectItem.onClick(this.selectedDropdownActionData, this.selectedDropdownActionIndex);
          }
        }
      }
    }
  }

  // * call function to emit value when filter
  emitFilterChanged(data: IFilterServerDataEmit) {
    this.pageChangeOnFilterOrSort.emit(true);
    this.paginatorModeServer?.changePage(0);
    this.emitFilterServer(data);
    this.pageChangeOnFilterOrSort.emit(false);
  }

  onRefreshData() {
    this.expandedRows = {};
    this.waitingFilterServer = true;
    this.dataTable.selectionKeys = {};
    this.onCloseExpand();
    this.refreshData.emit();
    if (this.tableConfig?.autoLoadingOnChangePage) {
      this.loading = true;
    }
  }

  onCloseExpand() {
    let classIconExpand = '';
    if (this.cols && this.cols.length > 0 && this.cols[0].field === this.fieldName.Checkbox) {
      classIconExpand = '.a-row-group-checkBox';
    } else {
      classIconExpand = '.a-row-group';
    }
    const elements = this.elementRef.nativeElement.querySelectorAll(classIconExpand);
    if (elements && elements.length > 0) {
      [...elements].forEach((ele) => {
        if (ele.firstElementChild
          && (ele.firstElementChild.className === this.classNameEleExpand
            || ele.firstElementChild.className.includes(this.classNameEleExpand))) {
          ele.click();
        }
      });
    }
  }

  handleFilterInputChanges(event, value: any, col: Icols) {
    this.expandedRows = {};
    if (col.type === FilterTypes.InputText) {
      this.inputFilterChanged.next({ event, value, col });
    }
  }

  handleFilterChanges(value: any, col: Icols) {
    this.expandedRows = {};
    if (col && col.options && this.dataTable) {
      col.options.model = this.getModelForCol(col, value);
      this.setDataTableToStorage();
      const storageData = this.getStorageData();
      const storageFilter = storageData && storageData.colsFilter;
      if (this.paginatorMode === PaginatorMode.Server && storageFilter) {
        this.emitFilterChanged({ filter: storageFilter, typeFilter: storageData.typeColsFilter });
      } else {
        switch (col.type) {
          case FilterTypes.InputText:
            this.dataTable.filter(value, col.field, col.matchType ? col.matchType : 'contains');
            if (!value || value.length <= 0) {
              this.fiterData = [];
            }
            break;
          case FilterTypes.Dropdown:
            if (Array.isArray(col.referenceCols) && col.referenceCols.length > 0) {
              if (value === '') {
                this.resetFilter();
              }
              this.emitEventDropdownFilter.emit({ field: col.field, value });
            } else {
              this.dataTable.filter(value, col.field, col.matchType ? col.matchType : 'equals');
              this.onDropdownFilterChanged(col.field, value);
              if (!value || value.length <= 0) {
                this.fiterData = [];
              }
            }
            break;
          case FilterTypes.Multiselect:
            this.dataTable.filter(value, col.field, col.matchType ? col.matchType : 'in');
            if (!value || value.length <= 0) {
              this.fiterData = [];
            }
            break;
          case FilterTypes.Calendar:
          case FilterTypes.DateRange:
            this.onDateChanged({
              startdateValue: col.options.model && col.options.model[0],
              enddateValue: col.options.model && col.options.model[1]
            }, col);
            break;
        }
      }
    }
  }

  resetFilter() {
    this.resetFilterDropdowns();
    this.setDataTableToStorage();
    if (this.paginatorMode === PaginatorMode.Server) {
      this.dataTable.reset();
      this.emitFilterChanged({ reset: true });
    } else {
      if (this.dataTable) {
        this.dataTable.reset();
        if (this.enableSearchGlobal) {
          this.dataTable.filterGlobal('', 'contains');
        }
      }
    }
    this.colsFilterTable = {};
  }

  onFilterInner(event) {
    this.onFilter(event);
    if (event) {
      this.filteredValueLength = event.filteredValue.length;
      this.setLastRowIndex();
    }
  }

  showMoreActions(index) {
    this.showMoreActionsIndex = this.showMoreActionsIndex === index ? undefined : index;
  }

  onDropdownClick(rowData, rowIndex) {
    this.selectedDropdownActionIndex = rowIndex;
    this.selectedDropdownActionData = rowData;
  }

  showColumnDialog() {
    if (this.colHidingDialogComplexConfig) {
      this.colHidingDialogComplexConfig.displayDialog = true;
    }
    super.showColumnDialog();
  }

  // * Listen event when hiding columns complex close
  closeDialog(event?: IHiddingColumnComplexEmit | Icols[] | any) {
    let responseCloseDialog;
    this.rbnTableService.closeDialog.subscribe(res => {
      const value = event || res;
      responseCloseDialog = res;
      if (value) {
        value.isFromSimple = true;
        this.formatColsChange(value);
      }
      this.showColumns = false;
    });
    if (responseCloseDialog || event) {
      this.setDataTableToStorage();
    }
  }

  /**
   * Format data columns to transfer it out
   * * Data columns have emit is columns is display
   */
  formatColsChange(colsData: IHiddingColumnComplexEmit | Icols[] | any, checkboxEvent?) {
    if (colsData) {
      let colsChange;
      if (Array.isArray(colsData)) {
        const colsTmp = JSON.parse(JSON.stringify(this.cols));
        colsChange = colsTmp.filter(x => !colsData.some(d => d.field === x.field));
        if (this.tableOptions && this.tableOptions.hideColumnInLib) {
          this.setHideColumnInLibSimpleMode(colsData);
          return;
        } else {
          if (this.isResizableColumns) {
            this.cols = colsData;
            this.setColsHeaderBorder();
          }
        }
      } else {
        if (this.colHidingDialogComplexConfig && colsData.data) {
          colsChange = colsData.data.visibleCols;
          if (this.tableOptions && this.tableOptions.hideColumnInLib) {
            this.setHideColumnInLibComplexMode(colsData);
            return;
          }
        }
        this.columnHidingMode = colsData.isFromSimple ? ColumnHidingMode.Simple : ColumnHidingMode.Complex;
        this.colHidingDialogComplexConfig.displayDialog = false;
      }

      super.closeDialog();

      setTimeout(() => {
        if (this.paginatorMode === PaginatorMode.Server) {
          this.colsChanged.emit({ colsChange: colsChange, checkboxEvent: checkboxEvent, tableActive: this.tableName });
        }
      }, 100);
    }
  }

  // * set show/hide column in library simple mode
  setHideColumnInLibSimpleMode(colsData) {
    this.cols = this.colHidingDialogSimpleConfig.cols;
    this.allCols.map((item) => {
      const index = colsData.findIndex(n => n.field === item.field);
      if (index !== -1) {
        item.colsEnable = true;
      }
    });
    const listInvisiable = this.findInvisibleCols(this.allCols, colsData);
    listInvisiable.map(col => {
      col.colsEnable = false;
    });
    const tmpCols = this.tableConfig.allowFrozenColumn ? listInvisiable : [...this.allCols];
    this.colHidingDialogComplexConfig.possibleCols = tmpCols.filter(x => x.header);
    this.colHidingDialogComplexConfig.visibleCols = colsData.filter(x => x.header);
    // this.cols = [...colsData];
    colsData.map((items: Icols, inDexItems: number) => {
      const index = this.cols.findIndex((n) => n.field === items.field);
      if (index === -1) {
        // insert items
        this.cols.splice(inDexItems, 0, items);
      }
    });
    if (this.isResizableColumns) {
      this.cols = this.cols.filter((col: Icols) => col.colsEnable);
    }
    this.getColSpanOfRowGroup();
    this.setColsHeaderBorder();
  }

  // * set show/hide column in library simple mode
  setHideColumnInLibComplexMode(colsData) {
    if (colsData.tableActive !== this.tableName) {
      return;
    }
    this.colHidingDialogComplexConfig.possibleCols = colsData.data.possibleCols;
    colsData.data.possibleCols.map(col => {
      if (!colsData.data.visibleCols.some(vi => vi.field === col.field)) {
        col.colsEnable = false;
      }
    });
    colsData.data.visibleCols.map(col => {
      col.colsEnable = true;
    });
    const allColsChanges = [...colsData.data.possibleCols, ...colsData.data.visibleCols];
    this.allCols.map(col => {
      allColsChanges.map(colChange => {
        if (col.field === colChange.field) {
          col.colsEnable = colChange.colsEnable;
        }
      });
    });
    this.colHidingDialogComplexConfig.visibleCols = colsData.data.visibleCols;
    this.cols = this.cols.filter(x => !x.header).concat([...colsData.data.visibleCols]);
    this.configFrozen();
    const newcolHidingDialogSimpleConfig = { ...this.colHidingDialogSimpleConfig };
    newcolHidingDialogSimpleConfig.cols = this.getSortedAllCols(colsData.data.possibleCols, colsData.data.visibleCols);
    this.colHidingDialogSimpleConfig = newcolHidingDialogSimpleConfig;
    this.colHidingDialogComplexConfig.displayDialog = false;
    this.getColSpanOfRowGroup();
    this.setColsHeaderBorder();
  }

  // Get allCols sorted by visibleCols but maintain the possibleCols index
  getSortedAllCols(possibleCols: Icols[], visibleCols: Icols[]): Icols[] {
    const tmpCols = JSON.parse(JSON.stringify(this.allCols));
    const sortByVisibleCols = JSON.parse(JSON.stringify(visibleCols)) || [];
    const emptyHeader = tmpCols.filter(col => !col.header) || [];

    tmpCols.filter(col => col.header).forEach((col, index) => {
      possibleCols.forEach(pCols => {
        if (col.field === pCols.field) {
          sortByVisibleCols.splice(index, 0, col);
        }
      });
    });
    return [...emptyHeader, ...sortByVisibleCols];
  }

  // * find all invisible cols
  findInvisibleCols(cols, visibleCols) {
    return cols.filter(col => !visibleCols.some(vCol => col.field === vCol.field));
  }

  // * set value for hiding config
  onHideColumnDialog() {
    this.showColumns = false;
    if (this.tableOptions && this.tableOptions.hideColumnInLib) {
      return;
    }
    if (this.colHidingDialogComplexConfig) {
      const tmpCols = JSON.parse(JSON.stringify(this.cols));

      const config = JSON.parse(JSON.stringify(this.colHidingDialogComplexConfig));
      config.possibleCols = tmpCols.filter(x => x.colsEnable && x.header);
      config.visibleCols = tmpCols.filter(x => !x.colsEnable && x.header);
      this.colHidingDialogComplexConfig = config;
    }
  }

  // * set value for checkbox All of hiding dialog
  onChangeCheckBoxAllShowCol() {
    if (this.colHidingDialogSimpleConfig) {
      this.colHidingDialogSimpleConfig.cols.forEach(col => {
        col.colDisable = !!this.colHidingDialogSimpleConfig.checkBoxAll;
        col.colsEnable = !col.colDisable;
      });
      this.setColsHeaderBorder();
    }
  }

  /**
   * call when checkbox of hiding columns are checked
   * it will check and set value for checkbox All and format data to emit
   */
  onChangeCheckBoxShowCol() {
    this.rbnTableService.checkboxShowCol.subscribe((checked: any) => {
      if (checked && checked.tableActive === this.tableName) {
        this.colHidingDialogSimpleConfig = checked.config;
        this.setValueCheckBoxAllShowCol();
        this.formatColsChange(checked.colHiding, true);
        this.pipeDateCalendar();
      }
      this.setDataTableToStorage();
      this.getColSpanOfRowGroup();
      this.checkStyleExpand();
    });
  }

  // * check is all checkbox checked?, if all is checked, set value of checkbox All is true
  setValueCheckBoxAllShowCol() {
    if (this.colHidingDialogSimpleConfig !== undefined) {
      let allCheck = true;
      for (const col of this.colHidingDialogSimpleConfig.cols) {
        if (!col.colDisable) {
          allCheck = false;
          break;
        }
      }
      this.colHidingDialogSimpleConfig.checkBoxAll = allCheck;
    }
  }

  // * emit event when page changed.
  onPageChanged(event) {
    if (this.tableConfig?.autoLoadingOnChangePage) {
      this.loading = true;
    }
    this.isPageChange = true;
    if (this.selectedRows && this.selectedRows.length > 0 && this.tableConfig?.keepSelectedRows) {
      this.selectedRowsTemp = [...this.selectedRows];
      this.selectedRowsTemp = this.selectedRowsTemp.map(row => ({ ...row, selected: true }));
    } else {
      this.selectedRows = [];
      this.messageSelect = '';
      this.rowUnselect.emit({ selectedRows: this.selectedRows, pageChanged: true });
    }
    this.pCheckbox = false;
    this.isSelectAllRows = false;
    this.updateCheckboxStatus();
    this.expandedRows = {};
    this.dataTable.rows = event.rows;
    this.pageChanged.emit(event);
    this.waitingFilterServer = true;
    this.setIdsForEachPage(this.paginatorModeElement);
  }

  // * call when checkbox header all is checked
  onCheckboxHeader(event?) {
    this.onCheckboxChanged(event);
    super.onCheckboxHeader(this.pCheckbox, event);
    // this.updateMessageHeader();
  }

  // * set value for checkbox row on table
  onCheckboxChanged(selectAll?) {
    this.translateResults.TABLE = this.translateResults.TABLE || {};

    // * check Do event was call by checkbox or message select?
    const value = selectAll !== undefined ? selectAll : this.pCheckbox;

    const newData = (this.fiterData && this.fiterData.length > 0) ?
      this.fiterData : this.data;
    if (this.tableOptions?.selectionMode !== 'single') {
      this.selectedRows = this.selectedRows || [];
      const newSelectedRows = [...this.selectedRows];

      const start = selectAll !== undefined ? 0 : this.dataTable.first;
      const end = selectAll !== undefined ? newData.length : start + this.currentRecords;

      const oldSelectedRows = [...this.selectedRows];
      for (let i = start; i < end; i++) {
        const item = newData[i];
        let index;
        if (value) {
          index = this.findIndex(oldSelectedRows, item, this.tableConfig?.selectedRowKey);
          if (index === -1) {
            newSelectedRows.push(item);
          }
        } else {
          index = this.findIndex(newSelectedRows, item, this.tableConfig?.selectedRowKey);
          if (index !== -1) {
            newSelectedRows.splice(index, 1);
          }
        }
        if (item) {
          item.selected = value;
        }
      }
      this.selectedRows = selectAll === false ? [] : newSelectedRows;
      if (this.allowKeepSelectedRows()) {
        this.selectedRowsTemp = this.selectedRows;
      }
      this.isSelectAllRows = selectAll;
      this.rowSelect.emit({ selectedRows: this.selectedRows });
    }
    this.updateSelectCurrentPage(newData);
  }

  onPage(event?) {
    this.setIdsForEachPage(this.paginatorModeElement);
    this.updateCheckboxStatus();
    if (event) {
      this.rowPerPage = event.rows;
      this.setLastRowIndex(event.first);
      this.pageChangeClient.emit(event);
    }
  }

  onKeyBoardClientPaginatorDropdown() {
    const dropdown = this.dataTable.el.nativeElement.querySelector('p-paginator p-dropdown');
    this.render.listen(dropdown, KeyEvent.keydown, (e) => {
      if (e.key === KeyCode.ArrowDown || e.key === KeyCode.ArrowUp) {
        this.onKeyBoardPaginatorDropdown();
      }
    });
  }

  onKeyBoardPaginatorDropdown(selectorEle = this.dataTable.el.nativeElement) {
    const dropdown = selectorEle.querySelector('p-paginator p-dropdown .p-dropdown-trigger');
    if (dropdown && dropdown.ariaExpanded === 'true') {
      // click to hide overlay dropdown
      dropdown.click();
      setTimeout(() => {
        dropdown.scrollIntoView();
        setTimeout(() => {
          // click to show overlay dropdown
          dropdown.click();
        }, 200);
      });
    };
  }

  setLastRowIndex(first = 0) {
    this.lastRowIndex = first + this.rowPerPage - 1;
    if (this.lastRowIndex > this.data.length - 1) {
      this.lastRowIndex = this.data.length - 1;
    }
    if (this.lastRowIndex > this.filteredValueLength - 1) {
      this.lastRowIndex = this.filteredValueLength - 1;
    }
  }

  getCurrentRowsOnPage(selectAll?) {
    const newData = (this.fiterData && this.fiterData.length > 0) ?
      this.fiterData : this.data;
    const start = selectAll !== undefined ? 0 : this.dataTable.first;
    const end = selectAll !== undefined ? newData.length : start + this.currentRecords;
    const currentRowsOnPage: Array<any> = [];
    for (let i = start; i < end; i++) {
      currentRowsOnPage.push(newData[i]);
    }
    return currentRowsOnPage;
  }

  isAllRowsOnPagSelected() {
    let rs = true;
    const currentRowsOnPage = this.getCurrentRowsOnPage();
    if (currentRowsOnPage.length === 0) {
      return false;
    }
    const parseSelectedRows = JSON.parse(JSON.stringify(this.selectedRows));
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < currentRowsOnPage.length; i++) {
      let flag = false;
      const elementCurrentRowsOnPage = currentRowsOnPage[i];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let j = 0; j < parseSelectedRows.length; j++) {
        let t = false;
        const elementParseSelectedRows = parseSelectedRows[j];
        const dataKey = this.tableConfig.tableOptions?.dataKey;
        if (dataKey) {
          t = elementCurrentRowsOnPage[dataKey] === elementParseSelectedRows[dataKey];
        } else {
          t = JSON.stringify(elementCurrentRowsOnPage) === JSON.stringify(elementParseSelectedRows);
        }
        if (t) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        rs = false;
        break;
      }
    }
    return rs;
  }

  // * update value for checkbox of row
  updateCheckboxStatus(filterChanges?) {
    const isFilter = filterChanges && filterChanges.filters && filterChanges.filters.global;
    let newData;
    if (isFilter) {
      this.fiterData = filterChanges.filteredValue;
    } else {
      if (this.dataTable.filteredValue && this.dataTable.filteredValue.length > 0) {
        newData = this.dataTable.filteredValue;
        this.fiterData = newData;
      } else {
        if (filterChanges && filterChanges.filteredValue && filterChanges.filteredValue.length > 0) {
          this.fiterData = filterChanges.filteredValue;
        }
      }
      if (Array.isArray(this.selectedRows)) {
        const data = newData ? newData : this.data;
        this.updateSelectCurrentPage(data);
      } else if (typeof this.selectedRows === 'object') {
        this.isSelectAllRows = false;
        this.messageSelect = '';
      }
    }
  }

  // * update value of checkbox All of page
  updateSelectCurrentPage(data) {
    if (this.paginatorMode === PaginatorMode.Server && this.selectedRows?.length === this.totalRecords) {
      this.isSelectAllRows = true;
    }
    if (this.paginatorMode === PaginatorMode.Client && this.selectedRows?.length === this.data.length && this.data.length > 0) {
      this.isSelectAllRows = true;
    }
    this.pCheckbox = false;
    if (data && data.length > 0 && this.isAllRowsOnPagSelected()) {
      this.pCheckbox = true;
    }
    this.updateMessageHeader(data);
    if (this.paginatorMode === PaginatorMode.Server) {
      this.eventOnChangeSelectAllPageValueModeServer();
    }
  }

  getNameStatusSelectedRowsTable() {
    if (this.isSelectAllRows === true && this.selectedRows?.length !== this.totalRecords) {
      return StatusSelectedRowsTableModeServer.AllPage;
    } else {
      return StatusSelectedRowsTableModeServer.NoSelected;
    }
  }

  eventOnChangeSelectAllPageValueModeServer() {
    const t = this.getNameStatusSelectedRowsTable();
    this.changeSelectAllPageValue.emit(t);
  }

  resetSelectAllPageValue() {
    this.isSelectAllRows = false;
  }

  /**
   * Check table with checkbox field
   * @returns boolean
   */
  hasCheckbox() {
    return this.cols.some((col: Icols) => col.field === FieldName.Checkbox);
  }

  // * update value of row select message
  updateMessageHeader(currentData?) {
    this.messageSelect = '';
    const rows = currentData ? currentData : this.data;
    let allRows;
    if (rows) {
      const rowsAllowedSelect = rows.filter(row => !row.disableSelect);
      allRows = rowsAllowedSelect.length;
    }
    if (this.paginatorMode === PaginatorMode.Server) {
      allRows = this.totalRecords;
    }
    if (this.hasCheckbox() && this.selectedRows && this.selectedRows?.length > 0) {
      this.translateResults.TABLE = this.translateResults.TABLE || {};
      this.messageSelect = this.selectedRows?.length === 1 ? this.translateResults.TABLE.MESSAGE_RECORD_OF_PAGE_SELECTED_ONE_ROW :
        this.translateResults.TABLE.MESSAGE_RECORD_OF_PAGE_SELECTED;
      if (this.allowKeepSelectedRows() || this.isSelectAllRows) {
        let recordsTemp = 0;
        recordsTemp = (this.isSelectAllRows && this.paginatorMode === PaginatorMode.Server) ? this.totalRecords :
          this.selectedRows?.length;
        this.messageSelect = recordsTemp === 1 ? this.translateResults.TABLE.MESSAGE_RECORD_SELECTED_ONE_ROW :
          this.translateResults.TABLE.MESSAGE_RECORD_SELECTED;
      }
      this.selectAllRow = '';
      if (this.isSelectAllRows) {
        if (allRows && allRows === 1) {
          this.selectAllRow = this.translateResults.TABLE.DESELECT_ALL_ROW ?
            this.translateResults.TABLE.DESELECT_ALL_ROW.replace('{0}', allRows) : '';
        } else {
          this.selectAllRow = this.translateResults.TABLE.DESELECT_ALL_ROWS ?
            this.translateResults.TABLE.DESELECT_ALL_ROWS.replace('{0}', allRows) : '';
        }
      } else if (this.translateResults.TABLE.SELECTED_ALL_ROWS) {
        this.selectAllRow = this.translateResults.TABLE.SELECTED_ALL_ROWS.replace('{0}', allRows);
      }
    } else if (!this.pCheckbox) {
      this.isSelectAllRows = false;
      this.messageSelect = '';
    }
  }

  // * open hiding columns complex from hiding columns simple
  onOpenAdvanceOptions() {
    this.rbnTableService.openAdvanced.subscribe(open => {
      if (open) {
        this.columnHidingMode = ColumnHidingMode.Complex;
        if (this.columnHidingSimpleComponent) {
          this.colHidingDialogComplexConfig.displayDialog = open === this.columnHidingSimpleComponent.idSimple ? true : false;
        }
        if (this.colHidingDialogComplexConfig) {
          this.colHidingDialogComplexConfig.tableActive = open;
        }
        // this.colHidingDialogComplexConfig.tableName = this.tableName;
      }
    });
  }

  // * Set value to showSearchBox
  setValueShowSearchBox(isShow: boolean) {
    this.showSearchBox = isShow;
  }

  onpanelMultiShow() {
    if (this.isUsingAppendTo) {
      const multiselectElement = this.dataTable.el.nativeElement.querySelector('.p-multiselect-filter');
      multiselectElement.id = 'multiselectFilter';
      const multiselectFilterIcon = this.dataTable.el.nativeElement.querySelector('.p-multiselect-filter-icon');
      multiselectFilterIcon.id = 'filterIcon';
    } else {
      const multiselectElement = document.querySelector('.p-multiselect-filter');
      if (multiselectElement) {
        multiselectElement.id = 'multiselectFilter';
      }
      const multiselectFilterIcon = document.querySelector('.p-multiselect-filter-icon');
      if (multiselectFilterIcon) {
        multiselectFilterIcon.id = 'filterIcon';
      }
    }
  }

  openToggle(event) {
    if (this.allCols && this.allCols.length > this.colsAutoShowComplex) {
      this.rbnTableService.openAdvanced.next(this.tableName);
    } else {
      if (this.columnHidingSimpleComponent && this.columnHidingSimpleComponent.menuHiding) {
        this.columnHidingSimpleComponent.menuHiding.toggle(event);
      }
    }
    this.colHidingDialogSimpleConfig.tableActive = this.tableName;
    this.showColumns = true;
  }

  onRowExpand(event: any) {
    if (Object.keys(this.expandedRows).length === this.data.length) {
      this.isExpanded = true;
    }
    for (const key of Object.keys(this.expandedRows)) {
      const dataKey = this.tableConfig.tableOptions?.dataKey;
      if (dataKey && key !== (event.data[dataKey] + '')) {
        delete this.expandedRows[key];
      }
    }
    if (this.parentData) {
      this.removeChild(this.parentData);
      this.parentData.dataExpand = this.parentData.dataExpand ? this.parentData.dataExpand : undefined;
    }
    this.rowExpandEvent.emit(event);
  }

  removeChild(parent: any) {
    if (parent.children?.length > 0) {
      const selectedChilds = [...this.selectedChilds];
      parent.children.forEach(child => {
        const dataKey = this.tableOptions?.dataKey;
        if (dataKey) {
          const index = selectedChilds.findIndex(x => x[dataKey] === child[dataKey]);
          if (index !== -1) {
            selectedChilds.splice(index, 1);
          }
        }
      });
      this.selectedChilds = selectedChilds;
      parent.children = undefined;
    }
  }

  onRowCollapse(event) {
    if (Object.keys(this.expandedRows).length === 0) {
      this.isExpanded = false;
    }
  }

  rowToggle(rowData, expanded) {
    if (expanded ||
      (this.isSupportGrouping && rowData?.children) ||
      (this.isSupportGrouping && rowData?.dataExpand && rowData?.dataExpand.length >= 0) &&
      !rowData?.rowExpand) {
      this.fetchChildItem.emit(rowData);
    }
    this.loading = !(expanded
      || (this.isSupportGrouping && rowData?.children)
      || (this.isSupportGrouping && rowData?.dataExpand && rowData?.dataExpand.length >= 0))
      || rowData?.rowExpand;
    if (rowData?.rowExpand) {
      this.fetchChildItem.emit({ rowData: rowData, expanded: expanded });
    }
  }

  clearSearchGlobal() {
    this.searchConfig.searchData = '';
    this.searchData = this.searchConfig.searchData;
    this.dataTable.filterGlobal('', 'contains');
    this.clearSearchGlobalInput.emit();
  }

  inputValueEvent(event) {
    this.searchData = event.searchData;
    this.dataTable.filterGlobal(event.searchData, 'contains');
    this.onCustomGlobalFilter(event);

  }
  /* ---------- Output emit -------------*/
  onFilter(event) {
    this.filter.emit(event);
  }

  onCustomGlobalFilter(event: string) {
    this.customGlobalFilter.emit(event);
  }

  onCustomSort() {
    if (this.paginatorMode === PaginatorMode.Server) {
      this.pageChangeOnFilterOrSort.emit(true);
      this.paginatorModeServer.changePage(0);
    } else {
      this.first = 0;
    }
    this.waitingFilterServer = true;
    this.customSort.emit({ field: this.dataTable.sortField, sortOrder: this.dataTable.sortOrder });
    this.expandedRows = {};
    if (this.paginatorMode === PaginatorMode.Client) {
      this.fiterData = this.dataTable.value;
      this.updateCheckboxStatus();
    }
    this.pageChangeOnFilterOrSort.emit(false);
  }

  onRowReorder() {
    this.rowReorder.emit();
  }

  onCloseTable() {
    this.closeTable.emit();
  }

  onResetRowFilter() {
    this.resetRowFilter.emit();
  }

  onClickTableActions(event) {
    this.clickTableActions.emit(event);
  }

  onChangeTableActions(event) {
    this.changeTableActions.emit(event);
  }

  onLinkClick(rowData: object, fieldName: string, value?: any) {
    this.linkClick.emit(rowData);
    this.linkClickField.emit({ fieldName, rowData });
    this.linkClickArrayValue.emit({ value, fieldName, rowData });
  }

  handleEnterArrayLinkOfCell(e: any) {
    if (e && e.target) {
      e.target.click();
      e.stopPropagation();
    }
  }

  isArray(value: any) {
    return value instanceof Array;
  }

  onSwitchChange(event: object, col) {
    this.switchChange.emit({ event, col });
  }

  // when implement, need to update handle funtion
  onRowSelect(event, selectedRows: any[]) {
    this.rowSelect.emit({ event, selectedRows });
  }

  onRowUnselect(dt, selectedRows: any[]) {
    if (this.allowKeepSelectedRows()) {
      this.selectedRowsTemp = selectedRows;
    }
    this.rowUnselect.emit({ dt, selectedRows });
  }

  onChangeActions(rowData, event, rowIndex: number) {
    this.changeActions.emit({ rowData, event, rowIndex });
  }

  onDropdownFilterChanged(field: string, value: any) {
    this.dropdownFilterChanged.emit({ field, value });
  }

  onDeleteButtonClick(event, rowData: object) {
    this.deleteButtonClick.emit({ event, rowData });
  }

  onCheckboxChange(event, selectedRows: any[], selectedChilds?: any[]) {
    this.checkboxChange.emit({ event, selectedRows, selectedChilds });
  }

  onBack() {
    this.backBreadCrumb.emit();
  }

  itemEllipsis(item, row) {
    this.itemEllipsisClick.emit({ item, row });
  }

  onChangeInputNumber(event: object, col) {
    this.changeInputNumber.emit({ event, col });
  }

  onChangeInputText(rowData: object, col: Icols) {
    this.changeInputText.emit({ rowData, col });
  }

  onChangeCellDropdown(event: object, col) {
    this.changeCellDropdown.emit({ event, col });
  }

  checkEnableExpandIcon(rowData: any) {
    // Row expanded with the children (the same columns with parent row)
    if (this.isExpandRowChildren(rowData)) {
      return true;
    }

    // Row expanded with custom data
    if (!this.isExpandRowData()) {
      return false;
    }

    if (this.isExpandClientMode() && rowData?.dataExpand && rowData?.dataExpand.length > 0) {
      return true;
    }

    if (this.expandDataMode === ExpandDataMode.Server) {
      if (this.expandDisplayType === ExpandDisplayType.TabView) {
        return true;
      } else if (rowData?.rowExpand) { // expandDisplayType = Table
        return true;
      }
    }
    return false;
  }

  isExpandRowData() {
    return this.isSupportGrouping && this.expandDataMode && this.expandDisplayType;
  }

  isExpandRowChildren(rowData: any) {
    return this.isSupportGrouping && rowData?.children;
  }

  isExpandClientMode() {
    return this.expandDataMode === ExpandDataMode.Client;
  }

  isExpandServerMode() {
    return this.expandDataMode === ExpandDataMode.Server;
  }

  emitRowData(expanded: boolean, rowData: any, colExpand: any) {
    if (this.isExpandServerMode() || this.expandDisplayType === ExpandDisplayType.Table) {
      this.fetchChildItem.emit({ rowData: rowData, expanded: expanded });
    }
    if (this.tableConfig.tableOptions?.rowExpandMode === rowExpandMode.Single) {
      this.removeStyleExpand();
      if (!expanded) {
        const colExpandStyle = (colExpand.querySelector('.icon-expand') as HTMLElement).style;
        colExpandStyle.top = (colExpand.offsetHeight / 2) + 3 + 'px';
      }
    } else {
      const listColExpandStyle = colExpand?.querySelectorAll('.icon-expand') || [];
      listColExpandStyle.forEach(col => {
        if (!expanded && col) {
          col.style.top = (colExpand.offsetHeight / 2) + 3 + 'px';
        }
      });
    }
  }

  removeStyleExpand() {
    const arrEl = this.elementRef.nativeElement.querySelectorAll('.icon-expanded');
    arrEl.forEach(el => {
      el.removeAttribute('style');
    });
  }

  checkStyleExpand() {
    if (this.elementRef) {
      const arrEl = this.elementRef.nativeElement.querySelectorAll('.icon-expand');
      arrEl.forEach(el => {
        if (el.hasAttribute('style')) {
          setTimeout(() => {
            const topExpand = el.closest('.container-checkbox').offsetHeight;
            (el as HTMLElement).style.top = (topExpand / 2) + 3 + 'px';
          });
        }
      });
    }
  }

  setLoadingTable(expanded: boolean) {
    if (!expanded && this.isExpandRowData() && this.isExpandServerMode()) {
      this.loading = true;
    } else {
      this.loading = false;
    }
  }

  confirmDialog(emit: any): void {
    if (emit) {
      // reset filter
      this.resetFilter();
      this.onResetRowFilter();
      this.showFilterRow = false;
      // reset show/hide column
      this.isShowConfirmDialogSettingDefault = false;
      this.cols = JSON.parse(JSON.stringify(this.backupCols));
      if (this.columnHidingSimpleComponent) {
        if (this.columnHidingSimpleComponent.config && this.columnHidingSimpleComponent.config.cols.length > 0) {
          this.cols.forEach((col: Icols) => {
            for (let i = 0; i < this.columnHidingSimpleComponent.config.cols.length; i++) {
              if (col.field === this.columnHidingSimpleComponent.config.cols[i].field) {
                this.columnHidingSimpleComponent.config.cols[i] = col;
              }
            }
          });
        }
      }
      if (this.colHidingDialogComplexConfig) {
        this.allCols.map(col => {
          col.colsEnable = true;
        });
        this.colHidingDialogComplexConfig.visibleCols = this.allCols.filter(x => x.header);
        this.colHidingDialogComplexConfig.possibleCols = this.allCols.filter(x => x.header);
      }
      this.setDropdownDataCols();
      if (this.enableSearchGlobal) {
        this.clearSearchGlobal();
      }
      this.setColsHeaderBorder();
    } else {
      this.isShowConfirmDialogSettingDefault = false;

    }
  }

  goToPage(pageNumber: number = 1): void {
    // Page number must greater than or equal to 1
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    if (this.tableConfig.paginatorMode === PaginatorMode.Server) {
      if (pageNumber > Math.ceil(this.totalRecords / this.dataTable.rows)) {
        pageNumber = 1;
      }
      this.paginatorModeServer.changePage(pageNumber - 1);
    } else { // paginatorMode = PaginatorMode.Client
      let firstIndex = this.dataTable.rows * pageNumber - this.dataTable.rows;
      if (firstIndex > this.dataTable.totalRecords) {
        firstIndex = 0;
      }
      this.dataTable.first = firstIndex;
    }
  }

  getColNgStyle(col: Icols): object {
    let colNgStyle: object;
    let parseDataColWidth;
    const tableStorage = sessionStorage.getItem(this.generateKey() + '_resize') || '';
    const parseDataFilter = tableStorage ? JSON.parse(tableStorage) : null;
    if (parseDataFilter) {
      const item = parseDataFilter.find(n => n.field === col.field);
      if (item) {
        parseDataColWidth = parseInt(item.style.width, 10);
      }
    }
    if (this.tableConfig.useManualColWidth !== true
      || (this.tableConfig.useManualColWidth === true && parseDataFilter && (parseDataColWidth > col.manualMinColWidth))) {
      colNgStyle = {
        width: col.autoSetWidth !== false ? this.setWidthCol(col) : ''
      };
    } else if (parseDataFilter && (parseDataColWidth <= col.manualMinColWidth)) {
      colNgStyle = {
        'min-width': col.manualMinColWidth !== undefined ? (col.manualMinColWidth + 'px') : '10px',
        'width': col.manualColWidth !== undefined ? (parseDataColWidth + 'px') : ''
      };
    } else { // Use manual col width and min width
      colNgStyle = {
        'min-width': col.manualMinColWidth !== undefined ? (col.manualMinColWidth + 'px') : '10px',
        'width': col.manualColWidth !== undefined ? (col.manualColWidth + 'px') : ''
      };
    }
    return colNgStyle;
  }

  exportPdf() {
    const doc = new jsPDF('landscape');
    const dataExport = this.formatDataExport(this.dataTable._value);
    const columnsExport = this.dataTable._columns.filter(col => col.colsEnable && col.field !== 'action' && col.field !== 'expand')
      .map(col => col.header);
    this.exportColumns = JSON.parse(JSON.stringify(columnsExport));
    // format columns
    const columnStyles = {};
    for (let i = 0; i <= this.exportColumns.length; i++) {
      columnStyles[i] = { minCellWidth: 20 };
    }
    autoTable(doc, {
      columnStyles: columnStyles,
      head: [this.exportColumns],
      body: dataExport
    });
    doc.save('Data.pdf');
  }

  exportTable() {
    this.dataExport = this.dataTable?.filteredValue ? this.dataTable.filteredValue : this.data;
    this.showCSVContainer = true;
  }

  closeCSVDialog(event: any) {
    this.showCSVContainer = false;
  }

  formatDataExport(data: any[]): any {
    let newData = JSON.parse(JSON.stringify(data));
    if (newData) {
      newData = newData.map(row => {
        const columnsExport = this.dataTable._columns.filter(col => col.colsEnable);
        const exportField: Array<any> = [];
        columnsExport.forEach(col => {
          for (const key of Object.keys(row)) {
            if (col.field === key && !col.options?.usingDropdown) {
              exportField.push(col.field);
            } else if (col.options?.usingDropdown && key === col.field + 'DrItemSelected') {
              // find value of dropdown to export
              row[key] = row[key]?.value;
              exportField.push(key);
            }
          }
        });
        return exportField.map(key => ({
          content: typeof row[key] === 'object' ?
            JSON.stringify(row[key]) : row[key], colSpan: 1, rowSpan: 1
        }));
      });
      return newData;
    }
  }

  onClick3DotsBtn() {
    const btn3DotsConfig = this.tableConfig?.tableOptions?.btn3DotsConfig;
    if (!this.tableConfig?.tableOptions?.show3DotsButton || !this.translateResults ||
      Object.keys(this.translateResults).length === 0 || this.subActionItems.length !== 0) {
      return;
    }
    if (btn3DotsConfig?.resetTableLayoutByLib) {
      this.subActionItems.push(
        {
          label: this.translateResults.RESET_TABLE_LAYOUT,
          command: () => {
            this.isShowConfirmDialogSettingDefault = true;
          }
        }
      );
    }
    if (btn3DotsConfig?.exportCSVByLib || btn3DotsConfig?.exportPDFByLib) {
      this.subActionItems.push(
        {
          label: this.translateResults.EXPORT_TABLE,
          command: () => {
            this.exportTable();
          }
        }
      );
    }

    if (btn3DotsConfig?.subActionItems && btn3DotsConfig.subActionItems.length) {
      for (const item of btn3DotsConfig.subActionItems) {
        this.subActionItems.push(item);
      }
    }
  }

  formatIdLink(text: string): string {
    if (text) {
      text = text.toString().replace(/\s/g, '');
    }
    return text;
  }

  isMultiRowHeader(col: Icols): boolean {
    return ((this.tableConfig.enableTwoColHeader === true) && col.header.includes('<br>'));
  }

  getSecondRowColHeader(col: Icols): string {
    return (col.header.split('<br>')[1]);
  }

  getFirstRowColHeader(col: Icols): string {
    return (col.header.split('<br>')[0]);
  }

  getId(prefix, fieldvalue, toLowerCase = false) {
    fieldvalue = prefix || '' + fieldvalue.replace(/[^a-zA-Z0-9_]/g, '');
    fieldvalue = toLowerCase ? fieldvalue.toLowerCase() : fieldvalue;
    return fieldvalue;
  }

  // eslint-disable-next-line arrow-body-style
  trackByFunction = (index, item) => {
    return this.tableConfig.tableOptions &&
      this.tableConfig.tableOptions.dataKey
      ? item[this.tableConfig.tableOptions.dataKey]
      : null;
  };

  allowKeepSelectedRows(): boolean {
    if (this.paginatorMode === PaginatorMode.Client) {
      return true;
    }
    return this.tableConfig?.keepSelectedRows && this.paginatorMode === PaginatorMode.Server ? true : false;
  }

  // handle selected rows when page changed for Server mode
  handleSelectedRows(isDataChange = false): void {
    if (this.isPageChange && this.paginatorMode === PaginatorMode.Server) {
      if (this.allowKeepSelectedRows()) {
        this.selectedRows = [...this.selectedRowsTemp];
        this.rowSelect.emit({ selectedRows: this.selectedRows });
        const checkBoxSelector = '.p-datatable-tbody .container-checkbox p-tablecheckbox div[aria-checked="true"]';
        setTimeout(() => {
          const checkBoxList = this.elementRef.nativeElement.querySelectorAll(checkBoxSelector);
          this.pCheckbox = checkBoxList?.length === this.currentRecords ? true : false;
        });
      } else {
        this.selectedRowsTemp = [];
        this.selectedRows = [];
        this.pCheckbox = false;
        this.isSelectAllRows = false;
        this.rowUnselect.emit({ selectedRows: this.selectedRows, pageChanged: false });
      }
      this.isPageChange = !isDataChange;
    }
  }

  addAriaLabelForPaginator(paginatorType: ElementRef, pageChange = false) {
    this.translate.get('COMMON').subscribe((common: any) => {
      if (pageChange) {
        setTimeout(() => {
          const pages = paginatorType.nativeElement.querySelectorAll('.p-paginator-pages button');
          pages.forEach((page: HTMLElement) => {
            if (!page.ariaLabel) {
              page.ariaLabel = `${common.PAGE} ${page.textContent.trim()}`;
            }
          });
        });
        return;
      }
      const paginator = paginatorType.nativeElement.querySelectorAll('.p-paginator-element');
      paginator?.forEach(el => {
        if (el.classList.contains('p-paginator-first')) {
          el.ariaLabel = common.GO_TO_THE_FIRST_PAGE;
        } else if (el.classList.contains('p-paginator-prev')) {
          el.ariaLabel = common.GO_TO_THE_PREVIOUS_PAGE;
        } else if (el.classList.contains('p-paginator-next')) {
          el.ariaLabel = common.GO_TO_THE_NEXT_PAGE;
        } else if (el.classList.contains('p-paginator-last')) {
          el.ariaLabel = common.GO_TO_THE_LAST_PAGE;
        } else {
          el.ariaLabel = `${common.PAGE} ${el.textContent.trim()}`;
        }
      });

      // Add title "Rows" for paginator
      const addTitleRowsForPaginator = paginatorType.nativeElement.querySelector('.p-paginator .p-inputwrapper-filled');
      if (addTitleRowsForPaginator) {
        addTitleRowsForPaginator.setAttribute('data-content', common.ROWS);
      }

      const rowPerPagePaginator = paginatorType.nativeElement.querySelector('.p-paginator .p-inputwrapper-filled input');
      if (rowPerPagePaginator) {
        rowPerPagePaginator.ariaLabel = common.SELECT_NUMBER_OF_ROWS;
      }
    });
  }

  exportDataModeServer(type: string) {
    let callBack;
    switch (type) {
      case 'csv':
        callBack = {
          command: (e: any[]) => {
            this.rbnExportTable.saveToCSVByData(e);
          }
        };
        break;
      case 'pdf':
        callBack = {
          command: (e: any[]) => {
            this.rbnExportTable.saveToPDFByData(e);
          }
        };
        break;
      default:
        break;
    }
    if (callBack) {
      this.exportDataModeServerEvent.emit(callBack);
    }
  }

  disableUsingLink(colName: string, rowData: any): boolean {
    if (rowData.disableLinks && rowData.disableLinks.length > 0) {
      for (const item of rowData.disableLinks) {
        if (item.colName === colName) {
          return true;
        }
      }
    }
    return false;
  }

  toggleFilterRow() {
    super.toggleFilterRow();
    // annouce the status show/hide of the filterRow
    const msg = this.showFilterRow ? this.translateResults.TABLE?.FILTER_ROW_IS_SHOWING : this.translateResults.TABLE?.FILTER_ROW_IS_HIDING;
    if (msg) {
      this.liveAnnouncer?.announce(msg);
    }
  }

  ngOnDestroy(): void {
    if (this.tableConfig?.setEllipsisElStyleOnColResize) {
      this.colsResizeObserver?.disconnect();
    }
  }

  clearAllRows() {
    if (this.tableConfig.paginatorMode === PaginatorMode.Client) {
      this.data = [];
      this.dataChange.emit(this.data);
      this.selectedRows = [];
      this.resetFilterDropdowns();
      this.dataTable.reset();
      this.colsFilterTable = {};

      for (let i = 0; i < this.cols.length; i++) {
        const col = this.cols[i];
        if (col.data && col.type && (col.type === FilterTypes.Dropdown || FilterTypes.Multiselect)) {
          col.data = [];
        }
      }
      if (this.hasCheckbox()) {
        this.onCheckboxHeader(false);
      }

      const tableStorage = sessionStorage.getItem(this.generateKey()) || '';
      if (tableStorage) {
        this.setDataTableToStorage();
      }
    }
  }

  isNgTemplate(obj: any): boolean {
    return obj instanceof TemplateRef;
  }

  getMessageSelectedRows() {
    let rs = '';
    if (this.isSelectAllRows && this.paginatorMode === PaginatorMode.Server) {
      rs = `<span class="row-number">${this.totalRecords}</span>`;
    } else {
      rs = `<span class="row-number">${this.selectedRows?.length}</span>`;
    }
    if (this.pCheckbox === true && this.isSelectAllRows) {
      rs = `${this.translateResults.ALL} ${rs}`;
    }
    return `${rs} ${this.messageSelect}`;
  }
}

