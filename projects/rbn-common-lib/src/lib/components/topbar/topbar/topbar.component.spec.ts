import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TopbarComponent } from './topbar.component';
import { TopbarModule } from '../topbar.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let originalTimeout: number;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;
  const router = {navigate: jasmine.createSpy('navigate')};
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
      declarations: [ TopbarComponent ],
      providers: [
        {provide: Router, useValue: router}
      ],
      imports: [
        TopbarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    translateSevice = TestBed.inject(TranslateService);
    http = TestBed.inject(HttpTestingController);
    if (translateSevice) {
      translateSevice.setDefaultLang('en');
      if (http) {
        http.expectOne('./assets/i18n/en.json').flush({
        });
        http.expectOne('./assets/i18n/rbn_en.json').flush({
        });
      }
    }
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    component.topBar = {
      logo: {
        action: '',
        image: ''
      },
      toogleButton: {
        action: '',
        icon: ''
      },
      userInfo: {
        label: '',
        name: '',
        email: '',
        image: '',
        lastLogin: '',
        model: []
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cal showLogininfo emit', () => {
    spyOn(component.showLoginInfo, 'emit');
    component.showLastLogin();
    expect(component.showLoginInfo.emit).toHaveBeenCalled();
  });
});
