import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigateCommonService } from './navigate-common.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('NavigateCommonService', () => {
  let service: NavigateCommonService;
  const router = { navigate: jasmine.createSpy('navigate') };
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: router }
      ]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(NavigateCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navBackToTable from add form', () => {
    const activeRoute = new ActivatedRoute();
    service.navBackToTable(activeRoute, false);
    expect(router.navigate).toHaveBeenCalledWith(['../'], {relativeTo: activeRoute});
  });

  it('should navBackToTable from add edit', () => {
    const activeRoute = new ActivatedRoute();
    service.navBackToTable(activeRoute, true);
    expect(router.navigate).toHaveBeenCalledWith(['../../'], {relativeTo: activeRoute});
  });

  it('should navigateToForm Add', () => {
    const activeRoute = new ActivatedRoute();
    service.navigateToForm(activeRoute);
    expect(router.navigate).toHaveBeenCalledWith(['./actions'], {relativeTo: activeRoute});
  });

  it('should navigateToForm Edit', () => {
    const activeRoute = new ActivatedRoute();
    service.navigateToForm(activeRoute, '123');
    expect(router.navigate).toHaveBeenCalledWith(['./actions', '123'], {relativeTo: activeRoute});
  });
});
