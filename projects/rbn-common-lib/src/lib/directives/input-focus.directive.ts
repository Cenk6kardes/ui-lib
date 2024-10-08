import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rbn-inputFocus]'
})
export class InputFocusDirective implements  AfterViewInit {

  editable = ['p-dropdown', 'input', 'p-inputswitch', 'p-multiselect', 'p-calendar'];

  constructor(private elRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.focusFirstInput();
  }

  focusFirstInput() {
    const allTags = this.editable.join(', ');
    const input = this.elRef.nativeElement.querySelectorAll(allTags);
    for (const x of input) {
      if ((this.editable.indexOf(x.tagName.toLowerCase()) > -1) &&
        (x.type !== 'hidden' && !x.hasAttribute('hidden') && !x.hasAttribute('readonly'))) {
        setTimeout(r => {
          x.focus();
          x.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
        break;
      }
    }
  }

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.elRef.nativeElement.querySelectorAll('.ng-invalid');
    for (const x of invalidControl) {
      if ((this.editable.indexOf(x.tagName.toLowerCase()) > -1)
        && (x.type !== 'hidden' && !x.hasAttribute('hidden'))) {
        x.focus();
        x.scrollIntoView({ behavior: 'smooth', block: 'end' });
        break;
      } else if (x.type === 'hidden' || x.hasAttribute('hidden')) {
        const nextSibiling = x.nextSibling;
        if (nextSibiling && nextSibiling.tagName &&
          nextSibiling.tagName.toLowerCase() === 'p-fileupload') {
          nextSibiling.focus();
          nextSibiling.scrollIntoView({ behavior: 'smooth', block: 'end' });
          break;
        }
      }
    }
  }

}

