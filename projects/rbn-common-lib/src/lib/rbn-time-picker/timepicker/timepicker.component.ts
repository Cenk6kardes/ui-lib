import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnInit, ViewChild, ElementRef,
  AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { unitOfTime } from 'moment';
import moment from 'moment';
import { Calendar } from 'primeng/calendar';
import { RbnFocusCalendarDirective } from '../../directives/rbn-focus-calendar/rbn-focus-calendar.directive';

export interface QuickButton {
  id: number;
  text: string;
  time: number;
  unit: MomentUnit;
  isSelected: boolean;
}

export enum MomentUnit {
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days'
}

export interface SingleCalendarConfig {
  selectedDate: Date;
  label?: string;
}

@Component({
  selector: 'rbn-time-picker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [RbnFocusCalendarDirective]
})

export class TimePickerComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() removeMaxDate: boolean;
  @Input() isSetMaxDateFrom = true;
  @Input() appendToTemplate;
  @Input() newTimeValues: any = [];
  @Input() quickButtons: QuickButton[];
  @Input() showSeconds = true;
  @Input() showTime = true;
  @Input() timeOnly = false;
  @Input() stepMinute = 1;
  @Input() singleCalendarConfig: SingleCalendarConfig;
  @Input() isHideResetButton = false;
  @Input() isCustomTimePicker = false;
  @Input() disabledTimePicker = false;
  @Input() showOnlyCalendar = false;
  @Input() hiddenQuickSelect = false;
  @Input() timePickerName = '';
  @Input() placeholder = '';
  @Input() headerPanel = '';
  @Input() inputEditable = false;
  @Input() timezone: string;
  @Input() dateFormat = 'MM/DD/YYYY';
  @Input() hourFormat = '24';
  @Input() quickAsIs?= false;
  @Input() isAutoZIndex = true;
  @Input() isUTCTime = false;
  @Input() forceCheckRemoveMaxDate = false;
  @Input() minDate: Date = null;
  @Input() maxDate: Date = null;
  @Input() ariaLabelInput = '';
  @Input() headerTimePicker = '';
  @Input() defaultDateSingleCalendar: Date = null;
  @Input() contentStyleClassDialog = '';

  @Output() validationEvent = new EventEmitter();
  @Output() exceedTimeZoneEvent = new EventEmitter();
  @Output() informParentQuickPick = new EventEmitter();
  @Output() dateChanged = new EventEmitter();
  @Output() closeEvent = new EventEmitter();

  @ViewChild('calendarElFrom', { static: false }) calendarElFrom!: Calendar;
  @ViewChild('calendarElTo', { static: false }) calendarElTo!: Calendar;
  @ViewChild('calendarElSingle', { static: false }) calendarElSingle!: Calendar;
  @ViewChild('rbninputtimecalendar', { read: ElementRef }) inputtimecalendar: ElementRef;
  @ViewChild('customTimeSingle', { read: ElementRef }) customTimeSingle!: ElementRef;
  timeInputValid = false;
  clickSubmitButton = false;
  durationButtonClicked = false;
  showDialog = false;
  isSingleCalendar = false;
  showInputError = false;
  errMessage = false;
  showDialogError = false;
  useFuturePicker = false;
  label: string;
  displayTime = '';
  filledClass = '';
  errMsg = '';
  startdateValue: Date | undefined;
  enddateValue: Date | undefined;
  realStartdateValue: Date | undefined | any;
  realEnddateValue: Date | undefined | any;
  maxdateValue: Date;
  selectedButtonIndex = -1;
  translateResults: any;
  minDateValue: Date = new Date('2000/01/01');
  selectedDate: any;
  defaultQuickButtons: QuickButton[];
  oldStDate: Date | undefined | any;
  oldEnDate: Date | undefined | any;
  timeInputConfig = {
    errorMessage: '',
    isInvalidTime: false,
    timeInputValue: ''
  };

  constructor(
    public translate: TranslateService,
    public focusCalendar: RbnFocusCalendarDirective
  ) {
    this.maxdateValue = this.maxDate ? this.maxDate : moment().toDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.defaultQuickButtons) {
      this.translate.get('CALENDAR').subscribe(res => {
        this.translateResults = res || {};
        this.initQuickButtons();
        this.label = (this.singleCalendarConfig && this.singleCalendarConfig.label) ?
          this.singleCalendarConfig.label : this.translateResults.TO;
        if (!this.quickButtons && this.defaultQuickButtons) {
          this.quickButtons = this.defaultQuickButtons;
          if (this.quickAsIs) {
            this.buttonDuration(4);
          }
        }
      });
    }
    if (changes.newTimeValues && !changes.newTimeValues.firstChange) {
      const newTimeValues = changes.newTimeValues.currentValue;
      if (!newTimeValues && !this.showDialog) {
        this.realStartdateValue = undefined;
        this.realEnddateValue = undefined;
        this.setDisplayTime();
      }
      if (newTimeValues && newTimeValues.length > 0 && !this.showDialog) {
        this.realStartdateValue = new Date(newTimeValues[0]);
        this.realEnddateValue = new Date(newTimeValues[1]);
        if ((newTimeValues[0].toString().endsWith('UTC') && newTimeValues[1].toString().endsWith('UTC')) || this.isUTCTime) {
          this.realStartdateValue = this.convertLocalTimeToUTC(new Date(this.realStartdateValue));
          this.realEnddateValue = this.convertLocalTimeToUTC(new Date(this.realEnddateValue));
        }
        if (this.timezone) {
          this.startdateValue = this.newDateUTC(newTimeValues[0]);
          this.enddateValue = this.newDateUTC(newTimeValues[1]);
        }
        this.filledClass = ' rbn-filled';
        if (!this.quickAsIs) {
          this.setDisplayTime();
        }
      } else {
        this.filledClass = '';
      }
    }
    if (changes.dateFormat) {
      if (this.dateFormat === '') {
        this.dateFormat = 'MM/DD/YYYY';
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.calendarElSingle) {
      this.calendarElSingle.focusTrap = false;
      return;
    }
    this.calendarElFrom.focusTrap = false;
    this.calendarElTo.focusTrap = false;
  }

  newDateUTC(dateTime?: any) {
    if (!dateTime) {
      dateTime = moment().toDate();
    }
    return new Date(moment(dateTime).utcOffset(this.timezone).format(`${this.dateFormat} HH:mm:ss`));
  }

  setMaxDateFrom() {
    if (this.isSetMaxDateFrom) {
      return this.enddateValue;
    }
    return this.maxdateValue;
  }

  isDisabled(startdateValue, enddateValue) {
    if (enddateValue && (startdateValue > enddateValue)) {
      return true;
    }
    return false;
  }

  initQuickButtons() {
    this.defaultQuickButtons = [
      {
        id: 1,
        text: this.translateResults.LAST_MINUTE,
        time: 1,
        unit: MomentUnit.Minutes,
        isSelected: false
      },
      {
        id: 2,
        text: this.translateResults.LAST_5_MINUTE,
        time: 5,
        unit: MomentUnit.Minutes,
        isSelected: false
      },
      {
        id: 3,
        text: this.translateResults.LAST_15_MINUTE,
        time: 15,
        unit: MomentUnit.Minutes,
        isSelected: false
      }
      ,
      {
        id: 4,
        text: this.translateResults.LAST_HOUR,
        time: 1,
        unit: MomentUnit.Hours,
        isSelected: false
      },
      {
        id: 5,
        text: this.translateResults.LAST_3_HOUR,
        time: 3,
        unit: MomentUnit.Hours,
        isSelected: false
      },
      {
        id: 6,
        text: this.translateResults.LAST_5_HOUR,
        time: 5,
        unit: MomentUnit.Hours,
        isSelected: false
      }
      ,
      {
        id: 7,
        text: this.translateResults.LAST_DAY,
        time: 1,
        unit: MomentUnit.Days,
        isSelected: false
      },
      {
        id: 8,
        text: this.translateResults.LAST_2_DAY,
        time: 2,
        unit: MomentUnit.Days,
        isSelected: false
      },
      {
        id: 9,
        text: this.translateResults.LAST_5_DAY,
        time: 5,
        unit: MomentUnit.Days,
        isSelected: false
      }
    ];
  }

  ngOnInit() {
    if (!this.isCustomTimePicker || this.forceCheckRemoveMaxDate) {
      this.maxdateValue = this.removeMaxDate ? null : this.maxDate ? this.maxDate : moment().toDate();
    }
    if (this.timezone) {
      this.maxdateValue = this.maxDate ? this.newDateUTC(this.maxDate) : this.newDateUTC();
    }
    if (this.newTimeValues && this.newTimeValues.length > 0) {
      const startDate = this.minDate && this.minDate > moment(this.newTimeValues[0]).toDate() ? this.minDate : this.newTimeValues[0];
      const endDate = this.maxDate && this.maxDate < moment(this.newTimeValues[1]).toDate() ? this.maxDate : this.newTimeValues[1];
      this.startdateValue = moment(startDate).toDate();
      this.enddateValue = moment(endDate).toDate();

      if (this.timezone) {
        this.startdateValue = this.newDateUTC(startDate);
        this.enddateValue = this.newDateUTC(endDate);
      }
      this.realStartdateValue = moment(this.startdateValue).toDate();
      this.realEnddateValue = moment(this.enddateValue).toDate();

      if (!this.quickAsIs) {
        this.setDisplayTime();
      }
      this.filledClass = ' rbn-filled';
    }
    this.minDate = this.minDate && this.timezone ? this.newDateUTC(this.minDate) : this.minDate;
    this.maxDate = this.maxDate && this.timezone ? this.newDateUTC(this.maxDate) : this.maxDate;
  }

  convertLocalTimeToUTC(date) {
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
  }

  setDisplayTime(isQuick?: boolean, buttonId?: number) {
    if (isQuick && this.quickAsIs) {
      const singleButton = this.quickButtons.find(item => item.id === buttonId);
      this.displayTime = singleButton.text;
      this.errMsg = '';

      this.informParentQuickPick.emit({
        quickPick: true,
        value: singleButton.time,
        unit: singleButton.unit
      });
    } else if (this.quickAsIs) {
      const startdateValueStr = this.timeToReadableFormat(this.startdateValue);
      const enddateValueStr = this.timeToReadableFormat(this.enddateValue);
      this.displayTime = startdateValueStr + ' to ' + enddateValueStr;
    } else {
      const startdateValueStr = this.timeToReadableFormat(this.realStartdateValue);
      const enddateValueStr = this.timeToReadableFormat(this.realEnddateValue);
      this.displayTime = '';
      if (this.realStartdateValue && this.realEnddateValue) {
        this.displayTime = startdateValueStr + ' ' +
          (this.translateResults && this.translateResults.TO || '').toLowerCase() + ' ' + enddateValueStr;
        this.informParentQuickPick.emit({
          quickPick: false,
          value: undefined,
          unit: undefined
        });
      }
      this.oldStDate = this.realStartdateValue;
      this.oldEnDate = this.realEnddateValue;
    }
    this.errMsg = '';
  }

  intervalData(isQuick?: boolean, index?: number) {
    this.clickSubmitButton = true;
    this.realStartdateValue = moment(this.startdateValue).toDate();
    this.realEnddateValue = moment(this.enddateValue).toDate();
    if (!isQuick) {
      this.checkTimeCalendarsAreEqual();
    }
    if (this.isUTCTime) {
      this.realStartdateValue = moment(this.realStartdateValue).format(`${this.dateFormat} HH:mm:ss`) + ' UTC';
      this.realEnddateValue = moment(this.realEnddateValue).format(`${this.dateFormat} HH:mm:ss`) + ' UTC';
    }
    if (this.timezone) {
      this.dateChanged.emit({
        startdateValue: moment(this.realStartdateValue).format(`${this.dateFormat} HH:mm:ss`),
        enddateValue: moment(this.realEnddateValue).format(`${this.dateFormat} HH:mm:ss`),
        durationButtonClicked: this.durationButtonClicked,
        timezone: this.timezone
      });
    } else {
      this.dateChanged.emit({
        startdateValue: this.realStartdateValue,
        enddateValue: this.realEnddateValue,
        durationButtonClicked: this.durationButtonClicked
      });
    }
    this.showDialog = false;
    this.durationButtonClicked = false;
    this.setDisplayTime(isQuick, index);
  }

  submitButtonClick() {
    this.selectedButtonIndex = -1;
    this.intervalData(false);
    this.timeInputConfig.timeInputValue = '';
    this.timeInputConfig.isInvalidTime = false;
    this.timeInputConfig.errorMessage = '';
  }

  cancelButtonClick() {
    this.showInputError = false;
    this.showDialog = false;
    this.durationButtonClicked = false;
    this.timeInputConfig.timeInputValue = '';
    this.timeInputConfig.isInvalidTime = false;
    this.timeInputConfig.errorMessage = '';
    this.closeEvent.emit();
  }

  selectFromDate() {
    if (this.timezone) {
      if (!this.maxDate && this.startdateValue > this.newDateUTC()) {
        this.startdateValue = this.newDateUTC();
      } else if (this.startdateValue > this.enddateValue) {
        this.startdateValue = this.enddateValue;
      }
    } else {
      if (!this.maxDate && this.startdateValue > moment().toDate()) {
        this.startdateValue = moment().toDate();
      } else if (this.startdateValue > this.enddateValue) {
        this.startdateValue = moment(this.enddateValue.getTime()).toDate();
      }
    }
  }

  selectToDate() {
    if (this.timezone) {
      if (!this.maxDate && this.enddateValue > this.newDateUTC()) {
        this.enddateValue = this.newDateUTC();
      }
    } else {
      if (!this.maxDate && this.enddateValue > moment().toDate()) {
        this.enddateValue = moment().toDate();
      }
    }
    this.errMessage = false;
    this.errMsg = '';
  }

  resetButtonClick() {
    this.dateChanged.emit({
      startdateValue: undefined,
      enddateValue: undefined,
      durationButtonClicked: this.durationButtonClicked
    });
    this.realStartdateValue = undefined;
    this.realEnddateValue = undefined;
    if (this.isUTCTime) {
      this.startdateValue = this.enddateValue = this.convertLocalTimeToUTC(moment().toDate());
    } else {
      this.startdateValue = moment().toDate();
      this.enddateValue = moment().toDate();
    }
    if (this.timezone) {
      this.startdateValue = this.newDateUTC();
      this.enddateValue = this.newDateUTC();
    }
    this.setDisplayTime();
    this.durationButtonClicked = false;
    this.setCurrentViewForCalendar();
    this.onFocusableCellCalendar();
    this.addAriaLabelForDatePickerOnReset();
  }

  buttonDuration(index: any) {
    let enddate;
    let startdate;
    if (this.isUTCTime) {
      startdate = this.startdateValue;
      enddate = this.enddateValue;
    } else {
      enddate = moment().toDate();
      startdate = moment().toDate();
    }
    if (this.timezone) {
      enddate = this.newDateUTC();
      startdate = this.newDateUTC();
    }
    this.selectedButtonIndex = index;
    const singleButton = this.quickButtons.find(item => item.id === index);
    if (singleButton) {
      const unit = <unitOfTime.DurationConstructor>singleButton.unit;
      startdate = moment(enddate).subtract(singleButton.time, unit).toDate();
    }
    this.durationButtonClicked = true;
    if (this.minDate && startdate < this.minDate) {
      this.showInputError = true;
      this.showDialogError = true;
    } else {
      this.showDialogError = false;
      this.showInputError = false;
      this.startdateValue = startdate;
      this.enddateValue = enddate;
    }
    this.intervalData(true, index);
    this.errMessage = false;
    this.errMsg = '';
  }

  timeToReadableFormat(time: Date | undefined) {
    if (!time) {
      return this.translateResults ? this.translateResults.CHOOSE_AN_INTERVAL : '';
    }
    const formatTimeTemp = this.showSeconds ? 'HH:mm:ss': 'HH:mm';
    if (this.timeOnly) {
      if (this.hourFormat === '12' && !this.showSeconds) {
        return moment(time).format('LT'); // e.g. 1:00 PM
      }
      return moment(time).format(formatTimeTemp);
    }
    if (!this.showTime) {
      return moment(time).format(this.dateFormat);
    } else {
      return moment(time).format(`${this.dateFormat} ${formatTimeTemp}`);
    }
  }

  onShowDialog() {
    this.showDialog = true;
    this.showDialogError = false;
    this.onPreventFocusCalendar();
    this.addAriaLabelForCalendarButton();
    this.addAriaLabelForDatePickerOnChange();
    this.addAriaLabelForDatePickerOnSelect();
    this.selectedButtonIndex = -1;
    if (this.isUTCTime) {
      this.realStartdateValue = this.oldStDate;
      this.realEnddateValue = this.oldEnDate;
      this.startdateValue = this.realStartdateValue ? moment(this.realStartdateValue).toDate()
        : this.convertLocalTimeToUTC(moment().toDate());
      this.enddateValue = this.realEnddateValue ? moment(this.realEnddateValue).toDate()
        : this.convertLocalTimeToUTC(moment().toDate());
    } else {
      this.startdateValue = moment(this.realStartdateValue).toDate();
      this.enddateValue = moment(this.realEnddateValue).toDate();
    }
    if (this.timezone) {
      this.maxdateValue = this.maxDate ? this.newDateUTC(this.maxDate) : this.newDateUTC();
    }
  }

  onHideDialog() {
    this.selectedButtonIndex = -1;
    this.clickSubmitButton = false;
    this.startdateValue = undefined;
    this.enddateValue = undefined;
    this.inputtimecalendar.nativeElement.focus();
    this.closeEvent.emit();
    this.setCurrentViewForCalendar();
  }

  onFocusableCellCalendar() {
    setTimeout(() => {
      if (this.calendarElSingle) {
        this.calendarElSingle.preventFocus = true;
        if (this.selectedDate) {
          this.updateInputValue(this.selectedDate);
        }
        this.calendarElSingle.initFocusableCell();
        return;
      };
      this.calendarElFrom.preventFocus = true;
      this.calendarElTo.preventFocus = true;
      this.calendarElFrom.initFocusableCell();
      this.calendarElTo.initFocusableCell();
    });
  }

  onPreventFocusCalendar() {
    this.calendarElFrom.navigationState = { button: true };
    this.calendarElTo.navigationState = { button: true };
    setTimeout(() => {
      this.calendarElFrom.navigationState = null;
      this.calendarElTo.navigationState = null;
    });
  }

  setCurrentViewForCalendar(type: any = 'date') {
    if (this.calendarElSingle) {
      this.calendarElSingle.setCurrentView(type);
      if (this.useFuturePicker && this.showTime) {
        this.timeInputConfig.timeInputValue = '';
        this.timeInputConfig.isInvalidTime = false;
        this.timeInputConfig.errorMessage = '';
      }
      return;
    }
    this.calendarElFrom.setCurrentView(type);
    this.calendarElTo.setCurrentView(type);
  }

  updateTimeFromTextBox(e) {
    const timeInterval = e.target.value.includes('to') ? e.target.value.split('to') : e.target.value.split('  ');
    if (timeInterval[1] && (this.newMoment(timeInterval[0].trim()).isValid() &&
      this.newMoment(timeInterval[1].trim()).isValid() &&
      this.newMoment(timeInterval[0].trim()) < this.newMoment(timeInterval[1].trim()))) {
      if (this.timezone) {
        const maxDateTimeZone = this.maxDate ? moment(this.maxDate).format(`${this.dateFormat} HH:mm:ss`)
          : moment().utcOffset(this.timezone).format(`${this.dateFormat} HH:mm:ss`);
        if (this.newMoment(timeInterval[1].trim()) > this.newMoment(maxDateTimeZone)) {
          this.exceedTimeZoneEvent.emit({
            errorMessage: this.translateResults.EXCEED_TIMEZONE
          });
          this.timeInputValid = false;
        } else {
          this.timeInputValid = true;
        }
      } else {
        this.timeInputValid = true;
      }
    } else {
      this.timeInputValid = false;
    }
    // If the instance of this component is of type quickAsIs -> Run the seperate validation
    if (this.quickAsIs) {
      if (this.errMessage === true || this.showInputError === true) {
        this.timeInputValid = false;
      } else {
        this.timeInputValid = true;
      }
    }
    this.validationEvent.emit(this.timeInputValid);
  }

  emitOnblur(e) {
    const lastX = new RegExp(/(last)\s\d{0,2}\s((day(s|))|(minute(s|))|(hour(s|)))/i);
    if (!this.isSingleCalendar && e.target.value.includes('to')) { // In the event the target contains Last X || Empty - It won't run
      const timeInterval = e.target.value.includes('to') ? e.target.value.split('to') : e.target.value.split('  ');
      const startdateValue = new Date(timeInterval[0].trim());
      const enddateValue = new Date(timeInterval[1].trim());
      const checkMinMaxDate = ((startdateValue < this.minDate || enddateValue > this.maxDate) && ((this.minDate || this.maxDate) != null));
      if ((checkMinMaxDate && !this.useFuturePicker) || (startdateValue > enddateValue)) {
        this.showInputError = true;
      } else {
        this.showInputError = false;
      }
      if (this.timeInputValid && !this.showInputError) {
        if (this.timezone) {
          this.dateChanged.emit({
            startdateValue: timeInterval[0].trim(),
            enddateValue: timeInterval[1].trim(),
            durationButtonClicked: this.durationButtonClicked,
            timezone: this.timezone
          });
        } else {
          this.dateChanged.emit({
            // On submit, this code determines the epoch based on the time displayed(in UI) but it system timezone
            startdateValue: moment(startdateValue, 'epoch'),
            startdateUtcValue: moment(moment.utc(startdateValue).valueOf(), 'epoch'),
            enddateValue: moment(enddateValue, 'epoch'),
            enddateUtcValue: moment(moment.utc(enddateValue).valueOf(), 'epoch')
          });
        }
      }
    } else if (lastX.test(e)) {
      // parse and emit
      this.updateInterval(e);
    }
  }

  newMoment(date: string) {
    return moment(date, `${this.dateFormat} HH:mm:ss`);
  }

  /**
   * Updates the time interval according to the user input (Last X minutes/days/hours)
   * @author ssiage
   */
  updateInterval(e) {
    const minuteRegex = new RegExp(/(last)\s\d{0,2}\s(minute(s|))/i);
    const hourRegex = new RegExp(/(last)\s\d{0,2}\s(hour(s|))/i);
    const dayRegex = new RegExp(/(last)\s\d{0,3}\s(day(s|))/i);
    let unitEntered: MomentUnit;

    const currentDate = new Date();
    const valueOfUnit = (e.split(' ')[1]);
    this.realEnddateValue = moment(currentDate).toDate();
    const startDate = new Date();

    let isQuickPick = false;

    if (dayRegex.test(e)) {
      unitEntered = MomentUnit.Days;
      isQuickPick = true;
      startDate.setDate(currentDate.getDate() - valueOfUnit);
    }
    if (hourRegex.test(e)) {
      unitEntered = MomentUnit.Hours;
      isQuickPick = true;
      startDate.setHours(currentDate.getHours() - valueOfUnit);
    }
    if (minuteRegex.test(e)) {
      unitEntered = MomentUnit.Minutes;
      isQuickPick = true;
      startDate.setMinutes(currentDate.getMinutes() - valueOfUnit);
    }
    this.realStartdateValue = moment(startDate).toDate();

    this.dateChanged.emit({
      startdateValue: this.realStartdateValue,
      enddateValue: this.realEnddateValue
    });

    this.informParentQuickPick.emit({
      quickPick: isQuickPick,
      value: valueOfUnit,
      unit: unitEntered
    });
  }

  onTextChange(e: any) {
    // eslint-disable-next-line max-len
    const intervalRegex = new RegExp(/(((last)\s\d{0,3}\s((day(s|))|(minute(s|))|(hour(s|)))))|(((\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})\s(to)\s(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})))|(^$)/i);
    const startWithDate = new RegExp(/last/i);
    const rangeRegex = new RegExp(/(((\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})\s(to)?\s(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})))|(^$)/i);

    // This allows it to be toggleable by other parent components
    if (!this.quickAsIs) {
      return;
    }

    if (e === '') {
      this.showInputError = false;
      this.realStartdateValue = moment(this.minDateValue).toDate();
      this.realEnddateValue = moment(new Date()).toDate();
      // If it's empty - set the start date
      this.dateChanged.emit({
        startdateValue: this.realStartdateValue,
        enddateValue: this.realEnddateValue
      });
      return;
    }

    if (startWithDate.test(e) && !intervalRegex.test(e)) {
      this.errMessage = true;
      this.errMsg = this.translateResults.INVALID_LAST_X;
      return;
    } else if (!startWithDate.test(e) && !intervalRegex.test(e)) {
      this.errMessage = true;
      this.errMsg = this.translateResults.INVALID_INTERVAL;
      return;
    } else {
      this.errMessage = false;
      this.errMsg = '';
    }

    if (rangeRegex.test(e)) {
      this.showInputError = false;
    }
    this.updateInterval(e);
  }

  addAriaLabelForCalendarButton() {
    if (this.isSingleCalendar) {
      if (this.calendarElSingle) {
        this.focusCalendar.addAriaLabelAllButton(this.calendarElSingle);
      }
    } else {
      if (this.calendarElFrom && this.calendarElTo) {
        this.focusCalendar.addAriaLabelAllButton(this.calendarElFrom);
        this.focusCalendar.addAriaLabelAllButton(this.calendarElTo);
      }
    }
  }

  addAriaLabelForDatePickerOnChange() {
    if (this.isSingleCalendar) {
      this.focusCalendar.addAriaLabelOnChange(this.calendarElSingle);
    } else {
      this.focusCalendar.addAriaLabelOnChange(this.calendarElFrom);
      this.focusCalendar.addAriaLabelOnChange(this.calendarElTo);
    }
  }

  addAriaLabelForDatePickerOnSelect() {
    if (!this.isSingleCalendar) {
      this.calendarElFrom?.onSelect.subscribe(() => {
        this.focusCalendar.addAriaLabelDateButton(this.calendarElTo, this.translateResults?.MONTH);
      });
      this.calendarElTo?.onSelect.subscribe(() => {
        this.focusCalendar.addAriaLabelDateButton(this.calendarElFrom, this.translateResults?.MONTH);
      });
    };
  }

  addAriaLabelForDatePickerOnReset() {
    if (this.isSingleCalendar) {
      this.focusCalendar.addAriaLabelAllButton(this.calendarElSingle);
    } else {
      this.focusCalendar.addAriaLabelAllButton(this.calendarElFrom);
      this.focusCalendar.addAriaLabelAllButton(this.calendarElTo);
    }
  }

  showClassPicker() {
    if (this.isCustomTimePicker) {
      if (this.useFuturePicker) {
        return 'customDialog future-picker';
      }
      return 'customDialog';
    } else {
      return 'timepicker-dialog';
    }
  }

  onKeyPress(event: any) {
    const enteredKey = event?.key;
    const allowedCharacters = /[0-9:]/;
    if (!allowedCharacters.test(enteredKey)) {
      event.preventDefault();
    }
  }

  changeInputTime(timeValue: string) {
    const timeParts = timeValue.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
    // Check that the hour, minute and second value does not exceed the limit
    if (!isNaN(hours) && hours >= 0 && hours <= 23 &&
      !isNaN(minutes) && minutes >= 0 && minutes <= 59 &&
      !isNaN(seconds) && seconds >= 0 && seconds <= 59) {
      const isVaildTime = this.calendarElSingle.validateTime(hours, minutes, seconds, this.calendarElSingle.pm);
      if (!isVaildTime) {
        this.timeInputConfig.isInvalidTime = true;
        this.timeInputConfig.errorMessage = this.translateResults?.INVALID_TIME;
      } else {
        const updatedDateTime = new Date(this.selectedDate);
        updatedDateTime.setHours(hours);
        updatedDateTime.setMinutes(minutes);
        updatedDateTime.setSeconds(seconds);
        this.selectedDate = updatedDateTime;
        this.timeInputConfig.isInvalidTime = false;
        this.timeInputConfig.errorMessage = '';
      }
    } else {
      this.timeInputConfig.isInvalidTime = true;
      this.timeInputConfig.errorMessage = this.translateResults?.INVALID_TIME;
    }
  }

  handleFocusTimeInput() {
    if (!this.selectedDate) {
      // after setting the value for selectedDate, the calendar of primeNg will focus current day, we need to set focus time input.
      this.selectedDate = moment().toDate();
      setTimeout(() => {
        this.customTimeSingle.nativeElement?.querySelector('.custom-time-input')?.focus();
      }, 100);
    }
  }

  onTimeSelect(event: any) {
    this.updateInputValue(event);
  }

  updateInputValue(event: any) {
    const eventTime = event.getHours() + ':' + event.getMinutes() + ':' + event.getSeconds();
    this.timeInputConfig.timeInputValue = eventTime;
    if (this.timeInputConfig.timeInputValue) {
      this.timeInputConfig.isInvalidTime = false;
      this.timeInputConfig.errorMessage = '';
    }
  }

  checkTimeCalendarsAreEqual() {
    if (this.useFuturePicker && !this.isSingleCalendar && !this.showTime) {
      const realStartdateValue = new Date(this.realStartdateValue);
      const realEnddateValue = new Date(this.realEnddateValue);
      if (realStartdateValue.getTime() === realEnddateValue.getTime()) {
        realStartdateValue.setHours(0, 0, 0);
      }
      realEnddateValue.setHours(23, 59, 59);
      this.realStartdateValue = realStartdateValue;
      this.realEnddateValue = realEnddateValue;
    }
  }
}
