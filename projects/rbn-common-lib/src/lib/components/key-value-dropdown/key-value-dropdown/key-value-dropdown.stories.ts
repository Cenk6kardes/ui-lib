import { action } from '@storybook/addon-actions';
import { KeyValueDropdownComponent } from './key-value-dropdown.component';
import { RbnCommonLibModule } from '../../../../public_api';
import { moduleMetadata } from '@storybook/angular';
import { text, object, boolean, withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Components/KeyValueDropdown',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [BrowserAnimationsModule, RbnCommonLibModule]
    })
  ]
};

export const KeyValueDropdown = () => ({
  component: KeyValueDropdownComponent,
  props: {
    keyName: text('Key Name', 'roleName', 'Key Value'),
    valueName: text('Value Name', 'tenantName', 'Key Value'),
    placeholderTextKey: text('Place Holder Text Key', 'Select Role', 'Place holder'),
    placeholderTextValue: text('Place Holder Text Value', 'Select Tenant', 'Place holder'),
    keyOption: object('Key Option',
      [
        { label: 'Select Role', value: 'None' },
        { label: 'admin', value: 'admin' },
        { label: 'user', value: 'user' }
      ], 'Option value'),
    valueOption: object('Value Option',
      [
        { label: 'Select Tenant', value: 'None' },
        { label: 'All Tenant', value: '' },
        { label: 'PLA.PC2.SV.VNFM.DSC.1', value: 'PLA.PC2.SV.VNFM.DSC.1' },
        { label: 'PLA.PC2.SV.VNFM.SBC.2', value: 'PLA.PC2.SV.VNFM.SBC.2' }
      ], 'Option value'),
    isDropdownRequired: boolean('isDropdownRequired', true),
    isShowEdit: boolean('isShowEdit', true),
    mappingsSet: object('mappingsSet', [{ roleName: 'admin', tenantName: '' }], 'Option value'),
    sendMappingList: action('sendMappingList')
  }
});
