import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment, { unitOfTime } from 'moment';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';
import { MomentUnit, TimePickerComponent } from '../timepicker/timepicker.component';

@Component({
  selector: 'rbn-single-time-picker',
  templateUrl: '../timepicker/timepicker.component.html',
  styleUrls: ['../timepicker/timepicker.component.scss'],
  providers: [RbnFocusCalendarDirective]
})
export class SingleTimePickerComponent extends TimePickerComponent implements OnInit, OnChanges {

  oldSelectedDate = 0;

  constructor(public translate: TranslateService, public focusCalendar: RbnFocusCalendarDirective) {
    super(translate, focusCalendar);
    this.isSingleCalendar = true;
    this.startdateValue = moment().toDate();
    this.enddateValue = undefined;
  }

  initQuickButtons() {
    this.defaultQuickButtons = [
      {
        id: 1,
        text: this.translateResults.NEXT_15_MINUTE,
        time: 15,
        unit: MomentUnit.Minutes,
        isSelected: false
      },
      {
        id: 2,
        text: this.translateResults.NEXT_30_MINUTE,
        time: 30,
        unit: MomentUnit.Minutes,
        isSelected: false
      }
      ,
      {
        id: 3,
        text: this.translateResults.NEXT_HOUR,
        time: 1,
        unit: MomentUnit.Hours,
        isSelected: false
      },
      {
        id: 4,
        text: this.translateResults.NEXT_3_HOUR,
        time: 3,
        unit: MomentUnit.Hours,
        isSelected: false
      }
      ,
      {
        id: 5,
        text: this.translateResults.NEXT_DAY,
        time: 1,
        unit: MomentUnit.Days,
        isSelected: false
      },
      {
        id: 6,
        text: this.translateResults.NEXT_5_DAY,
        time: 5,
        unit: MomentUnit.Days,
        isSelected: false
      }
    ];
  }

  ngOnInit() {
    this.selectedDate = (this.singleCalendarConfig && this.singleCalendarConfig.selectedDate) ?
      moment(this.singleCalendarConfig.selectedDate).toDate() : undefined;
    this.startdateValue = this.minDate ? this.minDate : this.startdateValue;
    this.enddateValue = this.maxDate ? this.maxDate : this.enddateValue;
    if (this.newTimeValues && this.newTimeValues.length > 0) {
      if (this.newTimeValues[0] && !this.minDate) {
        this.startdateValue = moment(this.newTimeValues[0]).toDate();
      }
      if (this.newTimeValues[1] && !this.maxDate) {
        this.enddateValue = moment(this.newTimeValues[1]).toDate();
      }
    }
    this.setDisplayTime();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.singleCalendarConfig && !changes.singleCalendarConfig.firstChange) {
      this.label = this.singleCalendarConfig.label ? this.singleCalendarConfig.label : this.label;
      if (this.singleCalendarConfig.selectedDate) {
        this.selectedDate = moment(this.singleCalendarConfig.selectedDate).toDate();
        this.oldSelectedDate = this.selectedDate;
      } else {
        this.selectedDate = this.singleCalendarConfig.selectedDate;
      }
      this.setDisplayTime();
    }
    super.ngOnChanges(changes);
  }

  setDisplayTime() {
    this.displayTime = '';
    if (this.selectedDate) {
      this.displayTime = this.timeToReadableFormat(this.selectedDate);
    }
  }

  intervalData() {
    this.clickSubmitButton = true;
    this.dateChanged.emit({
      selectedDate: this.selectedDate,
      durationButtonClicked: this.durationButtonClicked
    });
    this.showDialog = false;
    this.durationButtonClicked = false;
    this.setDisplayTime();
  }

  resetButtonClick() {
    this.dateChanged.emit({
      selectedDate: undefined,
      durationButtonClicked: this.durationButtonClicked
    });
    this.selectedDate = this.defaultDateSingleCalendar ? this.defaultDateSingleCalendar : moment().toDate();
    this.oldSelectedDate = this.selectedDate.getTime();
    this.durationButtonClicked = false;
    this.setCurrentViewForCalendar();
    this.onFocusableCellCalendar();
    this.addAriaLabelForDatePickerOnReset();
  }

  buttonDuration(index: any) {
    let selectedDate = moment().toDate();
    this.selectedButtonIndex = index;
    const singleButton = this.quickButtons.find(item => item.id === index);
    if (singleButton) {
      const unit = <unitOfTime.DurationConstructor>singleButton.unit;
      selectedDate = moment(selectedDate).add(singleButton.time, unit).toDate();
    }
    this.durationButtonClicked = true;
    if (this.maxDate && selectedDate > this.maxDate) {
      this.showDialogError = true;
    } else {
      this.selectedDate = selectedDate;
      this.intervalData();
    }
  }

  onShowDialog() {
    if (!this.selectedDate) {
      if (this.showTime) {
        this.calendarElSingle.updateTime();
      } else {
        // click first day
        const firstDayclickAble =
          this.calendarElSingle.el.nativeElement.querySelector('table.p-datepicker-calendar td > span:not(.p-disabled)');
        if (firstDayclickAble) {
          firstDayclickAble.click();
        }
      }
    }
    this.showDialog = true;
    this.showDialogError = false;
    this.oldSelectedDate = this.selectedDate ? this.selectedDate.getTime() : undefined;
    this.selectedButtonIndex = -1;
    this.addAriaLabelForCalendarButton();
    this.addAriaLabelForDatePickerOnChange();
  }

  onHideDialog() {
    this.selectedButtonIndex = -1;
    if (!this.clickSubmitButton) {
      this.selectedDate = moment(this.oldSelectedDate).toDate();
    }
    this.clickSubmitButton = false;
    this.inputtimecalendar.nativeElement.focus();
    this.closeEvent.emit();
    this.setCurrentViewForCalendar();
  }
}
