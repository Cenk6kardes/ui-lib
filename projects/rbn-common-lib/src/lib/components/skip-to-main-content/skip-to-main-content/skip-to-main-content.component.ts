import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rbn-skip-to-main-content',
  templateUrl: './skip-to-main-content.component.html',
  styleUrls: ['./skip-to-main-content.component.scss']
})
export class SkipToMainContentComponent implements AfterViewInit, OnDestroy {

  @Input() mainId = 'main';

  @Output() clickSkipEvent = new EventEmitter();

  @ViewChild('link') link: ElementRef;

  constructor(public translate: TranslateService) {
  }

  ngAfterViewInit(): void {
    this.link.nativeElement?.ownerDocument?.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event?.altKey && event?.key === '0') {
        this.link.nativeElement?.click();
      }
    });
  }

  ngOnDestroy(): void {
    this.link.nativeElement = null;
  }
}
