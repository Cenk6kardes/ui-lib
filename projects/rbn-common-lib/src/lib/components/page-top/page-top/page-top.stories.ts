import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AfterViewInit, Component } from '@angular/core';

import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { IPageTop, ISearchList, RbnCommonLibModule } from '../../../../public_api';
import { RbnMessageService } from '../../../services/rbn-message.service';
import { IProfileInfoData, IProfileInfoShowing } from '../../profile/profile.model';
import { ProfileModule } from '../../profile/profile.module';
import { PageTopModule } from '../page-top.module';
import { PageTopComponent } from './page-top.component';

@Component({
  selector: 'rbn-toast-message',
  template: ''
})
class ToastComponent implements AfterViewInit {
  constructor(private messageService: RbnMessageService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.messageService.showSuccess('Success');
      this.messageService.showInfo('Info Message');
      this.messageService.showError('Error Message');
      this.messageService.showWarn('Warning Message');
      this.messageService.showInfo('Info Message');
      this.messageService.showInfo('Info Message');
    }, 500);
  }
}

export default {
  title: 'Components/PageTop',
  component: PageTopComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [ToastComponent],
      imports: [
        RbnCommonLibModule,
        BrowserAnimationsModule,
        PageTopModule,
        ProfileModule
      ]
    })
  ]
};

export const PageTop = () => {
  const menuItems = [
    {
      label: 'Profile',
      icon: 'fa fa-user-circle',
      expanded: true,
      items: [
        {
          label: 'Edit Profile',
          icon: 'fa fa-pencil',
          command: ($event) => {
            action('Edit Profile')($event);

          }
        },
        {
          label: 'Log Out',
          icon: 'fa fa-power-off',
          command: ($event) => {
            action('Log Out');
          }
        }
      ]
    },
    {
      label: 'About',
      icon: 'fa fa-exclamation-circle',
      expanded: true,
      items: [
        {
          label: 'v20.04.00R001',
          icon: 'fa fa-star-o'
        }
      ]
    },
    {
      label: 'Help Center',
      icon: 'fa fa-question-circle-o',
      expanded: true,
      items: [
        {
          label: 'Edge View Online Documentation',
          icon: 'fa fa-file-o',
          command: ($event) => {
            action('Protect Online Documentation')($event);
          }
        }
      ]
    },
    {
      label: 'Third Party License',
      icon: 'fa fa-certificate',
      expanded: true,
      items: [
        { label: '3 Active', icon: 'fa fa-thumbs-up' },
        { label: '1 Expired', icon: 'fa fa-thumbs-down' }
      ]
    }
  ];
  const pageTop = object('pageTop', {
    logo: {
      action: undefined,
      image: 'assets/images/ribbon-login-logo.png',
      productName: 'ANALYTICS'
    },
    profiles: menuItems,
    externalIcon: [
      {
        icon: 'fa fa-chart-bar',
        command: (item: any) => {
          console.log('call click chart icon: ', item);
        }
      }
    ],
    externalSearch: {
      searchData: ''
    },
    searchList: [],
    hasSearchOverLay: true
  } as IPageTop);

  return {
    template: `<rbn-page-top [pageTop]="pageTop" [usingNotification]="true" (pressEnterEvent)="pressEnterEvent($event)" 
    (selectSearchItemEvent)="selectSearchItemEvent($event)"></rbn-page-top>
    <rbn-toast-message></rbn-toast-message>`,
    props: {
      pageTop,
      usingNotification: boolean('Using Notification', true),
      inputValue: ($event) => {
        action('InputValueEv')($event);
      },
      pressEnterEvent: ($event) => {
        const list = [
          {
            title: 'item 11111111111'
          },
          {
            title: 'item 2'
          },
          {
            title: 'item 3'
          },
          {
            title: 'item 4'
          },
          {
            title: 'item 5'
          }
        ] as ISearchList[];
        if (pageTop?.externalSearch?.searchData) {
          const searchValue = pageTop.externalSearch.searchData.toLowerCase().trim() as string;
          pageTop.searchList = list.filter(search => search.title.toLowerCase().includes(searchValue));
          console.log('searchList', pageTop.searchList);
        }
        console.log('pressEnterEvent', $event);
      },
      selectSearchItemEvent: ($event) => {
        console.log('selectSearchItemEvent', $event);
      }
    }
  };
};

export const logOutPopup = () => ({
  template: `<rbn-logout [showLogout]="showLogout" (confirmLogout)="showLogout = false">
      </rbn-logout>`,
  props: {
    showLogout: boolean('Show logout pop-up', true)
  }
});

export const aboutInfoPopup = () => {
  const infoContent = [
    'Version: 0.0.1',
    'Running at IP: localhost',
    'Build Number:  0.0.1',
    'UI Common Lib Version: 8.0.87',
    'UI Build Number: unknown'
  ];
  return {
    template: '<rbn-about-info [showInfo]="showInfo" [infoTitle]="infoTitle" [infoContent]="infoContent"></rbn-about-info>',
    props: {
      showInfo: boolean('Show About Info pop-up', true),
      infoContent
    }
  };
};

export const editProfileInfoPopup = () => {
  const showingConfigs: IProfileInfoShowing = {
    general: true,
    changePassword: {
      expiredPassword: false,
      forcedToResetPassword: false
    },
    timezone: true
  };
  const defaultData: IProfileInfoData = {
    general: { username: 'username', fullname: 'Full Name', description: 'Description' },
    timezone: { local: true, coordinated: true, another: false }
  };
  return {
    template: `<rbn-profile-info [showProfileInfo]="showProfileInfo" [defaultData]="defaultData" [showingConfigs]="showingConfigs"
    (profileInfo)="onChangeProfile($event)"></rbn-profile-info>`,
    props: {
      showProfileInfo: boolean('Show Profile Info pop-up', true),
      defaultData,
      showingConfigs
    }
  };
};
