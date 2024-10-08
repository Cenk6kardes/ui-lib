import { Observable } from 'rxjs/internal/Observable';

export interface SecurityRealmsInterfaceService {

  getRealms(): Observable<any>;

  // get the realm types
  getRealmsTypes(): Observable<any>;

  // update the realm
  updateSecurityRealm(body: any): Observable<any>;

  // add a Security Realm
  addSecurityRealm(body: any): Observable<any>;

  // delete a security realm
  deleteSecurityRealm(name: string): Observable<any>;

  // Get details of a specific Realm Type. Supported Types are MONGO and LDAP only
  getDetailsSecurityRealm(type: string): Observable<any>;

  // Get details of a specific Realm By name. Supported Types are MONGO and LDAP only
  getDetailsSecurityRealmByName(name: string): Observable<any>;

  // reorder Security Realm
  reorderSecurityRealm(arr: string[]): Observable<any>;

}
