import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { SearchConfig } from './search-criteria.interface';
import { FieldSearchComponent } from './field-search.component';
import { SearchCriteriaModule } from './search-criteria.module';
import { TranslateModule } from '@ngx-translate/core';

describe('FieldSearchComponent', () => {
  let component: FieldSearchComponent;
  let fixture: ComponentFixture<FieldSearchComponent>;

  const searchConfig: SearchConfig = {
    buttonOptions: {},
    parameterField: {
      label: 'parameterField',
      name: 'parameterField'
    },
    expressionField: {
      label: 'expressionField',
      name: 'expressionField'
    },
    valuesField: {
      label: 'valuesField',
      name: 'valuesField'
    },
    otherFields: [{
      label: 'test1',
      name: 'test1'
    }],
    required: true,
    hideLogical: true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldSearchComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule,
        SearchCriteriaModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSearchComponent);
    component = fixture.componentInstance;
    const tmp: Array<any> = [];
    component.searchForm = new FormArray(tmp);
    component.searchConfig = JSON.parse(JSON.stringify(searchConfig));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges when input has no search control', () => {
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    spyOn(component, 'addSearches');
    component.ngOnChanges({ searchConfig: changes });
    expect(component.required).toBeTruthy();
    expect(component.addSearches).toHaveBeenCalled();
  });

  it('should call ngOnChanges ', () => {
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    const group = new FormGroup({});
    (<FormArray>component.searchForm).push(group);
    component.ngOnChanges({ searchConfig: changes });
    expect((<FormArray>component.searchForm).controls.length).toEqual(1);
  });

  it('should call addSearches', () => {
    (<FormArray>component.searchForm).clear();
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    component.ngOnChanges({ searchConfig: changes });
    component.addSearches({
      [component.parameterField.name]: 'parameter',
      [component.expressionField.name]: 'comparison',
      [component.valuesField.name]: 'values'
    });
    expect((<FormArray>component.searchForm).controls.length).toEqual(2);
  });

  it('should call duplicateRow', () => {
    (<FormArray>component.searchForm).clear();
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    component.ngOnChanges({ searchConfig: changes });
    component.duplicateRow(0);
    expect((<FormArray>component.searchForm).controls.length).toEqual(2);
  });

  it('should call duplicateRow', () => {
    (<FormArray>component.searchForm).clear();
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    component.ngOnChanges({ searchConfig: changes });
    component.removeSearch(0);
    expect((<FormArray>component.searchForm).controls.length).toEqual(0);
  });

  it('should call resetSearch', () => {
    (<FormArray>component.searchForm).clear();
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    const group = new FormGroup({
      [searchConfig.parameterField.name]: new FormControl('test')
    });
    (<FormArray>component.searchForm).push(group);
    component.ngOnChanges({ searchConfig: changes });
    let value = (<FormGroup>(<FormArray>component.searchForm).controls[0]).value;
    expect(value[component.parameterField.name]).toBe('test');
    component.resetSearch();
    value = (<FormGroup>(<FormArray>component.searchForm).controls[0]).value;
    expect(value[component.parameterField.name]).toEqual(null);
  });

  it('should call clearExpressions', () => {
    const searchCriteria: any = {
      clearExpressions: jasmine.createSpy('clearExpressions')
    };
    component.searchCriteria = searchCriteria;
    component.clearExpressions();
    expect(component.searchCriteria.clearExpressions).toHaveBeenCalled();
  });

  it('should call checkButton', () => {
    component.checkButton('test');
    expect(component.enableButton).toBeTruthy();
  });

  it('should have add button', () => {
    const changes: SimpleChange = new SimpleChange(null, searchConfig, false);
    component.ngOnChanges({ searchConfig: changes });
    component.enableButton = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.protect-query-builder--row.new .p-button'));
    if (el) {
      expect(el.nativeElement).toBeTruthy();
      spyOn(component, 'addSearches');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(component.addSearches).toHaveBeenCalled();
    }
  });
});
