import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { array, number, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { RbnCommonLibModule } from '../../../../public_api';
import { FileUploadComponent } from './file-upload.component';

export default {
  title: 'Components/FileUpload',
  component: FileUploadComponent,
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

export const FileUpload = () => {
  const fileSizeSupport = 10;
  const fileTypeSupport = ['xml', '.png'];
  const removeDefaultSizeSupport = false;

  return {
    template: `<rbn-file-upload 
      [fileSizeSupport]="fileSizeSupport" 
      [fileTypeSupport]="fileTypeSupport" 
      [removeDefaultSizeSupport]="removeDefaultSizeSupport"
      [showDownloadBtn]="true"></rbn-file-upload>
      <rbn-message-toggle></rbn-message-toggle>`,
    props: {
      fileSizeSupport,
      fileTypeSupport,
      removeDefaultSizeSupport
    }
  };
};
