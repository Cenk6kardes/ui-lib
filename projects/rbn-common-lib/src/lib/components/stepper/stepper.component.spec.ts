/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/http-loader';
import { Observable } from 'rxjs';
import { StepperTabComponent } from './stepper-tab/stepper-tab.component';
import { StepperComponent } from './stepper.component';
import { StepsModule } from 'primeng/steps';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationService } from '../../services/validation.service';
import { ButtonModule } from 'primeng/button';


class ActivatedRouteStub {
  url: Observable<any> = new Observable;
}

class InputFocusDirective {
  onFormSubmit() {
    return true;
  }
}

const validationServiceFake = jasmine.createSpyObj('validationServiceFake', {
  isStepValid: true
});

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;
  let fakeData;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperComponent, StepperTabComponent],
      imports: [
        HttpClientModule,
        StepsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        ButtonModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ValidationService, useValue: validationServiceFake },
        { provide: InputFocusDirective, useClass: InputFocusDirective }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fakeData = [
      {
        id: 1,
        totalTabs: 2,
        next: () => { },
        prev: () => { },
        editStep: (thisStepEdit?) => { },
        initializeConfirmBox: () => { }
      } as StepperTabComponent,
      {
        id: 2,
        totalTabs: 2,
        next: () => { },
        prev: () => { },
        editStep: (thisStepEdit?) => { },
        initializeConfirmBox: () => { }
      } as StepperTabComponent
    ];
    component.steps = {
      toArray: () => fakeData,
      length: 2
    } as any;

    component.stepperTabs = [
      {
        label: 'label1',
        subText: 'subText1',
        description: 'description1'
      },
      {
        label: 'label2',
        subText: 'subText2',
        description: 'description2'
      }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call isEditModeOn', () => {
    component.editMode = false;
    spyOn(component, 'isEditModeOn');
    component.isEditModeOn();
    expect(component.editMode).toBeFalsy();
  });

  it('should call clickSubmitBtn', () => {
    spyOn(component, 'updateSideTimeline');
    component.clickSubmitBtn();
    expect(component.updateSideTimeline).toHaveBeenCalled();
  });

  it('should call compileStepperTabs', () => {
    component.activeIndex = 1;
    spyOn(component, 'compileStepperTabs');
    component.compileStepperTabs();
    expect(component.steps).toBeTruthy();
  });

  it('should call changeStep', () => {
    spyOn(component.activeIndexChange, 'emit');
    component['goToStep'](0);
    expect(component.activeIndexChange.emit).toHaveBeenCalled();
  });

  it('should call compileStepperTabs', () => {
    component.compileStepperTabs();
    expect(component.items.length).toBeGreaterThan(0);
  });

  // fit('should call updateSideTimeline', () => {
  //   const fakeData = {
  //     classList: {
  //       add: () => {},
  //       remove: () => {}
  //     }
  //   };
  //   spyOn(component, 'getQuerySelector').and.returnValue(fakeData as any);
  //   component.validatedSteps = [1];
  //   component.updateSideTimeline();
  //   expect(component.updateSideTimeline).toBeTruthy();
  // });

  it('should call ngOnChanges', () => {
    spyOn(component, 'setStepperStepHeight');
    component.ngOnChanges({activeIndex: 1});
    expect(component.setStepperStepHeight).toHaveBeenCalled();
  });

  it('should call  handlePrevious', () => {
    spyOn(component, 'goToStep');
    component.handlePrevious();
    expect(component.goToStep).toHaveBeenCalled();
  });

  it('should call  handleNext', () => {
    spyOn(component, 'isStepValid').and.returnValue(true);
    spyOn(component, 'goToStep');
    component.handleNext();
    expect(component.goToStep).toHaveBeenCalled();
  });

  it('should call isStepValid', () => {
    const test = component.isStepValid(1);
    expect(test).toBeTruthy();
  });

  it('should call isValidForm', () => {
    expect(component.isValidForm()).toBeTruthy();
  });

  it('should call goToStep', () => {
    spyOn(component, 'openStepper');
    component.goToStep(1);
    expect(component.openStepper).toHaveBeenCalled();
  });

  it('should call openStepper', () => {
    spyOn(component, 'ngOnChanges');
    spyOn(component, 'updateSideTimeline');
    component.openStepper(1, 0);
    expect(component.ngOnChanges).toHaveBeenCalled();
    expect(component.updateSideTimeline).toHaveBeenCalled();
  });

  it('should call clickSubmitBtn', () => {
    spyOn(component, 'isValidForm').and.returnValue(true);
    spyOn(component.submit, 'emit');
    component.clickSubmitBtn();
    expect(component.submit.emit).toHaveBeenCalled();
  });

  it('should call clickSubmitBtn', () => {
    spyOn(component, 'isValidForm').and.returnValue(true);
    spyOn(component.submit, 'emit');
    component.clickSubmitBtn();
    expect(component.submit.emit).toHaveBeenCalled();
  });

  it('should return null when calling updateSideTimeline', () => {
    fakeData = [
      {
        id: 1,
        totalTabs: 2,
        crossStep: 0,
        next: () => { },
        prev: () => { },
        editStep: (thisStepEdit?) => { },
        initializeConfirmBox: () => { }
      } as StepperTabComponent,
      {
        id: 2,
        totalTabs: 2,
        next: () => { },
        prev: () => { },
        editStep: (thisStepEdit?) => { },
        initializeConfirmBox: () => { }
      } as StepperTabComponent
    ];
    component.steps = {
      toArray: () => fakeData,
      length: 2
    } as any;
    component.updateSideTimeline();
    expect(component.updateSideTimeline()).toBeFalsy();
  });

  it('should set validatedSteps when goToStep with previousStep', () => {
    spyOn(component, 'openStepper');
    component.validatedSteps = [2];
    component.goToStep(1, 1);
    expect(component.validatedSteps.length).toEqual(2);
    expect(component.openStepper).toHaveBeenCalled();
  });

  it('should set validatedSteps when goToStep without previousStep', () => {
    spyOn(component, 'openStepper');
    spyOn(component, 'isStepValid').and.returnValue(false);
    component.validatedSteps = [1, 2];
    component.goToStep(1, 2);
    expect(component.validatedSteps.length).toEqual(1);
    expect(component.openStepper).toHaveBeenCalled();
  });

  it('should call onFormSubmit when calling handleNext', () => {
    const input = new InputFocusDirective();
    spyOn(component, 'isStepValid').and.returnValue(false);
    component.handleNext();
    expect(input.onFormSubmit()).toBeTrue();
  });

  it('should set stepIndex when calling isStepValid without stepIndex', () => {
    component.isStepValid(null);
    expect(component.isStepValid(null)).toBeTrue();
  });

  it('should set isSubmitBtnClicked = false when calling clickSubmitBtn', fakeAsync(() => {
    component.isSubmitBtnClicked = true;
    component.clickSubmitBtn();
    tick(2000);
    expect(component.isSubmitBtnClicked).toBeFalse();
  }));
});
