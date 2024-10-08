import { AfterViewInit, Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { Panel } from 'primeng/panel';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-panel[toggleable]'
})
export class RbnFocusPanelDirective implements AfterViewInit {

  @Input() iconAriaLabel = '';

  constructor(private el: ElementRef, private panel: Panel, private renderer: Renderer2) {
    panel.collapsedChange.subscribe(isCollapsed => {
      renderer.setStyle(el.nativeElement.querySelector('.p-panel-content'), 'visibility', isCollapsed ? 'hidden' : 'visible');
    });

  }

  ngAfterViewInit(): void {
    const button = this.el.nativeElement?.querySelector('.p-panel-icons button');
    if (button) {
      button.ariaLabel = this.iconAriaLabel || this.panel.header;
    }
  }

}

