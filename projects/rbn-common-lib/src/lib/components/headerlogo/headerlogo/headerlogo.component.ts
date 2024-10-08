import { Component, Input } from '@angular/core';

@Component({
  selector: 'rbn-headerlogo',
  templateUrl: './headerlogo.component.html',
  styleUrls: ['./headerlogo.component.scss']
})
export class HeaderlogoComponent {

  @Input() productName!: string;
  @Input() productNameSup?: string;
  @Input() noneUppercase = false;

  constructor() { }

}
