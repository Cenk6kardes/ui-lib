import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Directive, Input, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Table, TableService } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';

import { KeyCode, KeyEvent } from '../../models/keyboard';
import { ClassAttributeObserver } from '../../shared/class-attribute-observer';
import { RbnTableService } from '../../rbn-common-table/shared/rbn-table.service';
import { WcagService } from '../../services/wcag.service';
import { RbnFocusDropdownDirective } from '../focus-dropdown/rbn-focus-dropdown.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-table',
  providers: [Dropdown]
})
export class RbnFocusTableDirective implements AfterViewInit, OnDestroy {
  @Input() caption = '';
  stopEscAccessibleViewChild = false;
  classObserver: ClassAttributeObserver;
  translateResults: any = {};
  filterTags = ['input', 'p-dropdown', 'p-multiselect'];
  paginatorSwapper: HTMLElement;
  rbnTableServerMode = false;

  constructor(
    private table: Table,
    private renderer: Renderer2,
    private liveAnnouncer: LiveAnnouncer,
    private translate: TranslateService,
    private tableService: TableService,
    private rbnTableService: RbnTableService,
    private rbnFocusDropdownDirective: RbnFocusDropdownDirective,
    private wcagService: WcagService
  ) {
    this.translate.get(['COMMON', 'TABLE']).subscribe(res => {
      this.translateResults = res || {};
    });
  }

  ngAfterViewInit(): void {
    this.handleTablePaginator();

    // sort header
    this.handleSortHeaderFields();
    this.table.onSort.subscribe(() => {
      this.handleSortHeaderFields(true);
    });
    this.table.tableService.columnsSource$.subscribe(() => {
      this.handleSortHeaderFields();
    });

    // just for p-table not inner rbn-table
    if (!this.table.el?.nativeElement?.closest('rbn-table')) {
      this.addTableCaption();
      this.handleFilterHeaderFields();
      this.table.tableService.valueSource$.subscribe(values => {
        if (Array.isArray(values) && values.length > 0) {
          this.handleSelection();
        }
      });
    }
  }

  handleTablePaginator(): void {
    if (this.table.paginator) {
      this.paginatorSwapper = this.table.el.nativeElement;
      this.handlePaginatorDropdownPerPage();
    } else {
      this.announceTableRecordsWithoutPaginator();
      // rbn-table server mode paginator (using the seperated p-paginator)
      if (this.table.el.nativeElement?.closest('rbn-table')) {
        this.paginatorSwapper = this.table.el.nativeElement?.parentElement?.querySelector('p-paginator');
        this.rbnTableServerMode = true;
        this.handlePaginatorDropdownPerPage();
      }
    }

    // Add role for pagiantion dropdown
    const paginatiorDropdownEle = this.paginatorSwapper?.querySelector('p-paginator p-dropdown.p-inputwrapper-filled');
    if (paginatiorDropdownEle && !paginatiorDropdownEle.getAttribute('role')) {
      paginatiorDropdownEle.setAttribute('role', 'combobox');
    }

    this.handleAnnouncePaginatorCurrent(500);

    // Event occur global search, filter
    this.tableService.totalRecordsSource$.subscribe((event: any) => {
      if (event) {
        this.handleAnnouncePaginatorCurrent();
        this.handleOnPaginatorRowsChange();
      } else if (this.table.totalRecords === 0) {
        this.liveAnnouncer.announce(this.translateResults.COMMON?.NO_RECORDS);
      }
    });

    // Event occur when select item of dropdown pagination option
    this.table.rowsChange.subscribe((event: number) => {
      if (event) {
        this.handleAnnouncePaginatorCurrent();
        this.handleOnPaginatorRowsChange();
      }
    });

    // Event occur when change page
    this.table.firstChange.subscribe((event: number) => {
      if (event) {
        this.handleAnnouncePaginatorCurrent();
      } else if (this.table.totalRecords === 0) {
        this.liveAnnouncer.announce(this.translateResults.COMMON?.NO_RECORDS);
      }
    });
  }

  handlePaginatorDropdownPerPage(): void {
    if (!this.paginatorSwapper) {
      return;
    }
    const dropdownPerPageOptionsEl = this.paginatorSwapper?.querySelector('p-paginator p-dropdown') as HTMLElement;
    if (dropdownPerPageOptionsEl) {
      const rppOptionsEl = dropdownPerPageOptionsEl?.querySelector('.p-paginator-rpp-options') as HTMLElement;
      if (rppOptionsEl) {
        this.classObserver = new ClassAttributeObserver(rppOptionsEl, 'p-dropdown-open', this.handleClassAdd, this.handleClassRemove);
        const input = rppOptionsEl?.querySelector('.p-hidden-accessible input');
        if (input) {
          this.renderer.listen(input, 'focus', () => {
            this.handleOnPaginatorRowsChange();
          });
        }
      }
      this.renderer.listen(dropdownPerPageOptionsEl, KeyEvent.keydown, (e) => {
        switch (e.code) {
          case KeyCode.Escape:
            {
              if (this.stopEscAccessibleViewChild) {
                e.stopPropagation();
                this.stopEscAccessibleViewChild = false;
              }
            }
            break;
          default:
            break;
        }
      });
    }
  }

