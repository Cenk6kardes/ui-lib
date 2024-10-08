import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { StepperModule } from '../stepper.module';
import { FieldErrorComponent } from './field-error.component';

import { ScreenReaderService } from '../../../services/screen-reader.service';
import { HttpClientModule } from '@angular/common/http';

describe('FieldErrorComponent', () => {
  let component: FieldErrorComponent;
  let fixture: ComponentFixture<FieldErrorComponent>;

  const screenReaderService = jasmine.createSpyObj('screenReaderService', ['announce']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldErrorComponent ],
      imports: [
        StepperModule,
        HttpClientModule
      ],
      providers: [
        { provide: ScreenReaderService, useValue: screenReaderService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    spyOn(component, 'announceErrorMessage');
    spyOn(component, 'removeEleErrorFocusListener');
    const changes = {
      error: new SimpleChange(null, 'Required', false),
      for: new SimpleChange(null, 'name', false)
    };
    component.ngOnChanges(changes);
    expect(component.announceErrorMessage).toHaveBeenCalled();
    component.ngOnChanges({});
    expect(component.removeEleErrorFocusListener).toHaveBeenCalled();
  });

  it('should call detailView', () => {
    spyOn(component.viewMore, 'emit');
    component.detailView();
    expect(component.viewMore.emit).toHaveBeenCalledWith(true);
  });

  it('should call announceErrorMessage', () => {
    component.eleError = document.createElement('input');
    component.error = 'Required';
    component.announceErrorMessage();
    setTimeout(() => {
      expect(screenReaderService.announce).toHaveBeenCalled();
    }, 200);
  });
});
