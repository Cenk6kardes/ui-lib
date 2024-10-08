import { NgTemplateOutlet } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Tag } from './sidebar';

export enum FilterTypes {
  Dropdown = 1,
  InputText = 2,
  Range = 3,
  Multiselect = 4,
  Slider = 5,
  Calendar = 6,
  InputSwitch = 7,
  Icon = 8,
  DateRange = 9
}

export class ItemDropdown {
  constructor(public label: string = '', public value: string = '') { }
}

export enum FieldName {
  ID = 'id',
  TenantName = 'tenantName',
  Status = 'status',
  Name = 'name',
  Type = 'type',
  User = 'user',
  Created = 'created',
  Version = 'version',
  Action = 'action',
  Expand = 'expand',
  Checkbox = 'checkbox',
  Severity = 'severity',
  Reorder = 'reorder',
  RowGroup = 'rowGroup',
  RadioButton = 'radioButton',

  Info = 'INFO',
  Warning = 'WARNING',
  Error = 'ERROR'
}

export interface Car {
  vin: string;
  year: string;
  brand: string;
  color: string;
}

export enum RbnCommonTableTheme {
  DEFAULT = 'default',
  AS_PORTAL = 'as-portal'
}

export interface ItopButton {
  label?: string;
  icon?: string;
  iconPos?: string;
  onClick?: any;
  disabled?: boolean;
  title?: string;
  id?: string;
}

export interface ItableOptions {
  paginator?: boolean; // set paginator mode: client or server
  caption?: boolean;
  formatDate?: string; // set format date type
  selectionMode?: string; // set selection mode of checkbox
  dataKey?: string; // set dataKey for table
  hideTableButtons?: boolean; // hide top right button of table
  hideRefreshButton?: boolean;
  panelStyleClass?: string;
  actionColStyle?: string;
  tableActionsTitlecaseNo?: boolean;
  usingTriStateCheckbox?: boolean; // using TriStateCheckbox
  selectionFilterDropdown?: boolean; // set filter for dropdown in table when usingDropdown
  hideCheckboxAll?: boolean; // hide checkbox select all row
  hideColumnClear?: boolean; // hide clean button of the table when clicked filter button
  hideColumnInLib?: boolean; // hiding columns feature of the Advanced Option
  rowExpandMode?: string; // expandMode of table with 2 values 'single' and 'multiple'
  show3DotsButton?: boolean; // showing the 3Dots button in table component
  btn3DotsConfig?: I3DotsButtonConfig; // config for 3Dots button
  showClearAllRowsButton?: boolean; // showing the clear all rows button in table component,
  disabledRefreshButton?: boolean;
  /**
   * Duplicate this attribute from IColOptions for correcting while using and to avoid impact on existing applications
   * If true, allow dropdown filter on a cell of table
   */
  isCellSearchDropdown?: boolean;
}

export interface I3DotsButtonConfig {
  /**
   * Should set true as default value
   * Allow display Reset Table Layout option Sub Action Items by our library
   * Use function to reset table layout by our library
   */
  resetTableLayoutByLib?: boolean;
  /**
   * Display Export Table (.csv) option on Sub Action Items by our library
   * Use function to export CSV by our library
   */
  exportCSVByLib?: boolean; // set true if want to display and use function to export CSV by our library
  /**
   * Display Export Table (.pdf) option on Sub Action Items by our library
   * Use function to export PDF by our library
   */
  exportPDFByLib?: boolean;
  /**
   * Any option that you want to display on Sub Action Items
   */
  subActionItems?: MenuItem[];
}

export interface IheaderButton {
  label?: string;
  icon?: string;
  disabled?: boolean;
  iconPos?: string;
  onClick?: any;
  title?: string;
  id?: string;
  isDisplay?: boolean;
}

export interface IexpandMessage {
  actionMessagePreHtml: string;
}


export interface ExpandCol {
  header: string;
  field: string;
  isHtml: boolean;
}

export interface ExpandColMainHeader {
  data: any[];
  field: string;
  header: string;
}

export interface IexpandData {
  cols: ExpandCol[];
  tableId: string;
  colMainHeader?: ExpandColMainHeader[];
  fieldDisplayValue: string;
}

export interface IColOptions {
  [key: string]: any;
  useDeleteIcon?: boolean;
  disabled?: boolean;
  model?: any;
  template?: any;
  mainheaderGeneral?: any;
  usingInputSwitch?: boolean;
  activeSwitchString?: string;
  inActiveSwitchString?: string;
  usingLink?: boolean;
  hideText?: boolean;
  isHtml?: boolean;
  isNotFilterStorageDropdown?: boolean;
  usingInputText?: boolean;
  usingInputNumber?: boolean;
  usingElipsis?: boolean;
  isLinkColor?: boolean;
  numberOfDisplay?: number;
  removeMaxDate?: boolean;
  isCellSearchDropdown?: boolean;
  hiddenQuickSelectTimePicker?: boolean; // hidden Quick Select on time picker
}


