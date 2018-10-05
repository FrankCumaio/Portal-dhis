import { TestBed, inject } from '@angular/core/testing';

import { DashboardsService } from './dashboards.service';

describe('DashboardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardsService]
    });
  });

  it('should be created', inject([DashboardsService], (service: DashboardsService) => {
    expect(service).toBeTruthy();
  }));
});
