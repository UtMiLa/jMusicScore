import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceElementComponent } from './sequence-element.component';

describe('SequenceElementComponent', () => {
  let component: SequenceElementComponent;
  let fixture: ComponentFixture<SequenceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
