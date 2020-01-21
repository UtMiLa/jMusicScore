import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmusicSelectedDebugComponent } from './jmusic-selected-debug.component';

describe('JmusicSelectedDebugComponent', () => {
  let component: JmusicSelectedDebugComponent;
  let fixture: ComponentFixture<JmusicSelectedDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmusicSelectedDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmusicSelectedDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
