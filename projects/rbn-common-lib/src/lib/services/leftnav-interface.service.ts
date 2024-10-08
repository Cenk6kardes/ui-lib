import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

export interface LeftnavInterfaceService {

  /* Get leftnav menuItems.*/
  // this method will implement in application spectific service
  // Inject('LeftnavInterfaceService')
  getLeftnavItems(): Observable<MenuItem[]>;

}
