import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicScoreViewComponent } from './jmusic-score-view.component';

describe('JmusicScoreViewComponent', () => {
  let component: JmusicScoreViewComponent;
  let fixture: ComponentFixture<JmusicScoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicScoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicScoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
