import { Component, Input } from '@angular/core';

@Component({
  selector: 'rbn-about-info',
  templateUrl: './about-info.component.html',
  styleUrls: ['./about-info.component.scss']
})
export class AboutInfoComponent {

  @Input() showInfo = false;
  @Input() infoTitle = '';
  @Input() infoContent!: string[];
  @Input() idAboutPopup = '';

  constructor() { }

}
