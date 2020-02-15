import { TestBed } from '@angular/core/testing';

import { MusicIoService } from './music-io.service';

describe('MusicIoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicIoService = TestBed.get(MusicIoService);
    expect(service).toBeTruthy();
  });
});
