import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoKbdComponent } from './piano-kbd.component';

describe('PianoKbdComponent', () => {
  let component: PianoKbdComponent;
  let fixture: ComponentFixture<PianoKbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoKbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoKbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
