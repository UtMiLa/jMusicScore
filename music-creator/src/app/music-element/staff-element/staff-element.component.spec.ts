import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffElementComponent } from './staff-element.component';

describe('StaffElementComponent', () => {
  let component: StaffElementComponent;
  let fixture: ComponentFixture<StaffElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
