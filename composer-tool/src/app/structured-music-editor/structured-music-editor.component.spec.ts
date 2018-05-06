import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredMusicEditorComponent } from './structured-music-editor.component';

describe('StructuredMusicEditorComponent', () => {
  let component: StructuredMusicEditorComponent;
  let fixture: ComponentFixture<StructuredMusicEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructuredMusicEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredMusicEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
