import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiCtlComponent } from './midi-ctl.component';

describe('MidiCtlComponent', () => {
  let component: MidiCtlComponent;
  let fixture: ComponentFixture<MidiCtlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiCtlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiCtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
