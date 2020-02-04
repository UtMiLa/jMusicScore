import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceElementComponent } from './voice-element.component';

describe('VoiceElementComponent', () => {
  let component: VoiceElementComponent;
  let fixture: ComponentFixture<VoiceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