  handleAnnouncePaginatorCurrent(timer = 0): void {
    if (this.table.totalRecords === 0) {
      this.liveAnnouncer.announce(this.translateResults.COMMON?.NO_RECORDS);
      return;
    }

    if (!this.rbnTableServerMode) {
      const total = this.table.totalRecords;
      const first = this.table.totalRecords > 0 ? this.table._first + 1 : 0;
      const last = this.table.rows ? Math.min(this.table._first + this.table.rows, this.table.totalRecords) : this.table.totalRecords;
      const strAnnounce = this.translateResults.COMMON?.SHOWING_RECORDS
        ?.replace('{0}', first + ` ${this.translateResults.COMMON.TO} ` + last)
        ?.replace('{1}', total);
      this.liveAnnouncer.announce(strAnnounce);
      return;
    }

    // using the [currentPageReportTemplate] text for rbn-table server mode paginator (using the seperated p-paginator)
    setTimeout(() => {
      const paginatorCurrentEle = this.paginatorSwapper?.querySelector('.p-paginator-current') as HTMLElement;
      if (paginatorCurrentEle && this.translateResults?.COMMON) {
        const arrPaginatorCurrentInnerText = paginatorCurrentEle.innerText?.split(` ${this.translateResults.COMMON.OF} `);
        if (arrPaginatorCurrentInnerText.length > 1) {
          const strAnnounce = this.translateResults.COMMON.SHOWING_RECORDS
            .replace('{0}', arrPaginatorCurrentInnerText[0].replace('-', this.translateResults.COMMON.TO))
            .replace('{1}', arrPaginatorCurrentInnerText[1]);
          this.liveAnnouncer.announce(strAnnounce);
        }
      }
    }, timer);
  }

  announceTableRecordsWithoutPaginator(): void {
    this.table.onFilter.subscribe((event) => {
      if (event) {
        let msg = '';
        const length = event.filteredValue?.length;
        if (length) {
          msg = this.wcagService.getShowingRecordsTraslate(length)?.replace('{0}', length);
        } else {
          msg = this.translateResults.COMMON?.NO_RECORDS;
        }
        if (msg) {
          this.liveAnnouncer.announce(msg);
        }
      }
    });
  }


  handleClassAdd = () => {
    this.stopEscAccessibleViewChild = true;
  };

  handleClassRemove = () => {
    setTimeout(() => {
      this.stopEscAccessibleViewChild = false;
    });
  };

  ngOnDestroy(): void {
    if (this.classObserver) {
      this.classObserver.disconnect();
    }
  }

  handleSortHeaderFields(sort = false) {
    setTimeout(() => {
      const sortFields = this.table.tableHeaderViewChild?.nativeElement?.querySelectorAll('tr .p-sortable-column') as HTMLElement[];
      sortFields?.forEach(field => {
        this.rbnTableService.addAriaDescForSortHeaderField(field, this.table.defaultSortOrder, sort);
      });
    }, 300);
  }

  handleFilterHeaderFields() {
    setTimeout(() => {
      // the first table <tr> should contain class `not-header-column` if it's not the table header
      const headerRows = this.table.tableHeaderViewChild?.nativeElement?.querySelectorAll('tr:not(.not-header-column)');
      // at least 2 <tr>: header vs filter
      if (headerRows?.length === 2) {
        const headerCols = headerRows[0].querySelectorAll('th');
        const filterRow = headerRows[1];
        if (headerCols && filterRow) {
          filterRow.role = 'none';
          const filterCols = filterRow.querySelectorAll('th');
          const filterTags = this.filterTags.join(', ');
          filterCols?.forEach((col, index: number) => {
            const field = col.querySelector(filterTags) as HTMLElement;
            if (field) {
              this.addAriaLabelForFilterField(field, headerCols[index]);
            }
          });
        }
      }
    });
  }

  addAriaLabelForFilterField(field: HTMLElement, headerCol: HTMLElement) {
    const label = headerCol?.innerText;
    const tagField = field?.tagName?.toLowerCase();
    switch (tagField) {
      case 'input':
      case 'p-dropdown':
        field.ariaLabel = label + this.translateResults.COMMON?.FILTER;
        break;
      case 'p-multiselect':
        const input = field.querySelector('input');
        if (input) {
          input.ariaLabel = label + this.translateResults.COMMON?.FILTER;
        }
        break;
      default:
        break;
    }
  }

  handleSelection() {
    setTimeout(() => {
      const checkboxAll = this.table.tableHeaderViewChild?.nativeElement?.querySelector('p-tableheadercheckbox') as HTMLElement;
      if (checkboxAll) {
        this.addAiaLabelSelection(checkboxAll, this.translateResults.TABLE.SELECT_ALL_ROWS);
      }
      const fields = this.table.containerViewChild?.nativeElement?.querySelectorAll('p-tablecheckbox, p-tableradiobutton') as HTMLElement[];
      fields?.forEach(field => {
        this.addAiaLabelSelection(field, this.translateResults.TABLE.SELECT_ROW);
      });
    });
  }

  addAiaLabelSelection(field: any, ariaLabel: string) {
    if (field?.parentElement) {
      field.parentElement.role = 'none';
    }
    const input = field?.querySelector('input');
    if (input) {
      input.ariaLabel = ariaLabel;
    }
  }

  addTableCaption() {
    const header = this.table.tableHeaderViewChild?.nativeElement;
    if (this.caption && header) {
      const caption = document.createElement('caption');
      caption.innerText = this.caption;
      caption.style.opacity = '0';
      caption.style.height = '0';
      caption.style.padding = '0';
      header.appendChild(caption);
    }
  }

  handleOnPaginatorRowsChange() {
    const selectedIndex = this.table.rowsPerPageOptions?.findIndex(item => item === this.table._rows);
    const allItemsSizeLength = this.table.rowsPerPageOptions?.length;
    const paginatorOptionEle = this.paginatorSwapper?.querySelector('.p-paginator-rpp-options');
    if (paginatorOptionEle) {
      this.rbnFocusDropdownDirective
        .handleOnChange(paginatorOptionEle, selectedIndex, allItemsSizeLength);
    }
  }
}

