import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../rbn-common-lib.module';
import { PickListComponent } from './pick-list.component';
import { IColsPickList, FilterTypesPickList, BodyTextType, TypeHide } from './model';



export default {
  title: 'Components/PickList',
  component: PickListComponent,
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

export const PickList = () => {
  const colsResourceGroups: IColsPickList[] = [
    {
      field: 'name', header: 'Resource Groups', type: FilterTypesPickList.InputText, sort: true
    },
    {
      field: 'role', header: 'Role', bodyTextType: BodyTextType.Multiselect,
      typeHide: TypeHide.SOURCE
    }
  ];
  const dataResourceGroupsTarget: any[] = [
    {
      id: '1', name: 'resourceGroups1',
      role: {
        options:
          [
            { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: [{ label: 'admin', value: '1' }]
      }
    }
  ];
  const dataResourceGroupsSource: any[] = [
    {
      id: '2', name: 'resourceGroups2',
      role: {
        options:
          [
            { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      },
      isDisabled: true
    },
    {
      id: '3', name: 'resourceGroups3',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '4', name: 'resourceGroups4',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '5', name: 'resourceGroups5',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '6', name: 'resourceGroups6',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '7', name: 'resourceGroups7',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '8', name: 'resourceGroups8',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '9', name: 'resourceGroups9',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '10', name: 'resourceGroups10',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '11', name: 'resourceGroups11',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '12', name: 'resourceGroups12',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '13', name: 'resourceGroups13',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '14', name: 'resourceGroups14',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    },
    {
      id: '15', name: 'resourceGroups15',
      role: {
        options:
          [
            { label: 'select', value: '' }, { label: 'admin', value: '1' }, { label: 'guest', value: '2' }
          ],
        ngModel: null
      }
    }
  ];
  const targetConfigStories = {
    emptyMessageContent: 'empty data'
  };
  return {
    template: `<rbn-pick-list
      [cols]="colsResourceGroups"
      [dataTarget]="dataResourceGroupsTarget"
      [dataSource]="dataResourceGroupsSource"
      [isReorderTarget]="true"
      (evOnChangeData)="evOnChangeDataResourceGroupsPickList($event)" [targetConfig]="targetConfigStories">
    </rbn-pick-list>`,
    props: {
      colsResourceGroups,
      dataResourceGroupsTarget,
      dataResourceGroupsSource,
      targetConfigStories,
      evOnChangeDataResourceGroupsPickList: (e) => {
        console.log('data emit: ', e);
      }
    }
  };
};
