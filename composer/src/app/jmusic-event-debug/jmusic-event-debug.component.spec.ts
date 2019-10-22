import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicEventDebugComponent } from './jmusic-event-debug.component';

describe('JmusicEventDebugComponent', () => {
  let component: JmusicEventDebugComponent;
  let fixture: ComponentFixture<JmusicEventDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicEventDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicEventDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
