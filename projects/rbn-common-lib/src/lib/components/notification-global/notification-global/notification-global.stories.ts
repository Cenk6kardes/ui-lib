import { moduleMetadata } from '@storybook/angular';
import { NotificationGlobalComponent } from './notification-global.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';

import { RbnCommonLibModule } from '../../../../public_api';

export default {
  title: 'Components/NotificationGlobal',
  component: NotificationGlobalComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ],
  parameters: {
    backgrounds: {
      default: 'lightgrey',
      values: [
        { name: 'lightgrey', value: 'lightgrey' },
        { name: 'blue', value: '#3b5998' }
      ]
    }
  },
  argTypes: {
    totalNotification: { control: 'number' }
  }
};

export const NotificationGlobal = (args) => {
  const [x, updateArgs] = useArgs();
  const updateMessage = (value) => updateArgs({ totalNotification: value });
  let onClickNotification = '';
  let total;
  const dataInput = {
    totalNotification: args.totalNotification,
    onClickNotification: () => {
      if (args.totalNotification > 0) {
        total = --args.totalNotification;
        updateMessage(total);
      } else {
        onClickNotification = 'No message';
      }
    }
  };
  return {
    component: NotificationGlobalComponent,
    props: dataInput
  };
};

NotificationGlobal.args = {
  totalNotification: 5
};
