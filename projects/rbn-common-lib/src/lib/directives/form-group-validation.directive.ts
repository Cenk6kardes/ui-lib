import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formGroup]'
})
export class FormGroupValidationDirective implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('no-custom-validation') noValidation: boolean;
  @Input() validationMessages: any;
  onSubmit$: Observable<Event>;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    if (this.isValidationEnabled()) {
      this.initializeData();
    }
  }

  /**
   * Checks if the form group no-custom-validation flag was provided or not.
   * By default, form group validation is enabled unless specified otherwise.
   * @author sghamra
   *
   * @returns true if the form group validation is enabled, false otherwise
   */
  isValidationEnabled(): boolean {
    return this.noValidation === undefined;
  }

  /**
   * Initializes the form group on submit observable.
   * @author sghamra
   */
  initializeData() {
    this.onSubmit$ = fromEvent(this.elementRef.nativeElement, 'submit');
  }
}
