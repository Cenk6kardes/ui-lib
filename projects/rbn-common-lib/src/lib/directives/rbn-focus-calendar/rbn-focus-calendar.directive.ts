import { AfterViewInit, Directive, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Calendar } from 'primeng/calendar';
import { Keydown } from '../../models/keyboard';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-calendar'
})
export class RbnFocusCalendarDirective implements AfterViewInit {
  translateRes: any = {};

  constructor(
    private calendar: Calendar,
    private renderer: Renderer2,
    private translate: TranslateService) {
    this.translate.get('CALENDAR').subscribe(res => {
      this.translateRes = res;
    });
  }

  ngAfterViewInit(): void {
    this.addAriaLabelOnChange();
  }

  @HostListener('onShow')
  handleOnShow() {
    const element = this.calendar.contentViewChild.nativeElement;
    const inputfield = this.calendar.inputfieldViewChild.nativeElement;
    if (element) {
      this.renderer.listen(element, Keydown.Escape, () => {
        this.focus();
      });
      element.self = this;
      this.renderer.listen(element, Keydown.Enter, this.handleKeyDownEnter);
    }
    if (inputfield) {
      this.renderer.listen(inputfield, Keydown.Enter, () => {
        inputfield.click();
      });
    }
    this.addAriaLabelAllButton();
  }

  handleKeyDownEnter(event): void {
    if (event && event.target) {
      const targetEl = event.target as HTMLElement;
      const prarentEl = targetEl.closest('table.p-datepicker-calendar');
      const self = event.currentTarget?.self;
      if (prarentEl) {
        self?.focus();
      }
    }
  }

  focus() {
    const originShowOnFocus = this.calendar.showOnFocus;
    this.calendar.showOnFocus = false;
    this.calendar.inputfieldViewChild.nativeElement.focus();
    this.calendar.showOnFocus = originShowOnFocus;
  }

  // init aria-label for Next/Previous button of From/To calendar and time adjustment button
  addAriaLabelAllButton(calendarEl = this.calendar) {
    setTimeout(() => {
      const calendarSelector = this.getCalendarSelector(calendarEl);
      const buttonList = calendarSelector.querySelectorAll('.p-datepicker button');
      buttonList?.forEach((btn: HTMLElement) => {
        const classList = Array.from(btn.classList);
        const parentClassList = Array.from(btn.parentElement.classList);
        if (classList.includes('p-datepicker-prev')) {
          btn.ariaLabel = this.translateRes?.PREVIOUS?.replace('{0}', this.translateRes?.MONTH) || '';
        } else if (classList.includes('p-datepicker-next')) {
          btn.ariaLabel = this.translateRes?.NEXT?.replace('{0}', this.translateRes?.MONTH) || '';
        } else if (parentClassList.includes('p-hour-picker')) {
          this.addAriaLabelTimeButton(btn, this.translateRes?.HOUR);
        } else if (parentClassList.includes('p-minute-picker')) {
          this.addAriaLabelTimeButton(btn, this.translateRes?.MINUTE);
        } else if (parentClassList.includes('p-second-picker')) {
          this.addAriaLabelTimeButton(btn, this.translateRes?.SECOND);
        }
      });
    });
  }

  addAriaLabelTimeButton(btn: HTMLElement, type = '') {
    if (btn.querySelector('.pi-chevron-up')) {
      btn.ariaLabel = this.translateRes?.INCREASE?.replace('{0}', type) || '';
    } else {
      btn.ariaLabel = this.translateRes?.DECREASE?.replace('{0}', type) || '';
    }
  }

  addAriaLabelOnChange(calendarEl = this.calendar) {
    // overide Calendar code to change ariaLabel next/previous button in corresponding event
    calendarEl.switchToMonthView = (event) => {
      calendarEl.setCurrentView('month');
      event.preventDefault();
      this.addAriaLabelDateButton(calendarEl, this.translateRes?.YEAR);
    };
    calendarEl.switchToYearView = (event) => {
      calendarEl.setCurrentView('year');
      event.preventDefault();
      this.addAriaLabelDateButton(calendarEl, this.translateRes && this.translateRes['10_YEAR']);
    };
    calendarEl.onPrevButtonClick = (event) => {
      if (calendarEl.currentView === 'date') {
        this.addAriaLabelDateButton(calendarEl, this.translateRes?.MONTH);
      }
      calendarEl.navigationState = { backward: true, button: true };
      calendarEl.navBackward(event);
    };
    calendarEl.onNextButtonClick = (event) => {
      if (calendarEl.currentView === 'date') {
        this.addAriaLabelDateButton(calendarEl, this.translateRes?.MONTH);
      }
      calendarEl.navigationState = { backward: false, button: true };
      calendarEl.navForward(event);
    };

    calendarEl.onMonthChange.subscribe(() => {
      this.addAriaLabelAllButton(calendarEl);
    });
    calendarEl.onYearChange.subscribe(() => {
      this.addAriaLabelDateButton(calendarEl, this.translateRes?.YEAR);
    });
  }

  addAriaLabelDateButton(calendarEl: Calendar, viewType = '') {
    setTimeout(() => {
      const calendarSelector = this.getCalendarSelector(calendarEl);
      const previousBtn = calendarSelector?.querySelector('.p-datepicker-prev');
      const nextbtn = calendarSelector?.querySelector('.p-datepicker-next');
      if (previousBtn && nextbtn) {
        previousBtn.ariaLabel = this.translateRes?.PREVIOUS?.replace('{0}', viewType) || '';
        nextbtn.ariaLabel = this.translateRes?.NEXT?.replace('{0}', viewType) || '';
      }
    });
  }

  getCalendarSelector(calendarEl = this.calendar) {
    const calendarContainer = calendarEl.containerViewChild?.nativeElement;
    if (calendarContainer) {
      return calendarEl.appendTo ? calendarContainer.ownerDocument : calendarContainer;
    }
  }
}
