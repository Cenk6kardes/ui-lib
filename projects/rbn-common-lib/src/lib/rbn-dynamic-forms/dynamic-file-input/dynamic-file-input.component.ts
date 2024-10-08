import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'rbn-dynamic-file-input',
  templateUrl: './dynamic-file-input.component.html',
  styleUrls: ['./dynamic-file-input.component.scss']
})
export class DynamicFileInputComponent extends FieldType implements OnInit {

  fileName: string;
  @ViewChild('file', { static: false }) fileEl: ElementRef;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.model[this.key as string] && this.model[this.key as string].name) {
      this.fileName = this.model[this.key as string].name;
    }
  }

  handleFileInput(files: FileList) {
    if (files) {
      this.fileName = (files.item(0) && files.item(0).name) || undefined;
      this.model[this.key as string] = files;
    }
    if (this.props && this.props.onChange) {
      this.props.onChange(files);
    }
  }
  removeFile() {
    if (this.fileEl) {
      this.fileEl.nativeElement.value = null;
    }
    this.model[this.key as string] = undefined;
    this.fileName = undefined;
    this.options.updateInitialValue();
    if (this.props && this.props.onRemove) {
      this.props.onRemove();
    }
  }

  clickInput() {
    if (this.fileEl) {
      this.fileEl.nativeElement.click();
    }
  }

}
