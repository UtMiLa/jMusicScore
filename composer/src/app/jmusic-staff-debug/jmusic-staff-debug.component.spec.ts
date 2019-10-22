import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicStaffDebugComponent } from './jmusic-staff-debug.component';

describe('JmusicStaffDebugComponent', () => {
  let component: JmusicStaffDebugComponent;
  let fixture: ComponentFixture<JmusicStaffDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicStaffDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicStaffDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
