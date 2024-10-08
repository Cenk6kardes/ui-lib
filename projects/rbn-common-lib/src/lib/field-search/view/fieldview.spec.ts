import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { SearchCriteriaModule } from '../search-criteria.module';
import { FieldViewComponent } from './fieldview.component';
import { HttpLoaderFactory } from '../../shared/http-loader';

describe('FieldViewComponent', () => {
  let component: FieldViewComponent;
  let fixture: ComponentFixture<FieldViewComponent>;
  const mockData: any = [
    {
      fieldId: 'fieldId',
      ruleValue: 'ruleValue',
      operator: 'operator',
      values: ['values']
    }
  ];
  const mockheader: any = {
    data: {
      isvisible: true
    },
    data2: {
      isvisible: true
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldViewComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        SearchCriteriaModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldViewComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.header = mockheader;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showOperator = true when type = "condExpression" ', () => {
    component.type = 'condExpression';
    component.ngOnInit();
    expect(component.showOperator).toBeTrue();
  });

  it('should set showOperator == true when type == "incidentExpression" ', () => {
    component.type = 'incidentExpression';
    component.ngOnInit();
    expect(component.showOperator).toBeTrue();
  });

  it('should return "=" when calling findDataType ', () => {
    const row = {
      dataType: 'integer',
      comparison: 'equals'
    };
    component.findDataType(row);
    expect(component.findDataType(row)).toEqual('=');
  });
});
