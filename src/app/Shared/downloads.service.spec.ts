import { TestBed } from '@angular/core/testing';

import { DownloadsService } from './downloads.service';

describe('DownloadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadsService = TestBed.get(DownloadsService);
    expect(service).toBeTruthy();
  });
});
