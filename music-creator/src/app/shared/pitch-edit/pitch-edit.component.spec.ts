import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchEditComponent } from './pitch-edit.component';

describe('PitchEditComponent', () => {
  let component: PitchEditComponent;
  let fixture: ComponentFixture<PitchEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