export interface Icols {
  header: string;
  field: string;
  data?: any[];
  canExpand?: boolean;
  sort?: boolean;
  type?: number;
  matchType?: string;
  options?: IColOptions;
  mainheader?: boolean;
  colsEnable?: boolean;
  colDisable?: boolean;
  colWidth?: number;
  autoSetWidth?: boolean;
  startDate?: string;
  endDate?: string;
  onClickPostHTML?: any;
  mesExpand?: boolean;
  useOptionLabel?: string;
  allowHide?: boolean;
  loadLocalComponent?: any;
  manualColWidth?: any; // Only applicable when "useManualColWidth" is true in ITableConfig
  manualMinColWidth?: any; // Only applicable when "useManualColWidth" is true in ITableConfig
  // Only applicable when upgradeCol is true in case a new  column is added to the table automatically after calling interval time
  upgradeCol?: boolean;
  disableFilterCol?: boolean;
  referenceCols?: string[];
  filterMultiselectComponent?: any;
  frozen?: boolean;
}

export interface IdefaultSortSingle {
  field: string;
  sortOrder: 'ASC' | 'DES';
}

export interface ITableActions {
  className?: any;
  preHtml?: any;
  title?: string;
  id?: string;
  label: string;
}


export interface ITableData {
  [key: string]: any;
  children?: any[];
  disableSelect?: boolean;
  className?: any;
  actions?: any[];
  ngModel?: any;
}

export interface ITableConfig {
  header?: IPageHeader; // add header data to rbn-page-header
  showCloseTableButton?: boolean;
  topButton?: IheaderButton;
  tableOptions?: ItableOptions; // add option to table
  selectedRows?: any; // selected row in table
  tableName: string; // must name unique, this name is used to store the config of show/hide cols
  tableCaption?: string; // descriptive caption to the table
  paginatorMode: string; // paginator mode service or client
  numberRowPerPage?: number; // number row display in per page table
  rowsPerPageOptions?: any[]; // select number row to display per page ex:[5,10,15]
  totalRecords?: number; // display total records if PaginatorMode.Server
  maxLimitRecordsExportServer?: number; // total records allow export if PaginatorMode.Server
  isSupportGrouping?: boolean; // show expand data
  isCustomSort?: boolean; // is using custom sort
  isScrollable?: boolean; // is allow table scroll
  scrollX?: boolean; // check condition to add scroll-x class from css
  tableActions?: ITableActions[];
  showTableActionDropdown?: boolean;
  isUsingAppendTo?: boolean; // is using append to element
  selectedTableAction?: string;
  disabledTableActions?: boolean;
  headerButton?: IheaderButton;
  searchPlaceholderText?: string;
  columnHidingMode?: ColumnHidingMode; // choose display mode of rbn-column-hiding
  dropdownTablePlaceholderText?: string;
  showTemplateSummary?: boolean;
  keepFilter?: boolean;
  enableSearchGlobal?: boolean; // is display rbn-search-global
  enableFilter?: boolean; // is display filter button
  loading?: boolean; // is show rbn-dialog-loader
  hideDropdownOnScroll?: boolean;
  translateResults?: any; // input translate data
  actionColumnConfig?: IActionColumnConfig; // add action for action-button
  extensibleHeaderTemplate?: NgTemplateOutlet; // add tempalte to top-left table
  extensibleTemplateTableChildren?: NgTemplateOutlet; // add tempalte to expanded row
  extensibleHeaderData?: any; // add data to extensibleHeaderTemplate
  extensibleHeaderService?: any; // add service for extensibleHeaderTemplate
  isResizableColumns?: boolean; // allow resizing cols
  actionDisableFields?: any;
  expandRows?: any; // show expand icon all row
  hideLastNullColumn?: boolean;
  isTableChildren?: boolean; // hide the Advanced option of the child table
  allowSelectAllRows?: boolean; // set default true for Client mode and false for Server mode
  expandDataMode?: string; // choose ExpandDataMode mode client or server
  expandDisplayType?: string; // declare type expandData to display expand-icon or emit rowdata
  headerOL?: any; // display cols header description
  convertActions?: boolean; // get action of actionColumnConfig
  useScrollHeight?: string; // set data for setting attribute `scrollHeight` on PrimeNG table
  isShowContextMenu?: boolean;
  autoLayout?: boolean;
  useManualColWidth?: boolean; // Disable "autoSetWidth" across all columns and use "manualColWidth" and "manualMinColWidth" from Icols
  enableTwoColHeader?: boolean; // True to enable 2 column table header. Use "<br>" to seperate into rows(e.g. "Collection<br>Frequency")
  filterIdFromHeader?: boolean; // create Id for filter from header
  // If ColumnHidingSimple menu contains more than colsAutoShowComplex columns, open Advanced Options (Dialog box with pick-list)
  colsAutoShowComplex?: number;
  overlayAppendElement?: ElementRef; // element for overlay append.
  colEllipsisStatus?: string; // Show or hide ellipsis for text
  headerColEllipsisStatus?: string // Show or hide ellipsis for header columns text
  keepSelectedRows?: boolean // keep selected rows for for Server mode
  selectedRowKey?: string // using key for row data to keep selected rows
  exportDataConfig?: IExportDataConfig // config export data table
  allowFrozenColumn?: boolean // allow using frozen columm
  autoLoadingOnChangePage?: boolean // auto loading on page change for Server mode
  setEllipsisElStyleOnColResize?: boolean // Set ellipsis element style on column resizing instead of binding from ngStyle.
  emptyMessageContent?: string // message to display in body table when the table is no value to display.
  isReorderColsByStorage?: boolean // load reorder columns by storage to table.
}

