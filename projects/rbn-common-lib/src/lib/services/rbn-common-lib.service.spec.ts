import { TestBed } from '@angular/core/testing';

import { RbnCommonLibService } from './rbn-common-lib.service';

describe('RbnCommonLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RbnCommonLibService = TestBed.inject(RbnCommonLibService);
    expect(service).toBeTruthy();
  });
});
