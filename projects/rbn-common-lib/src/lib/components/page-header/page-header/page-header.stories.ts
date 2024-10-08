import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../../../public_api';
import { PageHeaderComponent } from './page-header.component';

export default {
  title: 'Components/PageHeader',
  component: PageHeaderComponent,
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

export const PageHeader = () => {

  const data = object('data', {
    title: 'Page Header',
    breadcrumb:
      [{
        label: 'VNF',
        command: (event) => {
          console.log('call back');
        }
      },
      { label: 'Lifecycle' }],
    topButton: {
      label: 'New VNF',
      icon: 'pi pi-plus',
      title: 'Test action',
      onClick: () => {
        console.log('on click top button');
      },
      iconPos: 'left',
      isDisplay: true
    },
    overlayButton: {
      menuItem: [
        { label: 'Keys', icon: 'pi pi-key' },
        { label: 'Administration', icon: 'pi pi-briefcase' }
      ],
      isDisplay: true
    },
    topDropdown: {
      isDisplay: true,
      content: [
        {
          value: 'page navigation 1', label: 'Page Navigation 1'
        },
        {
          value: 'page navigation 2', label: 'Page Navigation 2'
        },
        {
          value: 'page navigation 3', label: 'Page Navigation 3'
        }]
    }
  });
  return {
    component: PageHeaderComponent,
    props: {
      data,
      backButtonAction: ($event) => {
        action('backButtonEv')($event);
      },
      selectedDropItem: ($event) => {
        action('selectedDropEv')($event);
      }
    }
  };
};
