import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLabelComponent } from './dynamic-label.component';

describe('DynamicLabelComponent', () => {
  let component: DynamicLabelComponent;
  let fixture: ComponentFixture<DynamicLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicLabelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLabelComponent);
    component = fixture.componentInstance;
    component.field = {
      key: 'testId',
      type: 'rbn-label',
      templateOptions: {
        label: 'testLabel'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
