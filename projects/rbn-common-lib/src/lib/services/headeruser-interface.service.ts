import { Headeruser } from '../models/headeruser';
import { Observable } from 'rxjs';

export interface HeaderuserInterfaceService {

  /* Get topheader alert counts.*/
  getUserActions(): Observable<Headeruser>;

  setTimezone(timezone: number): void;
  getTimezone(): Observable<number>; // not used

  changePwd(pwdData: any): Observable<any>;

  changeUserInfo(any): Observable<any>;

  /* Log out */
  logout(): void;
}
