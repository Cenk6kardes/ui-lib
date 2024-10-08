import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLoaderComponent } from '../dialog-loader/dialog-loader.component';
import { RbnCommonLibModule } from '../../../../public_api';
import { withKnobs, boolean } from '@storybook/addon-knobs';


export default {
  title: 'Components/DialogLoader',
  component: DialogLoaderComponent,
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

export const DialogLoader = () => ({
  component: DialogLoaderComponent,
  props: {
    loading: boolean('loading', true)
  }
});
