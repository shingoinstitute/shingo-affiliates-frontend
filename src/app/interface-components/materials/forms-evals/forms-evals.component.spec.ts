import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsEvalsComponent } from './forms-evals.component';

describe('FormsEvalsComponent', () => {
  let component: FormsEvalsComponent;
  let fixture: ComponentFixture<FormsEvalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsEvalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsEvalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
