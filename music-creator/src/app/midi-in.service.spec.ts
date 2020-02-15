import { TestBed } from '@angular/core/testing';

import { MidiInService } from './midi-in.service';

describe('MidiInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MidiInService = TestBed.get(MidiInService);
    expect(service).toBeTruthy();
  });
});
