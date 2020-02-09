import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionInfoComponent } from './selection-info.component';

describe('SelectionInfoComponent', () => {
  let component: SelectionInfoComponent;
  let fixture: ComponentFixture<SelectionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
