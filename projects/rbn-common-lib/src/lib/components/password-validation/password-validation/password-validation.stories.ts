import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { RbnCommonLibModule } from '../../../../public_api';
import { PasswordValidationModule } from '../password-validation.module';
import { PasswordValidationComponent } from './password-validation.component';

export default {
  title: 'Components/PasswordValidation',
  component: PasswordValidationComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        RbnCommonLibModule,
        PasswordValidationModule,
        BrowserAnimationsModule
      ]
    })
  ]
};

export const PasswordConfirm = () => ({
  component: PasswordValidationComponent
});
