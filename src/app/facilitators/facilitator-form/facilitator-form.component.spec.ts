import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorFormComponent } from './facilitator-form.component';

describe('FacilitatorFormComponent', () => {
  let component: FacilitatorFormComponent;
  let fixture: ComponentFixture<FacilitatorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitatorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
