import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateCommonService {

  constructor(private router: Router) { }

  navBackToTable(route: ActivatedRoute, isEdit: boolean) {
    let urlTable = '../';
    if (isEdit) {
      urlTable = '../../';
    }
    this.router.navigate([urlTable], {relativeTo: route});
  }

  navigateToForm(route: ActivatedRoute, id = '', queryParam: Object = {}) {
    const params = ['./actions'];
    let extrasParams = { relativeTo: route };
    if (id) {
      params.push(id);
    }
    if (queryParam) {
      extrasParams = Object.assign(extrasParams, queryParam);
    }

    this.router.navigate(params, extrasParams);
  }
}
