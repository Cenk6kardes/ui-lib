import { Component, OnInit, Inject } from '@angular/core';
import { HeaderalertInterfaceService } from '../../../services/headeralert-interface.service';
import { Headeralert } from '../../../models/headeralert';

@Component({
  selector: 'rbn-headeralert',
  templateUrl: './headeralert.component.html',
  styleUrls: ['./headeralert.component.scss']
})
export class HeaderalertComponent implements OnInit {

  constructor(@Inject('HeaderalertInterfaceService') private alertService: HeaderalertInterfaceService) { }

  headeralert = new Headeralert(0, 0, 0);

  ngOnInit() {
    this.alertService.getAlertCounts().subscribe(
      (headeralert: Headeralert) => {
        this.headeralert = headeralert;
      });
  }

}
