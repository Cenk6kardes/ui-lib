import { withKnobs, text } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DynamicButtonComponent } from './dynamic-button.component';
import { RbnCommonLibModule } from '../../../public_api';

export default {
  title: 'Rbn-dynamic-forms/DynamicButton',
  component: DynamicButtonComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RbnCommonLibModule
      ]
    })
  ]
};

export const DynamicButton = () => ({
  component: DynamicButtonComponent,
  props: {
    field:
      {
        key: 'button',
        type: 'rbn-button',
        props: {
          text: text('text', 'Dynamic Button'),
          onClick: () => {
            console.log('Button Clicked!');
          }
        }
      }
  }
});
