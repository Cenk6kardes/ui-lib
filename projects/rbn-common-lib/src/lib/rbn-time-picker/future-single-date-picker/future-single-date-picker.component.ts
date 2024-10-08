import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { SingleTimePickerComponent } from '../single-time-picker/single-time-picker.component';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';

@Component({
  selector: 'rbn-future-single-date-picker',
  templateUrl: '../timepicker/timepicker.component.html',
  styleUrls: ['../timepicker/timepicker.component.scss']
})
export class FutureSingleDatePickerComponent extends SingleTimePickerComponent implements OnInit, AfterViewInit {

  constructor(public translate: TranslateService, public focusCalendar: RbnFocusCalendarDirective) {
    super(translate, focusCalendar);
    this.useFuturePicker = true;
    this.startdateValue = moment().toDate();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translate.get('CALENDAR').subscribe(res => {
      this.headerTimePicker = this.headerTimePicker ? this.headerTimePicker : res?.DATE;
      if (!this.placeholder) {
        this.placeholder = res?.CHOOSE_DATE;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.showTime) {
      const timePicker = this.calendarElSingle.el?.nativeElement.querySelector('.p-timepicker');
      const inputTextTime = this.customTimeSingle?.nativeElement;
      timePicker.appendChild(inputTextTime);
    }
  }

  resetButtonClick() {
    super.resetButtonClick();
    this.startdateValue = moment().toDate();
  }
}
