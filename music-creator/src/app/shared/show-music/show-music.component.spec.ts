import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMusicComponent } from './show-music.component';

describe('ShowMusicComponent', () => {
  let component: ShowMusicComponent;
  let fixture: ComponentFixture<ShowMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
