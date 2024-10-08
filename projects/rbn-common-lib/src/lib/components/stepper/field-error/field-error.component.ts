import {
  Component, Input, Output, EventEmitter, OnChanges, ElementRef, SimpleChanges,
  OnDestroy
} from '@angular/core';
import { ScreenReaderService } from '../../../services/screen-reader.service';
import { WcagService } from '../../../services/wcag.service';

@Component({
  selector: 'rbn-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss']
})
export class FieldErrorComponent implements OnChanges, OnDestroy {
  @Input() error: string;
  @Input() for: string;
  @Input() viewDetail: any;
  @Output() viewMore = new EventEmitter<boolean>();

  eleError: any;

  constructor(
    private screenReader: ScreenReaderService,
    private elRef: ElementRef,
    private wcagService: WcagService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.error?.currentValue) {
      const field = this.elRef.nativeElement?.ownerDocument?.getElementById(this.for);
      this.eleError = this.wcagService.getFocusableElm(field);
      this.announceErrorMessage();
      this.addFocusEventForFieldError();
    } else {
      this.removeEleErrorFocusListener();
    };
  }

  ngOnDestroy(): void {
    this.removeEleErrorFocusListener();
  }

  detailView() {
    this.viewMore.emit(true);
  }

  announceErrorMessage = () => {
    if (this.eleError && this.error) {
      setTimeout(() => {
        this.screenReader.announce(this.eleError, this.error);
      }, 100);
    }
  };

  addFocusEventForFieldError() {
    this.removeEleErrorFocusListener();
    this.eleError?.addEventListener('focus', this.announceErrorMessage);
  }

  removeEleErrorFocusListener(): void {
    this.eleError?.removeEventListener('focus', this.announceErrorMessage);
  }
}
