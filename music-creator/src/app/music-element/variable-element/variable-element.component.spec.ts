import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableElementComponent } from './variable-element.component';

describe('VariableElementComponent', () => {
  let component: VariableElementComponent;
  let fixture: ComponentFixture<VariableElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
