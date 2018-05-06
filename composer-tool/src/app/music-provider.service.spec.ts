import { TestBed, inject } from '@angular/core/testing';

import { MusicProviderService } from './music-provider.service';

describe('MusicProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MusicProviderService]
    });
  });

  it('should be created', inject([MusicProviderService], (service: MusicProviderService) => {
    expect(service).toBeTruthy();
  }));
});
