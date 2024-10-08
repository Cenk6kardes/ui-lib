import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';

import { KeyValueDropdownComponent } from './key-value-dropdown.component';
import { KeyValueDropdownModule } from '../key-value-dropdown.module';

describe('KeyValueDropdownComponent', () => {
  let component: KeyValueDropdownComponent;
  let fixture: ComponentFixture<KeyValueDropdownComponent>;

  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  const fb: FormBuilder = new FormBuilder();
  const mapSet = [
    {
      key: 'key',
      value: 'value'
    }
  ];

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
    http = undefined;
    translateSevice = undefined;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        KeyValueDropdownModule
      ],
      declarations: [KeyValueDropdownComponent],
      providers: [
        { provide: FormBuilder, useValue: fb }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueDropdownComponent);
    component = fixture.componentInstance;
    component.keyValueForm = fb.group({
      'mappings': fb.array([])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges is Edit', () => {
    component.isShowEdit = true;
    component.keyName = 'key';
    component.valueName = 'value';
    component.mappingsSet = mapSet;
    component.ngOnChanges();
    expect(component.keyNameDisplay).toEqual(['key']);
  });

  it('should call removeFormFieldBlock', () => {
    spyOn(component.sendMappingList, 'emit');
    component.removeFormFieldBlock(0);
    expect(component.sendMappingList.emit).toHaveBeenCalled();
  });
});
