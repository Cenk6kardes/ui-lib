import { action } from '@storybook/addon-actions';
import { KeyValueComponent } from './key-value.component';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../../../public_api';
import { withKnobs, text, object, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Components/KeyValue',
  component: KeyValueComponent,
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

export const KeyValue = () => ({
  component: KeyValueComponent,
  props: {
    placeholderTextKey: text('Place holder key', 'Place holder key', 'Place holder'),
    placeholderTextValue: text('Place holder value', 'Place holder value', 'Place holder'),
    keyOption: object('Key option', [{value: 'Test_1', label: '1'}, {value: 'Test_2', label: '2'}], 'Dropdown Value'),
    valueOption: object('Value option', [{value: 'Test_4', label: '4'}, {value: 'Test_3', label: '3'}], 'Dropdown Value'),
    isDropdownRequired: boolean('Dropdown required', false),
    needFormTag: boolean('Form tag', true),
    idPrefix: text('ID prefix', ''),
    emitCloseEvent: action('Emit close event'),
    addRemoveEvent: action('Add remove event')
  }
});
