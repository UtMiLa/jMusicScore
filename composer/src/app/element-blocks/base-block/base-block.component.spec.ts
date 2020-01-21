import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBlockComponent } from './base-block.component';

describe('BaseBlockComponent', () => {
  let component: BaseBlockComponent;
  let fixture: ComponentFixture<BaseBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
