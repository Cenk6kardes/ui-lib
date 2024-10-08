import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RbnMessageService } from '../../../services/rbn-message.service';

@Component({
  selector: 'rbn-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnChanges {

  @Input() fileUploadName = '';
  @Input() fileSizeSupport: number;
  @Input() fileTypeSupport: Array<string>; // support all type if fileTypeSupport is undefined or empty array
  @Input() resetFile: boolean;
  @Input() removeDefaultSizeSupport: boolean; // not using defaultSizeSupport if fileSizeSupport is undefined
  @Input() confirmOnRemoveFile = false;
  @Input() showDownloadBtn = false;

  @Output() files = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() progress = new EventEmitter();
  @Output() btnClear = new EventEmitter();

  translateResults: any = {};
  noteSupport = '';
  defaultSizeSupport = 10;

  selectedFile: File | null;
  progressLoading = 0 as any;
  isShowConfirmDialog = false;
  fileData: File;

  @ViewChild('filePropRef', { static: false }) filePropRef: ElementRef;
  @ViewChild('filePropBtn', { static: false }) filePropBtn: ElementRef;
  @ViewChild('buttonClear', { static: false }) buttonClear: ElementRef;

  constructor(
    private translate: TranslateService,
    private messageService: RbnMessageService
  ) {
    this.translate.get('FILE_UPLOAD').subscribe(res => {
      this.translateResults = res || {};
    });
  }

  cloneFile(file: File): Observable<File> {
    if (!(file && file instanceof File)) {
      return of(null);
    }
    const reader = new FileReader();
    const stream$ = fromEvent(reader, 'loadend');
    reader.readAsArrayBuffer(file);
    return stream$.pipe(
      map(() => {
        const blob = new Blob([reader.result]);
        return new File([blob], file.name);
      })
    );
  }

  onSelectFile(event: Event | any) {
    this.fileData = event.files[0];
    this.cloneFile(event.files[0]).subscribe({
      next: file => {
        const isValidType = this.checkFileType(file.name);
        const isValidSize = this.checkFileSize(file.size);

        if (isValidSize && isValidType) {
          this.selectedFile = file;
          this.files.emit(file);
          this.uploadFilesSimulator();
        } else {
          const invalidType = this.translateResults.INVALID_TYPE;
          const invalidSize = this.translateResults.INVALID_SIZE.replace('{0}', this.fileSizeSupport);
          const errorMessage = !isValidType ? invalidType : invalidSize;
          this.messageService.showError(errorMessage);

          this.clearFile();
          this.filePropRef.nativeElement.value = '';
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.removeDefaultSizeSupport) {
      this.fileSizeSupport = undefined;
    } else if (!this.fileSizeSupport) {
      this.fileSizeSupport = this.defaultSizeSupport;
    }
    if (changes.resetFile) {
      this.removeFile();
    }
    this.translate.get('FILE_UPLOAD').subscribe(res => {
      this.translateResults = res || {};
      if (changes?.fileSizeSupport?.currentValue && !this.removeDefaultSizeSupport) {
        this.fileSizeSupport = changes.fileSizeSupport.currentValue;
      }
      if (Array.isArray(this.fileTypeSupport) && this.fileTypeSupport.length > 0 && this.fileSizeSupport) {
        this.noteSupport = this.translateResults.NOTE.replace('{0}', this.fileTypeSupport).replace('{1}', this.fileSizeSupport);
      } else if (Array.isArray(this.fileTypeSupport) && this.fileTypeSupport.length > 0) {
        this.noteSupport = this.translateResults.SUPPORTED_FILE_TYPES.replace('{0}', this.fileTypeSupport);
      } else if (this.fileSizeSupport) {
        this.noteSupport = this.translateResults.SUPPORTED_FILE_SIZE.replace('{0}', this.fileSizeSupport);
      }
    });
  }

  checkFileSize(fileSize: number): boolean {
    if (!this.fileSizeSupport) {
      return true;
    }
    return fileSize <= this.fileSizeSupport * 1024 * 1024 ? true : false;
  }

  checkFileType(fileType: string): boolean {
    if (!this.fileTypeSupport || this.fileTypeSupport.length === 0) {
      return true;
    }
    const regex = /\s*(?:[,]|$)\s*/;
    const validTypeArr = this.fileTypeSupport.map(eachType => (fileType.toLowerCase())
      .endsWith(eachType.split(regex)[0].toLowerCase(), JSON.stringify(fileType).length));
    return validTypeArr.some(Boolean);
  }

  uploadFilesSimulator() {
    const progressInterval = setInterval(() => {
      if (this.progressLoading === 100) {
        this.progress.emit(true);
        this.btnClear.emit(this.buttonClear);
        clearInterval(progressInterval);
        this.buttonClear?.nativeElement?.focus();
      } else {
        this.progressLoading += 20;
      }
    }, 100);
  }

  onShowDialog() {
    this.isShowConfirmDialog = true;
  }

  removeFile(accept: boolean = true) {
    if (accept) {
      this.progress.emit(false);
      this.progressLoading = 0;
      this.clearFile();
      setTimeout(() => {
        const activeEle = this.filePropBtn.nativeElement.ownerDocument.activeElement;
        if (!Array.from(activeEle?.classList).includes('p-dialog-header-close')) {
          this.filePropBtn?.nativeElement?.focus();
        }
      }, 200);
    }
    if (this.confirmOnRemoveFile) {
      this.isShowConfirmDialog = false;
      if (!accept) {
        setTimeout(() => {
          this.buttonClear?.nativeElement?.focus();
        });
      }
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.files.emit(this.selectedFile);
  }

  downloadFile() {
    const blobContent = this.fileData;
    const fileName = this.selectedFile?.name;
    const blob = new Blob([blobContent], { type: blobContent.type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || 'downloadFile';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
