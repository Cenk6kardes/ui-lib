/* eslint-disable max-len */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { RbnCommonLibModule } from '../../../../public_api';
import { ServicesCardComponent } from './services-card.component';


export default {
  title: 'Components/ServicesCard',
  component: ServicesCardComponent,
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

export const ServicesCard = () => {
  const infor = {
    title: 'IDH',
    description: '<div>The SBC Core platform provides security, session control, bandwidth management, advanced media services, and integrated billing/reporting tools. <sup><i class="far fa-registered"></i></sup></div>',
    labelBtnForward: 'Launch IDH',
    isBlackLogo: false
  };
  const inforBlack = {
    title: 'STI',
    description: 'The SBC Core platform provides security, session control, bandwidth management, advanced media services, and integrated billing/reporting tools. <sup><i class="far fa-registered"></i></sup>',
    labelBtnForward: 'Launch STI',
    isBlackLogo: true
  };
  return {
    template: `<rbn-services-card [inforCard]="infor" (evOnClickBtnForward)="forwardToIDH()"></rbn-services-card>
    <rbn-services-card [inforCard]="inforBlack" (evOnClickBtnForward)="forwardToSTI()"></rbn-services-card>`,
    props: {
      infor,
      forwardToIDH: () => {
        console.log('test event evOnClickBtnForward');
      },
      inforBlack,
      forwardToSTI: () => {
        console.log('test event evOnClickBtnForward');
      }
    }
  };
};
