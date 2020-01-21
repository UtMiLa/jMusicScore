import { TestBed } from '@angular/core/testing';

import { JmusicSelectionService } from './jmusic-selection.service';

describe('JmusicSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JmusicSelectionService = TestBed.get(JmusicSelectionService);
    expect(service).toBeTruthy();
  });
});
