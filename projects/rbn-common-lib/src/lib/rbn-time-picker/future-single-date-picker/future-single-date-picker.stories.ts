import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { useArgs } from '@storybook/client-api';
import { withKnobs } from '@storybook/addon-knobs';

import { RbnCommonLibModule, RbnFocusCalendarDirective } from '../../../public_api';

import moment from 'moment';

import { FutureSingleDatePickerComponent } from './future-single-date-picker.component';


export default {
  title: 'Rbn-Time-Picker/FutureSingleDatepicker',
  component: FutureSingleDatePickerComponent,
  decorators: [
    withKnobs,
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
    newTimeValues: { control: 'array' },
    singleCalendarConfig: { control: 'object' }
  }
};

export const FutureSingleDatePicker = (args) => {
  const [x, updateArgs] = useArgs();
  const updateDateTime = (value) => updateArgs({
    newTimeValues: value.newTimeValues,
    singleCalendarConfig: value.singleCalendarConfig
  });
  const dataInput = {
    onDateChanged: (data: {
      startdateValue: string;
      enddateValue: string;
      selectedDate: string
    }) => {
      const timeModel = {
        newTimeValues: (data.startdateValue !== undefined && data.enddateValue !== undefined) ?
          [data.startdateValue, data.enddateValue] : '',
        singleCalendarConfig: { selectedDate: (data.selectedDate !== undefined) ? data.selectedDate : '' }
      };
      updateDateTime(timeModel);
    },
    singleCalendarConfig: args.singleCalendarConfig,
    removeMaxDate: true,
    maxDate: moment().subtract(-3, 'days').toDate(),
    headerTimePicker: args.headerTimePicker
  };
  return {
    template: `<rbn-future-single-date-picker
      [newTimeValues]="newTimeValues"
      (dateChanged)="onDateChanged($event)"
      [singleCalendarConfig]="singleCalendarConfig"
      [isCustomTimePicker]="true"
      [removeMaxDate]="removeMaxDate" [showTime]="true"
      [maxDate]="maxDate"
      [timeOnly]="false" [headerTimePicker]="headerTimePicker">
    </rbn-future-single-date-picker>`,
    props: dataInput
  };
};

FutureSingleDatePicker.args = {
  newTimeValues: [
    moment().toDate(),
    moment().toDate()
  ],
  singleCalendarConfig: {
    selectedDate: moment().toDate()
  },
  headerTimePicker: ''
};
