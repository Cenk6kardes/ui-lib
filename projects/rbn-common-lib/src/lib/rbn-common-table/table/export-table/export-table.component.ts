import { Component, OnInit, Output, Input, EventEmitter, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import { Icols, IExportDataConfig, PaginatorMode, I3DotsButtonConfig, FieldName } from '../../../models/common-table';

@Component({
  selector: 'rbn-export-table',
  templateUrl: './export-table.component.html',
  styleUrls: ['./export-table.component.scss']
})
export class ExportTableComponent implements OnInit {

  @Output() closeDialog = new EventEmitter();
  @Output() exportDataModeServerEvent = new EventEmitter();

  @Input() tableData: any;
  @Input() currentTableData: any[];
  @Input() tableHeader: any;
  @Input() allTableHeader: any;
  @Input() fileType = 'csv';
  @Input() showExportColumns = false;
  @Input() paginatorMode: PaginatorMode;
  @Input() maxLimitRecordsExportServer: number;
  @Input() exportConfig: IExportDataConfig;
  @Input() filenameMaxLength = 128;
  @Input() filename = 'ExportRecords';
  @Input() buttonConfig: I3DotsButtonConfig = {};

  showDialog = false;
  invalidFilename = false;
  rowsToDownload = 10;
  exportMaxLimit = 10000;
  limitRecordsValidation = {
    max: 1,
    min: 1
  };
  rowsAvailableForDownload: number;
  currentRecords = 10;
  exportData = [];
  availableFileTypes = this.fileType;

  columnsOptions: any[] = [];
  columnsModel: string[] = [];

  availableFileTypesList = [];
  delimiterList = [
    { label: 'Commas (,)', value: ',' },
    { label: 'Semicolon (;)', value: ';' },
    { label: 'Colon (:)', value: ':' },
    { label: 'Pipes (|)', value: '|' }
  ];

  contentType = [
    { label: 'Header with Data', value: 'tableandheader' },
    { label: 'Header only', value: 'header' },
    { label: 'Data only', value: 'table' }
  ];

  columnOption = [
    {
      group: null,
      items: [{
        label: 'Current Columns', value: 'currentColumn'
      }]
    },
    {
      group: null,
      items: [{
        label: 'All Columns', value: 'allColumns'
      }]
    },
    {
      group: null,
      label: 'Table Layouts',
      value: 'Table Layouts',
      items: [
      ]
    }
  ];


  downloadType = 'tableandheader';
  delimiter = ',';
  elementFound = false;
  pagesCSV = [
    { label: 'Current Page', value: 'currentPage' },
    { label: 'All Page', value: 'allPages' }
  ];
  pagesoption = 'currentPage';
  noOfDwnldExceeds = false;
  allCols: [];
  cols: Icols[] = [];
  fieldNamesControl = [FieldName.Checkbox, FieldName.Action,
    FieldName.Expand, FieldName.RadioButton, FieldName.RowGroup, FieldName.Reorder];

  constructor(
    public translate: TranslateService,
    public elementRef: ElementRef,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.showDialog = true;
    this.checkFileTypes();
    const dt = (new Date() + '').split(' ');
    if (this.filename) {
      this.filename = this.filename.replace((/_?table$/), '');
      this.filename = this.filename + '_' + [dt[3], dt[1], dt[2]].join('-') + '_' + dt[4].toString().replace(/:/g, '-');
    }
    if (this.tableData !== null && this.tableData.length > 0) {
      this.getLimitRecords();
    }
    if (!this.tableData || (this.tableData && this.tableData.length === 0)) {
      this.contentType = [
        { label: 'Only Header', value: 'header' }
      ];
      this.downloadType = 'header';
    }
    if (this.tableHeader != null && this.tableHeader.length !== 0) {
      this.cols = JSON.parse(JSON.stringify(this.tableHeader));
      let indx = 0;
      let indxTR = -1;
      for (const tmpHdr of this.cols) {
        if (tmpHdr.field === 'action') {
          indxTR = indx;
        }
        indx++;
      }
      if (indxTR !== -1) {
        this.cols.splice(indxTR, 1);
      }

      if (this.showExportColumns) {
        this.columnsOptions = [];
        this.allTableHeader.forEach(column => {
          if (this.fieldNamesControl.includes(column.field)) {
            return;
          }
          this.columnsOptions.push({
            label: column.field,
            value: column.field
          });
        });
        this.allCols = JSON.parse(JSON.stringify(this.allTableHeader));
      }
    }
  }

  checkFileTypes() {
    if (this.buttonConfig.exportCSVByLib) {
      this.availableFileTypesList.push({ label: 'CSV', value: 'csv' });
    } else {
      this.fileType = 'pdf';
      this.availableFileTypes = this.fileType;
    }
    if (this.buttonConfig.exportPDFByLib) {
      this.availableFileTypesList.push({ label: 'PDF', value: 'pdf' });
    }
  }

  limitRecordVal(evnt) {
    this.rowsToDownload = evnt.target.value;
    if (this.rowsToDownload > this.rowsAvailableForDownload) {
      this.noOfDwnldExceeds = true;
    } else {
      this.noOfDwnldExceeds = false;
    }
  }

  async exportTableData() {
    const validatorInput = /^[a-zA-Z0-9_-]+$/.test(this.filename);
    if (!validatorInput) {
      this.invalidFilename = true;
      return;
    }
    const tableData = this.pagesoption === 'currentPage' ? this.currentTableData: this.tableData;
    if (this.fileType === 'csv') {
      if (this.downloadType === 'header') {
        this.saveHeaderAsCSV();
      } else {
        if (this.paginatorMode === PaginatorMode.Server) {
          this.exportDataModeServerEvent.emit(this.fileType);
        } else {
          this.saveToCSVByData(tableData);
        }
      }
    } else if (this.fileType === 'pdf') {
      if (this.paginatorMode === PaginatorMode.Server) {
        this.exportDataModeServerEvent.emit(this.fileType);
      } else {
        this.saveToPDFByData(tableData);
      }
    }
  }

  async saveHeaderAsCSV() {
    let selectedCol: any;
    if (this.cols != null) {
      selectedCol = this.cols;
    }
    let csvContent = '';
    let index = 0;

    if (selectedCol != null) {
      selectedCol.forEach(column => {
        csvContent = csvContent + '"' + column.header + '"';
        if (index < (selectedCol.length - 1)) {
          csvContent += this.delimiter;
        } else {
          csvContent += '\r\n';
        }
        index++;
      });
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const anchor = document.createElement('a');
    const url = (window.URL).createObjectURL(blob);
    anchor.download = this.filename + '.csv';
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    this.closeDialogs();
  }

  removeQuotesFromCSV(element) {
    if (element && isNaN(element) && typeof element === 'string') {
      element = element.replace(/^"|"$/g, '');
      element = element.replace(/(\r\n|\n|\r)/gm, ' ');
    } else if (typeof element === 'object') {
      element = this.getStringFromElement(element);
    }
    return element;
  }

  getStringFromElement(element) {
    let retString = '';
    if (Array.isArray(element)) {
      for (const obj1 of element) {
        if (typeof obj1 !== 'object') {
          if (retString.length === 0) {
            retString = this.removeQuotesFromCSV(obj1);
          } else {
            retString = retString + ', ' + this.removeQuotesFromCSV(obj1);
          }
        }
      }
    }
    return retString;
  }

  saveToCSVByData(tableData: any[]) {
    if (!tableData || (tableData && tableData.length === 0)) {
      return true;
    }
    if (tableData
      && (this.paginatorMode === PaginatorMode.Client)
      && (this.rowsToDownload > tableData.length)) {
      return true;
    }

    const exportData = tableData.slice(0, this.rowsToDownload);
    let csvContent = '';
    let index = 0;
    const headerData = this.getHeaderData().filter((n) => {
      const check = this.fieldNamesControl.includes(n.field);
      return !check;
    });
    const lenHeader = headerData.length;
    headerData.forEach(column => {
      if (column && column.exportCol === false) {
        index++;
        return;
      }
      if (column && (column.colsEnable || this.showExportColumns)) {
        if (this.downloadType === 'tableandheader') {
          csvContent = csvContent + '"' + column.header + '"';
        }
        if (index < (lenHeader - 1)) {
          if (this.downloadType === 'tableandheader') {
            csvContent += this.delimiter;
          }
        } else {
          if (this.downloadType === 'tableandheader') {
            csvContent += '\r\n';
          }
        }
        index++;
      }
    });

    for (const rows of exportData) {
      index = 0;
      for (const cols of headerData) {
        if (cols.colDisable || cols.exportCol === false) {
          continue;
        }
        let tmpData = '';
        if (typeof rows[cols.field] !== 'undefined') {
          tmpData = '"' + this.removeQuotesFromCSV(rows[cols.field]) + '"';
          csvContent += tmpData;
        }
        if (index < (lenHeader - 1)) {
          csvContent += this.delimiter;
        }
        index++;
      }
      csvContent += '\r\n';
    }

    // delimiter = ',' or ';' or ':' or '|'
    // add sep=${delimiter} on top csv to split data into columns by ${delimiter}
    const csvContentExport = 'sep=' + this.delimiter + '\r\n' + csvContent;
    const blob = new Blob([csvContentExport], { type: 'text/csv;charset=utf-8' });
    const anchor = document.createElement('a');
    const url = (window.URL).createObjectURL(blob);
    anchor.download = this.filename + '.csv';
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    this.closeDialogs();
  }

  limitValidation() {
    if (this.downloadType === 'header') {
      return false;
    }
    if (!this.tableData || (this.tableData && this.tableData.length === 0)) {
      return true;
    }
    this.exportMaxLimit = 10000;
    if (this.showExportColumns) {
      return this.columnsModel.length === 0;
    }
  }

  onSelectDropdownFileType(event) {
    if (event && event.value !== null) {
      this.fileType = event.value;
    }
  }

  exportPDFfilter(col) {
    return (col.colsEnable || this.showExportColumns) && !this.fieldNamesControl.includes(col.field);
  }

  saveToPDFByData(tableData: any[]) {
    const doc = new jsPDF('landscape') as any;
    const dataExport = this.formatDataExport(tableData);
    const columnsExport = this.getHeaderData().filter(header => this.exportPDFfilter(header)).map(col => col.header).filter(value => value);
    this.exportData = columnsExport;
    // format columns
    const columnStyles = {};
    for (let i = 0; i <= this.exportData.length; i++) {
      columnStyles[i] = { minCellWidth: 20 };
    }
    const showHeader = this.downloadType === 'tableandheader' || this.downloadType === 'header';
    const showBody = this.downloadType === 'tableandheader' || this.downloadType === 'table';
    doc.autoTable({
      columnStyles,
      head: showHeader ? [this.exportData] : [],
      body: showBody ? dataExport : []
    });
    doc.save(this.filename + '.pdf');
    this.closeDialogs();
  }

  formatDataExport(data: any[]): any {
    let newData = JSON.parse(JSON.stringify(data));
    if (newData) {
      this.exportData = newData.slice(0, this.rowsToDownload);
      newData = this.exportData.map((row: any) => {
        const columnsExport = this.getHeaderData().filter(header => this.exportPDFfilter(header));
        const exportField: Array<string> = [];
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

  closeDialogs = () => {
    this.showDialog = false;
    this.closeDialog.emit('exit');
  };

  onColumnChange() {
    this.allTableHeader = (this.allCols as any[]).filter(header => this.columnsModel.includes(header.field));
  }

  getHeaderData() {
    return this.showExportColumns ? this.allTableHeader : this.cols;
  }

  getLimitRecords() {
    switch (this.pagesoption) {
      case 'currentPage':
        {
          this.rowsAvailableForDownload = this.currentTableData?.length;
          this.rowsToDownload = this.currentTableData?.length;
          this.limitRecordsValidation.max = this.currentTableData?.length;
        }
        break;
      case 'allPages':
        {
          if (this.paginatorMode === PaginatorMode.Client) {
            this.rowsAvailableForDownload = this.tableData.length;
            this.rowsToDownload = this.tableData.length;
            this.limitRecordsValidation.max = this.tableData?.length;
          } else {
            this.rowsAvailableForDownload = this.maxLimitRecordsExportServer || this.tableData.length;
            this.rowsToDownload = this.maxLimitRecordsExportServer || this.tableData.length;
            this.limitRecordsValidation.max = this.maxLimitRecordsExportServer || this.tableData?.length;
          }
        }
        break;
      default:
        break;
    }
  }

  handleChangePageType() {
    this.getLimitRecords();
  }
}
