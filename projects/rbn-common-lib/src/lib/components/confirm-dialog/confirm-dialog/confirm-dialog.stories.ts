import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { RbnCommonLibModule } from '../../../../public_api';
import { ConfirmDialogComponent } from './confirm-dialog.component';



export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialogComponent,
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

export const confirmDialog = () => {
  const titleTest = 'Delete Confirmation';
  const contentTest = 'Are you sure that you want to delete <b>dsaini</b>?';
  const titleCancel = 'No';
  const titleConfirm = 'Yes';

  return {
    template: `<rbn-confirm-dialog 
      [title]="titleTest" 
      [content]="contentTest" 
      [titleAccept]="titleConfirm" 
      [titleReject]="titleCancel" 
      (emitConfirm)="testEvOnConfirm($event)">
    </rbn-confirm-dialog>`,
    props: {
      titleTest,
      contentTest,
      titleCancel,
      titleConfirm,
      testEvOnConfirm: action('Confirm Action')
    }
  };
};
