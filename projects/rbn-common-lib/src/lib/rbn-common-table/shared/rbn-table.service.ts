import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Icols } from '../../models/common-table';

@Injectable({
  providedIn: 'root'
})
export class RbnTableService {
  closeDialog: BehaviorSubject<Icols[] | any> = new BehaviorSubject(null);
  openAdvanced: BehaviorSubject<string> = new BehaviorSubject('');
  checkboxShowCol = new BehaviorSubject(null);
  checkboxAllCols: BehaviorSubject<boolean> = new BehaviorSubject(false);

  alwaysShowFilter = true;
  isReorderColsByStorage = false;

  trans: any = {};

  constructor(private translate: TranslateService) {
    this.translate.get('TABLE').subscribe(res => {
      this.trans = res;
    });
  }

  addAriaDescForSortHeaderField(sortField: any, sortOrder = 1, sort = false) {
    const ariaSort = sortField?.ariaSort;
    if (!ariaSort) {
      return;
    }
    if (ariaSort === 'none') {
      sortField.ariaDescription = sortOrder === 1 ? this.trans?.SORT_ASCENDING : this.trans?.SORT_DESCENDING;
    } else if (sort) {
      sortField.ariaDescription = '';
    }
  }
}
