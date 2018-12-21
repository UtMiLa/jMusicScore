import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicScoreDebugComponent } from './jmusic-score-debug.component';

describe('JmusicScoreDebugComponent', () => {
  let component: JmusicScoreDebugComponent;
  let fixture: ComponentFixture<JmusicScoreDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicScoreDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicScoreDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
