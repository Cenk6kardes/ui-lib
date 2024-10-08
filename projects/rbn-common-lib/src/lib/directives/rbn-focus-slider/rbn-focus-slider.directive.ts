import { AfterViewInit, HostListener, OnChanges, Input, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Slider } from 'primeng/slider';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-slider'
})

export class RbnFocusSliderDirective implements AfterViewInit, OnChanges {
  // customized announced aria values instead the values of Slider
  @Input() ariaValueStart;
  @Input() ariaValueEnd;
  @Input() ariaValue;

  translateResults: any = {};
  handle: HTMLElement;
  handleStart: HTMLElement;
  handleEnd: HTMLElement;

  constructor(private slider: Slider, private translate: TranslateService) {
    this.translate.get('COMMON').subscribe(result => {
      this.translateResults = result;
    });
  }

  ngOnChanges(): void {
    if (this.slider.range) {
      if (this.ariaValueStart && this.handleStart) {
        this.handleStart.ariaValueText = this.ariaValueStart;
      }
      if (this.ariaValueEnd && this.handleEnd) {
        this.handleEnd.ariaValueText = this.ariaValueEnd;
      }
    } else if (this.ariaValue && this.handle) {
      this.handle.ariaValueText = this.ariaValue;
    }
  }

  ngAfterViewInit() {
    if (this.slider.range) {
      this.handleStart = this.slider.sliderHandleStart?.nativeElement;
      this.handleEnd = this.slider.sliderHandleEnd?.nativeElement;
      this.handleStart?.addEventListener('focus', () => this.configSlider());
      this.handleEnd?.addEventListener('focus', () => this.configSlider());
    } else {
      this.handle = this.slider.sliderHandle?.nativeElement;
      this.handle?.addEventListener('focus', () => {
        this.configSlider();
      });
    }
  }

  @HostListener('onChange')
  configSlider() {
    if (this.slider.range) {
      const values = this.slider.values || [];
      this.handleStart = this.slider.sliderHandleStart?.nativeElement;
      this.handleEnd = this.slider.sliderHandleEnd?.nativeElement;
      let min = values[0];
      let max = values[1];

      // the sliderHandleStart is adjusted overcome the sliderHandleEnd
      if (values[0] > values[1]) {
        this.handleStart = this.slider.sliderHandleEnd?.nativeElement;
        this.handleEnd = this.slider.sliderHandleStart?.nativeElement;
        min = values[1];
        max = values[0];
      }
      this.configSliderHandle(this.handleStart, true, this.ariaValueStart === undefined ? min : this.ariaValueStart);
      this.configSliderHandle(this.handleEnd, false, this.ariaValueEnd === undefined ? max : this.ariaValueEnd);
    } else {
      let value = this.slider.value;
      if (this.ariaValue !== undefined) {
        value = this.ariaValueStart;
      }
      this.configSliderHandle(this.handle, undefined, value);
    }
  }

  configSliderHandle(handle: any, minOrMax?: boolean, ariaValue?: number): void {
    if (!handle) {
      return;
    }
    handle.role = 'slider';
    handle.ariaValueText = ariaValue;
    if (minOrMax !== undefined) {
      handle.ariaDescription = minOrMax ? this.translateResults?.MINIMUM_VALUE : this.translateResults?.MAXIMUM_VALUE;
    }
  }
}
