import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { useArgs } from '@storybook/client-api';
import moment from 'moment';

import { RbnCommonLibModule, RbnFocusCalendarDirective } from '../../../public_api';
import { FutureDatePickerComponent } from './future-date-picker.component';

export default {
  title: 'Rbn-Time-Picker/FutureDatepicker',
  component: FutureDatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ],
      providers: [
        RbnFocusCalendarDirective
      ]
    })
  ],
  argTypes: {
    newTimeValues: { control: 'array' }
  }
};

export const FutureDatePicker = (args) => {
  const [x, updateArgs] = useArgs();
  const updateDateTime = (value) => updateArgs({ newTimeValues: value });
  const dataInput = {
    newTimeValues: args.newTimeValues,
    timezone: args.timezone,
    headerTimePicker: args.headerTimePicker,
    onDateChanged: (data: { startdateValue: string; enddateValue: string }) => {
      const timeModel = (data.startdateValue !== undefined && data.enddateValue !== undefined) ?
        [data.startdateValue, data.enddateValue] : '';
      console.log(data);
      updateDateTime(timeModel);
    },
    validationEvent(event) {
      console.log(event);
    },
    exceedTimeZoneEvent: (event) => {
      console.log(event);
    },
    maxDate: moment().subtract(-7, 'day').toDate()
  };

  return {
    template: `<rbn-future-date-picker [newTimeValues]="newTimeValues" [headerTimePicker]="headerTimePicker"
    (dateChanged)="onDateChanged($event)" [maxDate]="maxDate"
    [isCustomTimePicker]="true" [removeMaxDate]="true" (validationEvent)="validationEvent($event)"
    [timezone]="timezone" [inputEditable]="true" (exceedTimeZoneEvent)="exceedTimeZoneEvent($event)" [dateFormat]="'YYYY-MM-DD'">
    </rbn-future-date-picker>`,
    props: dataInput
  };
};

FutureDatePicker.args = {
  newTimeValues: [
    moment().toDate(),
    moment().toDate()
  ],
  timezone: 'UTC+0600',
  headerTimePicker: ''
};
