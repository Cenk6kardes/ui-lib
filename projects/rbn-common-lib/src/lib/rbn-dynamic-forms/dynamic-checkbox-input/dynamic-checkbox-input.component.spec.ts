import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DynamicCheckboxInputComponent } from './dynamic-checkbox-input.component';

describe('DynamicCheckboxInputComponent', () => {
  let component: DynamicCheckboxInputComponent;
  let fixture: ComponentFixture<DynamicCheckboxInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicCheckboxInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCheckboxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
