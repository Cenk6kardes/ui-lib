import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute, AttributeCard, AttributeType } from '../attribute-list.model';

@Component({
  selector: 'rbn-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss']
})

export class AttributeListComponent {
  @Input() card: AttributeCard;
  @Output() buttonClicked = new EventEmitter();
  @Output() itemClicked = new EventEmitter();
  eAttributeType = AttributeType;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  onButtonClick(id: string): void {
    this.buttonClicked.emit(id);
  }

  onLinkClick(attribute: Attribute): void {
    // if clicked link has an 'action' property perform that action
    if (attribute.action) {
      const outletName = attribute.action?.outlet;
      const routeUrl = attribute.action?.navigateTo;

      if (routeUrl && outletName) {
        const outletObj: { [index: string]: any } = {};
        outletObj[outletName] = routeUrl.split('/');
        this.router.navigate([{
          outlets: outletObj
        }]);
      }
    }

    this.emitItemClickedEvent(attribute);
  }

  emitItemClickedEvent(attribute: Attribute) {
    this.itemClicked.emit(attribute);
  }
}
