import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicVoiceDebugComponent } from './jmusic-voice-debug.component';

describe('JmusicVoiceDebugComponent', () => {
  let component: JmusicVoiceDebugComponent;
  let fixture: ComponentFixture<JmusicVoiceDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicVoiceDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicVoiceDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
