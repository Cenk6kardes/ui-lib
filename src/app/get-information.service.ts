import {Injectable} from '@angular/core';
import { RestService } from 'projects/rbn-common-lib/src/lib/services/rest.service';
// import {RestService} from 'rbn-common-lib';

@Injectable({
  providedIn: 'root'
})
export class GetInformationService {
  constructor(private rest2Service: RestService) { }
  getInformation() {
    return this.rest2Service.get('api/information');
  }
}
