import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableElementComponent } from './selectable-element.component';

describe('SelectableElementComponent', () => {
  let component: SelectableElementComponent;
  let fixture: ComponentFixture<SelectableElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectableElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
