import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownOption, TabMenuItem } from '../dynamic-tabs.model';

@Component({
  selector: 'rbn-dynamic-tabs',
  templateUrl: './dynamic-tabs.component.html',
  styleUrls: ['./dynamic-tabs.component.scss']
})

export class DynamicTabsComponent {
  constructor() { }

  @Input()
  set tabs(tabList: TabMenuItem[]) {
    this._tabs = tabList.map(
      item => (
        {
          ...item,
          command: () => {
            this.tabChange.emit(item);
            this.currentActiveItem = item;
          }
        }
      )
    );
    this.currentActiveItem = this._tabs[this.activeItemIndex];
  }

  get tabs(): TabMenuItem[] {
    return this._tabs || [];
  }

  @Input() actions: DropdownOption[] = [];
  @Input()
  set activeItemIndex(value: number) {
    this._activeItemIndex = value;
    this.currentActiveItem = this._tabs[value];
  }

  get activeItemIndex(): number {
    return this._activeItemIndex;
  }

  @Output() tabChange: EventEmitter<TabMenuItem> = new EventEmitter();
  @Output() actionChange: EventEmitter<DropdownOption> = new EventEmitter();
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  _tabs: TabMenuItem[];
  _activeItemIndex: number;
  currentActiveItem: TabMenuItem;

  onDropdownChange(event: any): void {
    this.actionChange.emit(event.value);
  }

  refreshButtonClicked(): void {
    this.refreshEvent.emit(true);
  }

}


