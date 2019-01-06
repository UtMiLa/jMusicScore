import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVariablesComponent } from './page-variables.component';

describe('PageVariablesComponent', () => {
  let component: PageVariablesComponent;
  let fixture: ComponentFixture<PageVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
