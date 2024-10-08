import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'rbn-dynamic-datetimepicker',
  templateUrl: './dynamic-datetimepicker.component.html'
})

export class DynamicDatetimepickerComponent extends FieldType implements OnInit {
  selectedDate: Date = new Date();
  displayEpochTime = false;
  dateTimeString: string;
  @ViewChild('calendar', { static: false }) calendarEl: ElementRef;

  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {
    if (this.to.isEpoch && this.to.readonly) {
      this.displayEpochTime = true;
      this.dateTimeString = this.datePipe.transform(this.model[this.key[0]], this.to?.dateFormat);
    } else {
      this.displayEpochTime = false;
    }
    if (this.model[this.key[0]]) {
      this.selectedDate = (this.model[this.key[0]]);
    }
  }

  setCalendarOverlayVisible(calendar: Calendar) {
    setTimeout(() => {
      calendar.overlayVisible = true;
    }, 0);
  }

}
