import { SidebarComponent } from './sidebar.component';
import { RbnCommonLibModule } from '../../../../public_api';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

export default {
  title: 'Components/SideBar',
  component: SidebarComponent,
  decorators: [
    moduleMetadata({
      imports: [RbnCommonLibModule, RouterModule.forRoot([], { useHash: true, relativeLinkResolution: 'legacy' }), BrowserAnimationsModule]
    })
  ],
  argTypes: {
    menuItems: { control: 'object' },
    useFavorites: { control: 'boolean' },
    favoriteIds: { control: 'object' },
    useSearch: { control: 'boolean' }
  },
  parameters: {
    backgrounds: {
      default: 'lightgrey',
      values: [
        { name: 'lightgrey', value: 'lightgrey' },
        { name: 'blue', value: '#3b5998' }
      ]
    }
  }

};

export const Sidebar = () => ({
  template: `<rbn-sidebar [menuItems]="menuItems" [favoriteIds]="favoriteIds" (favoriteChanged)="favoriteChanged($event)"
  [useFavorites]="useFavorites" [useSearch]="useSearch" (noChildClicked)="noChildClicked($event)"
  [useConfigurationMode]="useConfigurationMode" [useLocalStorage]="useLocalStorage" (configureMode)="handleConfigure($event)"
  [noneUppercaseParentLabel]="noneUppercaseParentLabel">
  </rbn-sidebar>`,
  props: sidebarData
});

const sidebarData = {
  menuItems: [
    {
      path: 'home',
      data: {
        menu: {
          title: 'Home',
          sidebarLabel: 'Home',
          icon: 'fa fa-home',
          topLevel: true
        }
      },
      children: [
        {
          path: 'dashboard',
          data: {
            menu: {
              title: 'Dashboards',
              sidebarLabel: 'Dashboards'
            },
            keywords: [
              'home',
              'zoom data'
            ]
          }
        },
        {
          path: 'customDashboard',
          data: {
            menu: {
              title: 'Custom Dashboards',
              sidebarLabel: 'Custom Dashboards'
            }
          },
          disabled: true
        }
      ]
    },
    {
      path: 'nochildren',
      abbr: 'MWC',
      data: {
        menu: {
          title: 'Menu without children',
          sidebarLabel: 'Menu without children',
          icon: 'fa fa-exclamation-circle',
          topLevel: true
        }
      }
    },
    {
      path: 'application',
      abbr: 'APP',
      data: {
        menu: {
          title: 'Applications',
          sidebarLabel: 'Applications',
          // icon: 'fa fa-cube',
          topLevel: true
        }
      },
      children: [
        {
          path: 'volte',
          data: {
            menu: {
              title: 'VoLTE Service Assurance',
              sidebarLabel: 'VoLTE Service Assurance'
            }
          },
          disabled: true
        },
        {
          path: 'tdosProtect',
          data: {
            menu: {
              title: 'TDoSProtect',
              sidebarLabel: 'TDoSProtect'
            }
          },
          disabled: false,
          children: [
            {
              path: 'status',
              disabled: true,
              data: {
                menu: {
                  title: ' TDoSProtect Status',
                  sidebarLabel: 'Status'
                }
              }
            },
            {
              path: 'config',
              data: {
                menu: {
                  title: 'TDoSProtect Configuration',
                  sidebarLabel: 'Configuration'
                }
              }
            }
          ]
        },
        {
          path: 'vowifi',
          data: {
            menu: {
              title: 'VoWiFi Service Assurance',
              sidebarLabel: 'VoWiFi Service Assurance'
            }
          }
        },

        {
          path: 'roboProtect',
          data: {
            menu: {
              title: 'RoboProtect',
              sidebarLabel: 'RoboProtect'
            }
          },
          children: [
            {
              path: 'incidents',
              data: {
                menu: {
                  title: 'RoboProtect Incidents',
                  sidebarLabel: 'Incidents'
                }
              },
              tag: {
                type: 'NEW'
              }
            },
            {
              path: 'status',
              data: {
                menu: {
                  title: 'RoboProtect Status',
                  sidebarLabel: 'Status'
                }
              },
              tag: {
                type: 'ALPHA'
              }
            },
            {
              path: 'detector',
              data: {
                menu: {
                  title: 'RoboProtect Detector',
                  sidebarLabel: 'Detector'
                }
              },
              tag: {
                type: 'BETA'
              }
            }
          ]
        },
        {
          path: 'fraudProtect',
          data: {
            menu: {
              title: 'Fraud Protect',
              sidebarLabel: 'Fraud Protect'
            }
          },
          children: [
            {
              path: 'user-defined-rules',
              data: {
                menu: {
                  title: 'Incident Detectors',
                  sidebarLabel: 'Incident Detectors'
                }
              }
            },
            {
              path: 'fraudDetector',
              data: {
                menu: {
                  title: 'Fraud Detectors',
                  sidebarLabel: 'Fraud Detectors'
                }
              },
              children: [
                {
                  path: 'SubscriberMonitoring',
                  data: {
                    menu: {
                      title: 'Subscriber',
                      sidebarLabel: 'Subscriber'
                    }
                  }
                },
                {
                  path: 'TargetMonitoring',
                  data: {
                    menu: {
                      title: 'Target',
                      sidebarLabel: 'Target'
                    }
                  },
                  tag: {
                    type: 'CUSTOM',
                    label: 'DEMO',
                    color: 'blue',
                    expiry: 1800
                  }
                },
                {
                  path: 'TrunkGroupMonitoring',
                  data: {
                    menu: {
                      title: 'TrunkGroup',
                      sidebarLabel: 'TrunkGroup'
                    }
                  }
                },
                {
                  path: 'IngressTgMonitoring',
                  data: {
                    menu: {
                      title: 'IngressTg',
                      sidebarLabel: 'IngressTg'
                    }
                  }
                },
                {
                  path: 'EgressTgMonitoring',
                  data: {
                    menu: {
                      title: 'EgressTg',
                      sidebarLabel: 'EgressTg'
                    }
                  }
                },
                {
                  path: 'Wangiri',
                  data: {
                    menu: {
                      title: 'Wangiri',
                      sidebarLabel: 'Wangiri'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: 'management',
      disabled: true,
      data: {
        menu: {
          title: 'MANAGEMENT',
          sidebarLabel: 'MANAGEMENT',
          icon: 'fa fa-tools',
          topLevel: true
        }
      },
      children: [
        {
          path: 'dashboard',
          data: {
            menu: {
              title: 'Dashboards',
              sidebarLabel: 'Dashboards'
            }
          }
        }
      ]
    }
  ],
  useFavorites: true,
  useSearch: true,
  useConfigurationMode: true,
  useLocalStorage: true,
  idWithoutSpace: true,
  noneUppercaseParentLabel: true,
  favoriteIds: [
    { favoriteId: 'home/dashboard' },
    { favoriteId: 'application/tdosProtect/status' }
  ],
  noChildClicked: (e) => {
    console.log('noChildClicked!');
  }
};
