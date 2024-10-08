import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { useArgs } from '@storybook/client-api';

import { DateRangePickerComponent } from './daterangepicker.component';
import { RbnCommonLibModule } from '../../../../public_api';

export default {
  title: 'Components/DaterangePicker',
  component: DateRangePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ],
  //  notes: { markdown }
  argTypes: {
    fromDate: { control: 'date' },
    toDate: { control: 'date' },
    showTime: { control: 'boolean' }
  }
};

export const DaterangePicker = (args) => {
  const [x, updateArgs] = useArgs();
  const updateDate = (value) => updateArgs({ fromDate: value.from, toDate: value.to });
  const dataInput = {
    fromDate: args.fromDate,
    toDate: args.toDate,
    showTime: args.showTime,
    eventDateRangeEmitter: ($event) => {
      updateDate($event);
    }
  };
  return {
    template: `<rbn-daterangepicker [fromDate]="fromDate" [toDate]="toDate" [showTime]="showTime"
    (dateRangeEmitter)="eventDateRangeEmitter($event)"></rbn-daterangepicker>`,
    props: dataInput
  };
};

DaterangePicker.args = {
  fromDate: new Date('05-10-2020 1:30:00'),
  toDate: new Date('05-08-2020 1:30:00'),
  showTime: true
};
