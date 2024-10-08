/*import { TestBed } from '@angular/core/testing';
import { GetInformationService } from './get-information.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RestService } from 'projects/rbn-common-lib/src/lib/services/rest.service';
import { of } from 'rxjs';

describe('GetInformationService', () => {
  let getInforService: GetInformationService;
  const appInfoService = jasmine.createSpyObj('appInfoService', ['getInfor']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {provide: RestService, useValue: appInfoService}
      ]
    });

    // Inject the http service and test controller for each test
    getInforService = TestBed.inject(GetInformationService);
  });
  /// Tests begin ///

  it('should be created', () => {
    expect(getInforService).toBeTruthy();
  });
  it('Call rest API service from getInformationService', () => {
    getInforService.getInformation();
    expect(appInfoService.getInfor.calls.count()).toBe(1, 'one call');
  });
  it('Return value from rest API', () => {
    appInfoService.getInfor.and.returnValue(of({version: '11.01.00A021', project: 'EMS'}));
    getInforService.getInformation().subscribe((res: any) => {
      expect(res.version).toEqual('11.01.00A021');
      expect(res.project).toEqual('EMS');
    });
  });
});*/
