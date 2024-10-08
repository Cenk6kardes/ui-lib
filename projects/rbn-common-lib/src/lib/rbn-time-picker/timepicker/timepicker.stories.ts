import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { useArgs } from '@storybook/client-api';

import { RbnCommonLibModule } from '../../../public_api';
import { TimePickerComponent } from './timepicker.component';
import moment from 'moment';
export default {
  title: 'Rbn-Time-Picker/TimePicker',
  component: TimePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ],
  argTypes: {
    newTimeValues: { control: 'array' }
  }
};

export const Timepicker = (args) => {
  const [x, updateArgs] = useArgs();
  const updateDateTime = (value) => updateArgs({ newTimeValues: value });
  const dataInput = {
    newTimeValues: args.newTimeValues,
    timezone: args.timezone,
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
    minDate: moment().subtract(7, 'day').toDate(),
    maxDate: moment().subtract(-7, 'day').toDate()
  };

  return {
    template: `<rbn-time-picker [newTimeValues]="newTimeValues"
    (dateChanged)="onDateChanged($event)"[minDate]="minDate" [maxDate]="maxDate"
    [isCustomTimePicker]="true" [removeMaxDate]="true" [hiddenQuickSelect]= "false" (validationEvent)="validationEvent($event)"
    [timezone]="timezone" [inputEditable]="true" (exceedTimeZoneEvent)="exceedTimeZoneEvent($event)" [dateFormat]="'YYYY-MM-DD'">
    </rbn-time-picker>`,
    props: dataInput
  };
};

Timepicker.args = {
  newTimeValues: [
    moment().subtract(3, 'day').toDate(),
    moment().toDate()
  ],
  timezone: 'UTC+0600'
};
