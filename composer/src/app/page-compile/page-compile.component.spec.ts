import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCompileComponent } from './page-compile.component';

describe('PageCompileComponent', () => {
  let component: PageCompileComponent;
  let fixture: ComponentFixture<PageCompileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCompileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCompileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
