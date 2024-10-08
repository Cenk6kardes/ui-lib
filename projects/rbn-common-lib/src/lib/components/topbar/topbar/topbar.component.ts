import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITopBar } from '../../../models/topbar';

@Component({
  selector: 'rbn-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() topBar: ITopBar;
  @Output() showLoginInfo: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  showLastLogin() {
    this.showLoginInfo.emit(true);
  }
}
