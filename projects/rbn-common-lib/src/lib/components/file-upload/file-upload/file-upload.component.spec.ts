import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { RbnMessageService } from '../../../services/rbn-message.service';
import { FileUploadModule } from '../file-upload.module';

import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let originalTimeout: number;
  let http: HttpTestingController | undefined;
  let translateService: TranslateService | undefined;

  const rbnMessageService = jasmine.createSpyObj('RbnMessageService', ['showError']);

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
    translateService = undefined;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [
        HttpClientTestingModule,
        FileUploadModule
      ],
      providers: [
        MessageService,
        { provide: RbnMessageService, useValue: rbnMessageService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (translateService) {
      translateService.addLangs(['en']);
      translateService.setDefaultLang('en');
      if (http) {
        http.expectOne('./assets/i18n/en.json').flush({
          'FILE_UPLOAD': {
            'NOTE': '* Supported file types: .{0}( up to {1}MB)',
            'TITLE_DRAG_DROP': 'Drag and Drop file here',
            'OR': 'or',
            'BROWSER_FOR_FILE': 'Browse for file',
            'INVALID_SIZE': 'Please enter file from 0MB to {0}MB',
            'INVALID_TYPE': 'This type file is not support',
            'UPLOADED_FILE': 'Uploaded File',
            'SIZE': 'Size :',
            'SUPPORTED_FILE_TYPES': '* Supported file types: {0}',
            'SUPPORTED_FILE_SIZE': '(up to {0}MB)'
          }
        });
        http.expectOne('./assets/i18n/rbn_en.json').flush({
          CALENDAR: {}
        });
      }
    }
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.fileData = {
      name: 'image.png', type:'image/png'
    } as File;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    component.ngOnChanges({
      fileSizeSupport: new SimpleChange(null, 10, true)
    });
    expect(component.fileSizeSupport).toEqual(10);
  });

  it('should call onSelectFile with invalid type', () => {
    component.fileSizeSupport = 10;
    component.fileTypeSupport = ['image/png', 'image/jpeg'];
    component.translateResults.INVALID_TYPE = 'This type file is not support';
    component.translateResults.INVALID_SIZE = 'Please enter file from 0MB to {0}MB';
    const event = {
      files: [getHugeFile('name', 12345, 'image/png')]
    };
    component.onSelectFile(event);
    expect(component.filePropRef.nativeElement.value).toEqual('');
  });

  it('should call onSelectFile with invalid size', () => {
    component.fileSizeSupport = 1;
    component.fileTypeSupport = ['image/png', 'image/jpeg'];
    component.translateResults.INVALID_TYPE = 'This type file is not support';
    component.translateResults.INVALID_SIZE = 'Please enter file from 0MB to {0}MB';
    const event = {
      files: [getHugeFile('name', 12345111, 'image/png, image/jpeg')]
    };
    component.onSelectFile(event);
    expect(component.filePropRef.nativeElement.value).toEqual('');
  });

  it('should call onSelectFile with invalid size and size', () => {
    component.fileSizeSupport = 1;
    component.fileTypeSupport = ['image/png', 'image/jpeg'];
    component.translateResults.INVALID_TYPE = 'This type file is not support';
    component.translateResults.INVALID_SIZE = 'Please enter file from 0MB to {0}MB';
    const event = {
      files: [getHugeFile('name', 12345111)]
    };
    component.onSelectFile(event);
    expect(component.filePropRef.nativeElement.value).toEqual('');
  });

  it('should call checkFileType with fileTypeSupport null', () => {
    component.fileTypeSupport = [];
    const event = [{
      name: 'name',
      size: 12345111111,
      type: 'image/png'
    }];
    const rs = component.checkFileType(event[0].name);
    expect(rs).toBeTrue();
  });

  it('should call checkFileType with file type null', () => {
    component.fileTypeSupport = ['image/png', 'image/jpeg'];
    const event = [{
      name: 'name',
      size: 12345111111,
      type: null
    }];
    const rs = component.checkFileType(event[0].name);
    expect(rs).toBeFalse();
  });

  it('should call progress when call uploadFilesSimulator true', (done) => {
    spyOn(component.progress, 'emit');
    component.progressLoading = 100;
    component.uploadFilesSimulator();
    setTimeout(() => {
      expect(component.progress.emit).toHaveBeenCalled();
      done();
    }, 120);
  });

  it('should set progressLoading +20 when call uploadFilesSimulator false', (done) => {
    component.progressLoading = 1000;
    component.uploadFilesSimulator();
    setTimeout(() => {
      expect(component.progressLoading).toEqual(1020);
      done();
    }, 120);
  });

  it('should call onShowDialog', () => {
    component.onShowDialog();
    expect(component.isShowConfirmDialog).toBeTrue();
  });

  it('should call removeFile with true case', () => {
    spyOn(component, 'clearFile');
    component.confirmOnRemoveFile = true;
    component.removeFile(true);
    expect(component.progressLoading).toEqual(0);
    expect(component.clearFile).toHaveBeenCalled();
    expect(component.isShowConfirmDialog).toBeFalse();
  });

  it('should call clearFile', () => {
    spyOn(component.files, 'emit');
    component.clearFile();
    expect(component.selectedFile).toBeNull();
    expect(component.files.emit).toHaveBeenCalled();
  });

  it('should return null', () => {
    const file: any = {};
    const value = component.cloneFile( file ).subscribe( result => {
      expect(result).toBeFalsy();
    });
  });

  it('should download file', () => {
    const blobContent = {name: 'image.png', type:'image/png'};
    component.downloadFile();
    expect(blobContent).toEqual(component.fileData);
  });

  function getHugeFile(name: string, size: number, fileType?: string): File {
    const blob = new Blob(['a'.repeat(size)], { type: fileType });
    const file = new File([blob], name, { type: fileType });
    return file;
  }
});
