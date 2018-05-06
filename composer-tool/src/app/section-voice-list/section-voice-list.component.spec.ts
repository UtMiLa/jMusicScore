import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionVoiceListComponent } from './section-voice-list.component';

describe('SectionVoiceListComponent', () => {
  let component: SectionVoiceListComponent;
  let fixture: ComponentFixture<SectionVoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionVoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionVoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
