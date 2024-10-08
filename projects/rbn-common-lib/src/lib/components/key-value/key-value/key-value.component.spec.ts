import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import { KeyValueModule } from '../key-value.module';
import { KeyValueComponent } from './key-value.component';

describe('KeyValueComponent', () => {
  let component: KeyValueComponent;
  let fixture: ComponentFixture<KeyValueComponent>;

  let translateService: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  let originalTimeout: number;

  const fb: FormBuilder = new FormBuilder();

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        KeyValueModule
      ],
      declarations: [KeyValueComponent],
      providers: [
        { provide: FormBuilder, useValue: fb }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueComponent);
    component = fixture.componentInstance;
    component.keyValueForm = fb.group({
      'mappings': fb.array([fb.group
      ({
        key_root: '',
        valuePair_root: ''
      })
      ])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectedOptionEvent', () => {
    const stubValue = null;
    component.selectedOptionEvent(stubValue);
    expect(component.selectedOption).toEqual(stubValue);
  });

  it('should call onBlurInput', () => {
    spyOn(component.addRemoveEvent, 'emit');
    component.onBlurInput();
    expect(component.addRemoveEvent.emit).toHaveBeenCalled();
  });

  it('should call addConfigBlock', () => {
    spyOn(component.addRemoveEvent, 'emit');
    const form = fb.group({
      'mappings': fb.array([fb.group
      ({
        key_root: '',
        valuePair_root: ''
      })
      ])
    });
    component.addConfigBlock();
    expect(component.addRemoveEvent.emit).toHaveBeenCalled();
  });

  it('should call removeConfigBlock', () => {
    spyOn(component.addRemoveEvent, 'emit');
    const test = new FormGroup({
      'mappings': new FormArray([
        new FormControl('key'),
        new FormControl('value')
      ])
    });
    component.keyValueForm = test;
    component.removeConfigBlock(0);
    expect(component.addRemoveEvent.emit).toHaveBeenCalled();
  });
});
