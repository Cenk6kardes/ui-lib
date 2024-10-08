import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicBaseComponent } from '../dynamic-base/dynamic-base.component';

@Component({
  selector: 'rbn-dynamic-file-uploads',
  templateUrl: './dynamic-file-uploads.component.html'
})
export class DynamicFileUploadsComponent extends DynamicBaseComponent {

  @Input() selectedFile: FileList | null;;
  @Output() handleFileInput1 = new EventEmitter();
  fileData: FileList;
  @Output() files = new EventEmitter();
  fileUploadName: any = '';
  constructor() {
    super();
  }
  handleFileInput(files: FileList): void {
    this.fileData = files;
    this.files.emit(files);
  }
  progressInfo(event: any): void {
    console.log('progressInfo', event);
  }
}
