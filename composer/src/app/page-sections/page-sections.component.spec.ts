import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionsComponent } from './page-sections.component';

describe('PageSectionsComponent', () => {
  let component: PageSectionsComponent;
  let fixture: ComponentFixture<PageSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
