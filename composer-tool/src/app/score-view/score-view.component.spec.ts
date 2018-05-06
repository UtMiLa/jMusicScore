import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreViewComponent } from './score-view.component';

describe('ScoreViewComponent', () => {
  let component: ScoreViewComponent;
  let fixture: ComponentFixture<ScoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
