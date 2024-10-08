import {
  Component,  EventEmitter, ViewChildren, Input, QueryList, Output, OnInit, ElementRef, ViewChild
} from '@angular/core';
import { Calendar } from 'primeng/calendar';
import moment from 'moment';

// magic fix, https://github.com/jvandemo/generator-angular2-library/issues/221
import { CalendarDateRange } from '../../../models/calendardaterange';

@Component({
  selector: 'rbn-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() showTime !: boolean;
  @Input() fromDate !: Date; // initial from date
  @Input() toDate !: Date; // initial to date
  @Input() disabledTimePicker = false;
  @Output() dateRangeEmitter = new EventEmitter<CalendarDateRange>();
  @ViewChildren(Calendar) calendars !: QueryList<Calendar>;
  @ViewChild('rbninputdaterangecalendar', { read: ElementRef }) rbninputdaterangecalendar: ElementRef;

  // The following properties of p-calendar are exposed as inputs to DateRangePickerComponent
  // When adding new properties, add entry in ngOnChanges below
  // And update template.
  pShowTime !: boolean;
  pDisplay !: boolean;
  pFromDate !: Date;
  pToDate !: Date;

  inputTextSize !: number;

  constructor() {
    this.pDisplay = false;
  }

  ngOnInit() {
    // These p-calendar properties are set at initialization time only using properties passed from parent
    (this.showTime == null) ? (this.pShowTime = false) : (this.pShowTime = this.showTime);
    this.fromDate ? (this.pFromDate = this.fromDate) : (this.pFromDate = new Date());
    this.toDate ? (this.pToDate = this.toDate) : (this.pToDate = new Date());
    this.inputTextSize = (this.showTime) ? 40 : 24;
  }

  // Called by parent to show calendar dialog
  public postDialog() {
    this.pDisplay = true;
  }

  handleOk() {
    // Get Dates and emit
    const dateRange: CalendarDateRange = new CalendarDateRange(this.pFromDate, this.pToDate);
    this.dateRangeEmitter.emit(dateRange);
    this.pDisplay = false;
  }

  handleCancel() {
    this.pDisplay = false;
  }


  formatDateRange() {
    const from = moment(this.fromDate, 'x');
    const to = moment(this.toDate, 'x');
    const formatStr = (this.pShowTime === true) ? 'lll' : 'll';
    return (from.format(formatStr) + ' - ' + to.format(formatStr));
  }

  onHideDialog() {
    this.rbninputdaterangecalendar.nativeElement.focus();
  }

}
