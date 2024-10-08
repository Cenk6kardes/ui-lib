import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { useArgs } from '@storybook/client-api';

import { RbnCommonLibModule } from '../../../public_api';
import { SingleTimePickerComponent } from './single-time-picker.component';
import { withKnobs } from '@storybook/addon-knobs';
import moment, { unitOfTime } from 'moment';


export default {
  title: 'Rbn-Time-Picker/SingleTimepicker',
  component: SingleTimePickerComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ],
  argTypes: {
    newTimeValues: { control: 'array' },
    singleCalendarConfig: { control: 'object' }
  }
};

export const SingleTimePicker = (args) => {
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
    minDate: moment().subtract(7, 'days').toDate(),
    maxDate: moment().subtract(-3, 'days').toDate()
  };
  return {
    template: `<rbn-single-time-picker
      [(newTimeValues)]="newTimeValues"
      (dateChanged)="onDateChanged($event)"
      [singleCalendarConfig]="singleCalendarConfig"
      [isCustomTimePicker]="true"
      [removeMaxDate]="removeMaxDate"
      [hiddenQuickSelect]= "false"
      [maxDate]="maxDate"
      [minDate]="minDate"
      [timeOnly]="false">
    </rbn-single-time-picker>`,
    props: dataInput
  };
};

SingleTimePicker.args = {
  newTimeValues: [
    moment().subtract(3, 'day').toDate(),
    moment().toDate()
  ],
  singleCalendarConfig: {
    selectedDate: moment().toDate()
  }
};
