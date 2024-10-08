import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { KeyCode, KeyEvent } from '../../models/keyboard';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-tree'
})
export class RbnFocusTreeDirective implements AfterViewInit {
  handleEvent = false;
  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.addEvent();
  }

  @HostListener('onNodeExpand')
  handleOnNodeExpand() {
    setTimeout(() => {
      this.addEvent();
    });

  }

  @HostListener('onNodeCollapse')
  handleOnNodeCollapse() {
    setTimeout(() => {
      this.addEvent();
    });
  }

  addEvent() {
    const focusableElements = DomHandler.getFocusableElements(this.elementRef.nativeElement);
    if (focusableElements && focusableElements.length > 0) {
      focusableElements.forEach((el: HTMLElement) => {
        el.addEventListener(KeyEvent.keydown, this.handleKeyDown);
        el.addEventListener(KeyEvent.keyup, this.handleKeyUp);
      });
    }
  }

  handleKeyDown(event) {
    if (event) {
      if (event.currentTarget !== event.target) {
        return;
      }
      if ((event.code === KeyCode.Enter) || (event.code === KeyCode.Space)) {
        if (!this.handleEvent) {
          this.handleEvent = true;
          const togglerEl = event.target.querySelector('.p-tree-toggler');
          if (togglerEl) {
            togglerEl.click();
            event.preventDefault();
          }
        }
      }
    }
  }

  handleKeyUp() {
    this.handleEvent = false;
  }
}

