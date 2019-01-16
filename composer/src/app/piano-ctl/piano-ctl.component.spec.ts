import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoCtlComponent } from './piano-ctl.component';

describe('PianoCtlComponent', () => {
  let component: PianoCtlComponent;
  let fixture: ComponentFixture<PianoCtlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoCtlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoCtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
