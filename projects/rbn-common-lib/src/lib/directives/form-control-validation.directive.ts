import {
  ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Host, Input, OnChanges,
  OnDestroy, OnInit, Optional, Self, SimpleChanges, ViewContainerRef, Renderer2, AfterViewInit
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FieldErrorComponent } from '../components/stepper/field-error/field-error.component';
import { ScreenReaderService } from '../services/screen-reader.service';
import { ValidationService } from '../services/validation.service';
import { WcagService } from '../services/wcag.service';
import { FormGroupValidationDirective } from './form-group-validation.directive';
import { InputFocusDirective } from './input-focus.directive';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formControl], [formControlName]',
  providers: [InputFocusDirective]
})
export class FormControlValidationDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('no-custom-validation') noValidation: boolean;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('fieldError') manualFieldError: FieldErrorComponent;
  private fieldError: ComponentRef<FieldErrorComponent>;
  private validationMessages: any;
  private onStepperNext$: Observable<string[]>;
  private onSubmit$: Observable<Event>;
  isAnnouceError = false;
  previousError = '';

  constructor(@Self() public control: NgControl,
    @Host() @Optional() private fgValidationDirective: FormGroupValidationDirective,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private validationService: ValidationService,
    private screenReader: ScreenReaderService,
    private elRef: ElementRef,
    private inputFocus: InputFocusDirective,
    private render: Renderer2,
    private wcagService: WcagService) { }

  ngOnInit() {
    if (this.isValidationEnabled()) {
      this.initializeData();
      this.onValueChanges();
      this.onStepperNext();
      this.onSubmit();
    }
  }

  ngAfterViewInit(): void {
    if (this.isValidationEnabled()) {
      this.handleFocusOnControl();
    }
  }

  /**
   * Checks for no-custom-validation flag changes. If validation was previously
   * disabled and the control validation data hasn't been initialized, the data is
   * initialized and the control is validated.
   */
  ngOnChanges(changes: SimpleChanges) {
    const validationFlag = changes['noValidation'];
    if (!validationFlag) {
      return;
    }
    if (!validationFlag.isFirstChange() && validationFlag.previousValue === true && this.dataNotInitialized()) {
      this.initializeData();
      this.onValueChanges();
      this.onStepperNext();
      this.onSubmit();
    }
    this.validateControl();
  }

  ngOnDestroy() {
    if (this.fieldError) {
      this.fieldError.destroy();
    }
  }

  /**
   * Checks if the form control no-custom-validation flag was provided or not.
   * By default, form control validation is enabled unless specified otherwise.
   * If the parent form group no-custom-validation flag is set, validation for
   * the form control is disabled.
   *
   * @returns true if the form group validation is enabled, false otherwise
   */
  isValidationEnabled(): boolean {
    return this.fgValidationDirective?.isValidationEnabled() && (this.noValidation === undefined || this.noValidation === false);
  }

  /**
   * Initializes the form control validation messages, on stepper next and on submit
   * observables. Validation messages and on submit observable are fetched from the
   * parent form group, through the FormGroupValidationDirective.
   */
  initializeData() {
    if (this.fgValidationDirective) {
      const fgValidationMessages = this.fgValidationDirective.validationMessages;
      if (fgValidationMessages) {
        this.validationMessages = fgValidationMessages[this.control.name];
      }
      this.onStepperNext$ = this.validationService.getStepperNext();
      this.onSubmit$ = this.fgValidationDirective.onSubmit$;
    }
  }

  /**
   * Checks whether the control validation data has been initialized or not
   *
   * @returns true if the control validation data has not been initialized, false otherwise
   */
  dataNotInitialized() {
    return !this.validationMessages && !this.onStepperNext$ && !this.onSubmit$;
  }

  /**
   * Triggers form control validation on value changes
   */
  onValueChanges() {
    this.control.control.valueChanges.subscribe(data => {
      this.validateControl();
    });
  }

  /**
   * Triggers form control validation on stepper next click
   */
  onStepperNext() {
    this.onStepperNext$.subscribe((controls: string[]) => {
      if (controls && controls.includes(this.control.name.toString())) {
        this.validateControl(true);
      }
    });
  }

  /**
   * Triggers form control validation on form submission
   */
  onSubmit() {
    this.onSubmit$.subscribe(event => {
      this.validateControl(true);
    });
  }

  /**
   * Validates the form control
   *
   * @param onSubmit indicates whether the method is called on form submit
   */
  validateControl(onSubmit?: boolean): void {
    this.isAnnouceError = !onSubmit;
    const control = this.control.control;
    if (this.isValidationEnabled() && control.enabled && control.invalid && (onSubmit || control.dirty)) {
      control.markAsDirty({ onlySelf: true });
      this.toggleFieldError(Object.keys(control.errors)[0]);
    } else {
      control.markAsPristine({ onlySelf: true });
      this.toggleFieldError();
    }
  }

  /**
   * Checks if a FieldErrorComponent was supplied. If not, a
   * FieldErrorComponent is dynamically created.
   *
   * @param error the form control error
   */
  toggleFieldError(error?: string) {
    if (this.manualFieldError && !this.manualFieldError.for) {
      this.manualFieldError.for = this.control && this.control.name ? this.control.name.toString() : null;
    }
    if (!this.manualFieldError && !this.fieldError) {
      this.createFieldError();
    }
    this.displayError(error, this.manualFieldError || this.fieldError.instance);
  }

  /**
   * Displays or hides the error message related to the given error
   *
   * @param error the form control error
   * @param fieldError the field error component
   */
  displayError(error: string, fieldError: FieldErrorComponent) {
    if (error && this.validationMessages) {
      fieldError.error = this.validationMessages[error];
    } else {
      fieldError.error = error;
    }
    if (fieldError.error) {
      this.handleAnnouceError(fieldError.error);
    } else {
      this.previousError = '';
    }
  }

  /**
   * Creates a FieldErrorComponent to display error messages
   */
  createFieldError() {
    const factory = this.resolver.resolveComponentFactory(FieldErrorComponent);
    this.fieldError = this.vcr.createComponent(factory);
    this.fieldError.instance.for = this.control && this.control.name ? this.control.name.toString() : null;
  }

  handleAnnouceError(error: string) {
    setTimeout(() => {
      if (this.isAnnouceError && this.previousError !== error) {
        this.previousError = error;
        const field = this.getFocusFiledHasError();
        this.screenReader.announce(field, error);
      }
    }, 100);
  }

  handleFocusOnControl() {
    const field = this.getFocusFiledHasError();
    this.render.listen(field, 'focus', (e) => {
      this.validateControl();
    });
    this.render.listen(field, 'focusout', (e) => {
      this.previousError = '';
    });
  }

  getFocusFiledHasError() {
    let field = this.elRef.nativeElement;
    if (field?.type === 'hidden') {
      field = field.previousSibling;
    }
    return this.wcagService.getFocusableElm(field);
  }
}
