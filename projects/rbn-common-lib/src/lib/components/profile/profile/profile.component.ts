import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'rbn-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnChanges {

  @Input() profiles: MenuItem[];
  @Input() icon = { name: 'fa fa-bars', noneBackground: false };

  constructor(private el: ElementRef) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.profiles && this.profiles) {
      this.checkItem(this.profiles);
    }
  }

  checkItem(menuItems: MenuItem[]) {
    menuItems.forEach(item => {
      if (item) {
        if (item.items) {
          item.disabled = true; // prevent focus to parent item
          this.checkItem(item.items);
        } else {
          if (item.command || item.url) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        }
      }
    });
  }

  onShow() {
    const el = this.el.nativeElement.querySelector('#menu-bar .p-overlaypanel');
    setTimeout(() => {
      el.setAttribute('style', '');
    });
  }
}