export interface IActionColumnConfig {
  actions: IActionColumn[];
  quantityDisplayed?: number; // Maximum actions will be displayed on Action column
}

export interface IActionColumn {
  icon?: string;
  outputParam?: any;
  label?: string;
  tooltip?: string;
  onClick: any;
  command?: any;
  disableAction?: IActionDisableAction;
  disabled?: boolean;
  hideAction?: IActionHideAction;
}

export interface IActionDisableAction {
  field: string;
  value: any;
}

export interface IActionHideAction {
  field: string;
  value: any;
}


export interface IFilterServerDataEmit {
  filter?: IFilterServerData;
  reset?: boolean;
  typeFilter?: IFilterServerData;
}

export interface IFilterServerData {
  [key: string]: any;
}

export interface ISimpleDialogConfig {
  header: string;
  displayDialog: boolean;
  isUsingAppendTo?: boolean;
  cols: Icols[];
  checkBoxAll: boolean;
  modelName: string;
  showAdvancedOption: boolean;
  pickListConfig?: IPickListConfig;
  closeButtonLabel?: string;
  tableActive?: string;
}

export interface IPickListConfig {
  targetHeader: string;
  sourceHeader: string;
}

export interface IComplexDialogConfig {
  header?: string;
  displayDialog: boolean;
  sourceHeader?: string;
  targetHeader?: string;
  isUsingAppendTo?: boolean;
  possibleCols?: Icols[];
  visibleCols?: Icols[];
  sourceModel?: string;
  targetModel?: string;
  isFromSimple?: boolean;
  tableActive?: string;
}

export interface IHiddingColumnComplexEmit {
  possibleCols: Icols[];
  visibleCols: Icols[];
}

export interface IStorageData {
  colsFilter: object;
  typeColsFilter: Array<{colName: string, type: number}>;
  globalFilter: string;
  colsEnable: string[];
  colsDisable: string[];
  showFilterRow: boolean;
  colsSort?: {
    sortField: string,
    sortOrder: number
  };
  colsFrozen?: string[];
}

export enum PaginatorMode {
  Server = 'server',
  Client = 'client'
}

export enum ColumnHidingMode {
  None = 'none',
  Simple = 'simple',
  Complex = 'complex'
}

export interface IOverlayButton {
  menuItem?: MenuItem[];
  isDisplay?: boolean;
}

export interface IHeaderDropdown {
  content?: ItemDropdown[];
  isDisplay?: boolean;
  optionLabel?: string;
  optionValue?: string;
  onChange?(event: any): void;
}

export interface IPageHeader {
  title?: string;
  description?: string;
  breadcrumb?: MenuItem[];
  topButton?: IheaderButton | IheaderButton[];
  overlayButton?: IOverlayButton;
  topDropdown?: IHeaderDropdown;
  tag?: Tag;
}

export interface IExportDataConfig {
  appendTo?: any;
  draggable?: boolean,
  resizable?: boolean
}

export interface ISearchGlobal {
  tableName?: string;
  searchData?: string;
  searchPlaceholderText?: string;
}

export enum ExpandDataMode {
  Client = 'client',
  Server = 'server'
}

export enum ExpandDisplayType {
  TabView = 'tabView',
  Table = 'table'
}

export enum rowExpandMode {
  Single = 'single',
  Multiple = 'multiple'
}

export enum StatusSelectedRowsTableModeServer {
  OnePage = 'ONE_PAGE',
  AllPage = 'ALL_PAGE',
  NoSelected = 'NO_SELECTED'
}

export enum ColEllipsisStatus {
  Show = 'show',
  Hidden = 'hidden'
}
