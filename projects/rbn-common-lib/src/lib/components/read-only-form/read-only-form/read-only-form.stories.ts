import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReadOnlyFormComponent } from './read-only-form.component';
import { RbnCommonLibModule } from '../../../../public_api';

export default {
  title: 'Components/ReadOnlyForm',
  component: ReadOnlyFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ],
  argTypes: {
    json: {
      control: { type: 'object'}
    }
  }
};

export const ReadOnlyForm = (args) => ({
  component: ReadOnlyFormComponent,
  props: {
    json: args.json
  }
});

ReadOnlyForm.args = {
  json: {
    'Model & Mode': 'SBC 1000 | Perpetual - 0 Calls',
    'MAC Address': '00:10:23:c0:50:ca',
    'Firmware version': '9.0.0v548',
    'Active address': '10.56.219.105 | 172.30.0.1',
    'Description': '',
    'Located in': 'ALL > Roger',
    'Policy Compliant': 'N/A'
  }
};
