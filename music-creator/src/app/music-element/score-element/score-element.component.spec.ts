import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreElementComponent } from './score-element.component';

describe('ScoreElementComponent', () => {
  let component: ScoreElementComponent;
  let fixture: ComponentFixture<ScoreElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
