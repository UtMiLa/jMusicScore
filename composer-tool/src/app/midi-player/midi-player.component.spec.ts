import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiPlayerComponent } from './midi-player.component';

describe('MidiPlayerComponent', () => {
  let component: MidiPlayerComponent;
  let fixture: ComponentFixture<MidiPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
