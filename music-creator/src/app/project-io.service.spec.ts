import { TestBed } from '@angular/core/testing';

import { ProjectIoService } from './project-io.service';

describe('ProjectIoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectIoService = TestBed.get(ProjectIoService);
    expect(service).toBeTruthy();
  });
});
