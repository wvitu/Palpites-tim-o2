import { TestBed } from '@angular/core/testing';

import { PalpiteService } from './palpite.service';

describe('PalpiteService', () => {
  let service: PalpiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalpiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
