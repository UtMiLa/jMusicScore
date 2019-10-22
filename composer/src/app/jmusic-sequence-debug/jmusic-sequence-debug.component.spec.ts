import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicSequenceDebugComponent } from './jmusic-sequence-debug.component';

describe('JmusicSequenceDebugComponent', () => {
  let component: JmusicSequenceDebugComponent;
  let fixture: ComponentFixture<JmusicSequenceDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicSequenceDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicSequenceDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
