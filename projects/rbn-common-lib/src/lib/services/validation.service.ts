import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { StepperTabComponent } from '../components/stepper/stepper-tab/stepper-tab.component';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private onstepperNext$: Subject<string[]> = new Subject<string[]>();

  /**
   * Checks if a step is valid by querying the steps HTML for invalid controls.
   *
   * @param step the step to validate
   * @returns true if the step is valid, false otherwise
   */
  isStepValid(step: StepperTabComponent): boolean {
    const invalidControls: string[] = [];
    if (!step && !step?.elementRef) {
      return;
    }
    const controls = step?.elementRef?.nativeElement?.querySelectorAll('.ng-invalid');
    if (!controls) {
      return;
    }

    controls.forEach(control => {
      const controlName = control.getAttribute('formcontrol') || control.getAttribute('formcontrolname');
      if (controlName) {
        invalidControls.push(controlName);
      }
    });
    this.onStepperNext(invalidControls);
    return invalidControls?.length === 0;
  }

  /**
   * Broadcasts a list of all invalid controls to listening form control
   * validation directives to show error messages
   *
   * @param invalidControls list containing the names of all invalid controls
   */
  private onStepperNext(invalidControls: string[]) {
    if (invalidControls.length) {
      this.onstepperNext$.next(invalidControls);
    }
  }

  /**
   * Used by the form control validation directives to subscribe to
   * on stepper next events
   *
   * @returns the on stepper next observable
   */
  getStepperNext() {
    return this.onstepperNext$.asObservable();
  }
}
