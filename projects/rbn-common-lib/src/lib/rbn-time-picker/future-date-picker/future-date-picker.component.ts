import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { TimePickerComponent } from '../timepicker/timepicker.component';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';

@Component({
  selector: 'rbn-future-date-picker',
  templateUrl: '../timepicker/timepicker.component.html',
  styleUrls: ['../timepicker/timepicker.component.scss']
})
export class FutureDatePickerComponent extends TimePickerComponent implements OnInit {

  constructor(public translate: TranslateService, public focusCalendar: RbnFocusCalendarDirective) {
    super(translate, focusCalendar);
    this.useFuturePicker = true;
    this.minDate = moment().toDate();
    this.forceCheckRemoveMaxDate = true;
    this.removeMaxDate = true;
    this.isCustomTimePicker = true;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translate.get('CALENDAR').subscribe(res => {
      this.headerTimePicker = this.headerTimePicker ? this.headerTimePicker : res?.DATE_INTERVAL;
      if (!this.placeholder) {
        this.placeholder = res?.CHOOSE_AN_INTERVAL;
      }
    });
  }
}
