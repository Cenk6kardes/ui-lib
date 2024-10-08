import { Component, Input } from '@angular/core';
import { AttributeCard } from '../attribute-list.model';

@Component({
  selector: 'rbn-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})

export class CardTableComponent {
  @Input() card: AttributeCard;
  constructor() { }
}
