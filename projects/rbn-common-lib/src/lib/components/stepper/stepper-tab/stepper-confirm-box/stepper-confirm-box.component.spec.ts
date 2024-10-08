import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperModule } from '../../stepper.module';
import { StepperConfirmBoxComponent } from './stepper-confirm-box.component';


describe('StepperConfirmBoxComponent', () => {
  let component: StepperConfirmBoxComponent;
  let fixture: ComponentFixture<StepperConfirmBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperConfirmBoxComponent],
      imports: [
        HttpClientModule,
        StepperModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperConfirmBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateId with contentBox', () => {
    component.index = 1;
    expect(component.generateId('contentBox')).toEqual('content' + component.index);
  });

  it('should call generateId with edit', () => {
    component.index = 1;
    expect(component.generateId('edit')).toEqual('editconfirmbox_' + (component.index + 1));
  });

  it('should call generateId with any value', () => {
    component.index = 1;
    expect(component.generateId('')).toEqual(undefined);
  });
});
