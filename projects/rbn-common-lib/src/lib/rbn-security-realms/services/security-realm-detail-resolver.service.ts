import { Injectable, Inject } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { SecurityRealms } from '../securityRealms';
import { SecurityRealmsInterfaceService } from './security-realms-interface.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityRealmDetailResolverService implements Resolve<SecurityRealms> {

  constructor(@Inject('SecurityRealmsInterfaceService') private realmService: SecurityRealmsInterfaceService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SecurityRealms | never> {
    const realmId = route.paramMap.get('id');
    return this.realmService.getRealms().pipe(
      take(1),
      mergeMap((realms: any) => {
        if (realms.body) {
          const realm = realms.body.find((item: any) => realmId === item.id);
          if (realm) {
            return of(realm);
          }
        }
        return EMPTY;
      })
    );
  }
}
