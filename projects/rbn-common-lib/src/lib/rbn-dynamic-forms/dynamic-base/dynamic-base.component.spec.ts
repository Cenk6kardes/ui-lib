import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicBaseComponent } from './dynamic-base.component';

describe('DynamicBaseComponent', () => {
  let component: DynamicBaseComponent;
  let fixture: ComponentFixture<DynamicBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicBaseComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
