import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RationalEditComponent } from './rational-edit.component';

describe('RationalEditComponent', () => {
  let component: RationalEditComponent;
  let fixture: ComponentFixture<RationalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RationalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RationalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
