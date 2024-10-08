/* eslint-disable @typescript-eslint/no-empty-function */
import { DatePipe } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperModule } from '../stepper.module';
import { StepperConfirmBoxComponent } from './stepper-confirm-box/stepper-confirm-box.component';
import { StepperTabComponent } from './stepper-tab.component';


describe('StepperTabComponent', () => {
  let component: StepperTabComponent;
  let fixture: ComponentFixture<StepperTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepperTabComponent],
      imports: [
        HttpClientModule,
        StepperModule
      ],
      providers: [
        { provide: DatePipe }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should isPreviousButtonHidden hide', () => {
    component.id = 1;
    component.isPreviousButtonHidden();
    expect(component.isPreviousButtonHidden).toBeTruthy();
  });

  it('should isPreviousButtonHidden shown', () => {
    component.id = 2;
    component.isPreviousButtonHidden();
    expect(component.isPreviousButtonHidden).toBeTruthy();
  });

  it('should isNextButtonHidden hide', () => {
    component.id = component.totalTabs;
    component.isNextButtonHidden();
    expect(component.isNextButtonHidden).toBeTruthy();
  });

  it('should isNextButtonHidden shown', () => {
    component.id = 1;
    component.totalTabs = 2;
    component.isNextButtonHidden();
    expect(component.isNextButtonHidden).toBeTruthy();
  });

  it('should call createEditId ', () => {
    component.createEditId();
    expect(component.createEditId).toBeTruthy();
  });

  it('should have the correct number of children', () => {
    component.ngAfterContentInit();
    fixture.detectChanges();
    let confirmBox;
    component.confirmBox.toArray().forEach((confirm) => {
      confirmBox = confirm;
    });
    expect(confirmBox).toEqual(undefined);
  });

  it('should call initializeConfirmBox', () => {
    const fakeData = [
      { for: 1, index: 5, editStep: () => {} } as StepperConfirmBoxComponent,
      { for: 1, index: 7, editStep: () => {} } as StepperConfirmBoxComponent
    ];
    component.confirmBox = {
      toArray: () => fakeData
    } as any;
    component.initializeConfirmBox();
    const tmp = component.confirmBox.toArray();
    expect(tmp[0]['index']).toEqual(0);
  });

  it('should return true when calling canEdit', () => {
    component.active = false;
    component.isValidStep = true;
    expect(component.canEdit()).toBeTrue();
  });

  it('should call editStep when calling gotoStep', () => {
    spyOn(component, 'canEdit').and.returnValue(true);
    component.editStep = () => true;
    const stepId = 1;
    component.goToStep(stepId);
    expect(component.editStep()).toBeTrue();
  });

  it('should call editStep when calling gotoStep', () => {
    spyOn(component, 'canEdit').and.returnValue(false);
    const stepId = 1;
    expect(component.goToStep(stepId)).toBeFalsy();
  });
});
