import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicNoteDebugComponent } from './jmusic-note-debug.component';

describe('JmusicNoteDebugComponent', () => {
  let component: JmusicNoteDebugComponent;
  let fixture: ComponentFixture<JmusicNoteDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicNoteDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicNoteDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
