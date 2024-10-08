import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rbn-read-only-form',
  templateUrl: './read-only-form.component.html',
  styleUrls: ['./read-only-form.component.scss']
})
export class ReadOnlyFormComponent implements OnInit {
  @Input() json = {};
  jsonArray = [];
  constructor() { }

  ngOnInit(): void {
    this.makeJsonArray(this.json);
  }

  makeJsonArray(json) {
    for (const type of Object.keys(json)) {
      const item: any = {};
      item.key = type;
      item.value = json[type];
      this.jsonArray.push(item);
    }
  }

}
