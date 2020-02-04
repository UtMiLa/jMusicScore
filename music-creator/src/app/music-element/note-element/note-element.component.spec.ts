import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteElementComponent } from './note-element.component';

describe('NoteElementComponent', () => {
  let component: NoteElementComponent;
  let fixture: ComponentFixture<NoteElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
