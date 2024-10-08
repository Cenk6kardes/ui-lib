import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rbn-services-card',
  templateUrl: './services-card.component.html',
  styleUrls: ['./services-card.component.scss']
})
export class ServicesCardComponent implements OnInit {

  @Input() inforCard = {
    title: 'TITLE',
    description: 'description',
    labelBtnForward: 'label',
    isBlackLogo: false
  };
  @Input() usingTooltipDesc = false;
  @Output() evOnClickBtnForward = new EventEmitter();

  logoPath = '';

  constructor() { }

  ngOnInit(): void {
    this.logoPath = this.inforCard.isBlackLogo === true
      ? 'assets/images/black-logo.png'
      : 'assets/images/ribbon-login-logo.png';
  }

  clickBtnForward() {
    this.evOnClickBtnForward.emit();
  }
}
