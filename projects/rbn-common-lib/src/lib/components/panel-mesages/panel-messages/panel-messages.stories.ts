import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { RbnCommonLibModule } from '../../../../public_api';
import { PanelMessagesComponent } from './panel-messages.component';



export default {
  title: 'Components/PanelMessages',
  component: PanelMessagesComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], { useHash: true, relativeLinkResolution: 'legacy' })
      ]
    })
  ]
};

export const PanelMessages = () => {
  const titleTest = 'Title';
  const contentTest = 'This is a demo message that needs more description space for the system';
  const typeTest = 'success';

  return {
    template: `
    <rbn-panel-messages [title]="titleTest" [content]="contentTest" [typeOfMessage]="'success'"></rbn-panel-messages>
    <rbn-panel-messages [title]="titleTest" [content]="contentTest" [typeOfMessage]="'info'"></rbn-panel-messages>
    <rbn-panel-messages [title]="titleTest" [content]="contentTest" [typeOfMessage]="'warn'"></rbn-panel-messages>
    <rbn-panel-messages [title]="titleTest" [content]="contentTest" [typeOfMessage]="'error'"></rbn-panel-messages>`,
    props: {
      titleTest,
      contentTest,
      typeTest
    }
  };
};
