import { AfterViewInit, Directive, HostListener, Output, Renderer2, EventEmitter } from '@angular/core';

import { Dropdown } from 'primeng/dropdown';

import { KeyCode, KeyEvent } from '../../models/keyboard';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'p-dropdown[rbnSelectedChange]'
})
export class RbnFocusDropdownSelectedOptionDirective implements AfterViewInit {
  @Output() selectedChange = new EventEmitter();
  selectItemFn: (event: any, option: any) => void;
  isListenKeyDown = true;

  constructor(private dropdown: Dropdown, private renderer: Renderer2) {
    this.selectItemFn = this.dropdown.selectItem;
  }

  ngAfterViewInit(): void {
    this.preventSelectItemOnHide();
  }

  @HostListener('onShow')
  handleOnShow() {
    this.listenForItemEventOnChange();
    this.preventSelectItemOnHide(false);
  }

  @HostListener('onHide')
  handleOnHide() {
    this.isListenKeyDown = true;
    this.preventSelectItemOnHide();
  }

  listenForItemEventOnChange() {
    this.renderer.listen(this.dropdown.accessibleViewChild?.nativeElement, KeyEvent.keydown, (e) => {
      if ((e.code === KeyCode.Enter || e.code === KeyCode.Space) && !this.dropdown.overlayVisible && this.isListenKeyDown) {
        this.selectedChange.emit({ event: e, value: this.dropdown.selectedOption });
        this.isListenKeyDown = false;
      }
    });
    this.renderer.listen(this.dropdown.overlayViewChild?.overlayViewChild?.nativeElement, 'click', (e) => {
      this.selectedChange.emit({ event: e, value: this.dropdown.selectedOption });
    });
  }

  preventSelectItemOnHide(prevent = true) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.dropdown.selectItem = prevent ? () => {} : this.selectItemFn;
  }
}
