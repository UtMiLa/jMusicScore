import { TestBed } from '@angular/core/testing';

import { FileIoService } from './file-io.service';

describe('FileIoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileIoService = TestBed.get(FileIoService);
    expect(service).toBeTruthy();
  });
});
