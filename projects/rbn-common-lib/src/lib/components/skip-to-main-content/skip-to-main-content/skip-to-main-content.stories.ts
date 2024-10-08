import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { RbnCommonLibModule } from '../../../../public_api';
import { SkipToMainContentComponent } from './skip-to-main-content.component';

export default {
  title: 'Components/SkipToMainContent',
  component: SkipToMainContentComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule
      ]
    })
  ]
};

export const SkipToMainContent = () => ({
  template: `
    <rbn-page-top></rbn-page-top>
    <rbn-skip-to-main-content (clickSkipEvent)="clickSkipEvent()"></rbn-skip-to-main-content>
    <main id="main">
      Press Tab button to focus the skip-to-main-content block
    </main>
  `,
  props: {
    clickSkipEvent: () => {
      console.log('Click skip to main content');
    }
  }
});
