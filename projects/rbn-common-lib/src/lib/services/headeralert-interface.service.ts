import { Headeralert } from '../models/headeralert';
import { Observable } from 'rxjs';

export interface HeaderalertInterfaceService {

  /* Get topheader alert counts.*/
  getAlertCounts(): Observable<Headeralert>;
}
