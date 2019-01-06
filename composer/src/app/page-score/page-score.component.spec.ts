import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageScoreComponent } from './page-score.component';

describe('PageScoreComponent', () => {
  let component: PageScoreComponent;
  let fixture: ComponentFixture<PageScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
