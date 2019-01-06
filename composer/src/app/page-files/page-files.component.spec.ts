import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFilesComponent } from './page-files.component';

describe('PageFilesComponent', () => {
  let component: PageFilesComponent;
  let fixture: ComponentFixture<PageFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
