import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarListComponent } from './var-list.component';

describe('VarListComponent', () => {
  let component: VarListComponent;
  let fixture: ComponentFixture<VarListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
