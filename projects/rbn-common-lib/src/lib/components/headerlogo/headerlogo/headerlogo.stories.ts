import { moduleMetadata } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';

import { HeaderlogoComponent } from './headerlogo.component';
import { RbnCommonLibModule } from '../../../../public_api';

export default {
  title: 'Components/HeaderLogo',
  component: HeaderlogoComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [RbnCommonLibModule]
    })
  ],
  props: {
    productName: 'Test Common Table'
  },
  parameters: {
    backgrounds: {
      default: 'lightgrey',
      values: [
        { name: 'lightgrey', value: 'lightgrey' },
        { name: 'facebook', value: '#3b5998' }
      ]
    }
  }
};

export const HeaderLogo = () => ({
  component: HeaderlogoComponent,
  props: {
    productName: text('Product name', 'Test Common Table')
  }
});
