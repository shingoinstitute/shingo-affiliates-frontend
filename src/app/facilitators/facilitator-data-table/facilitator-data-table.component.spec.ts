import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorDataTableComponent } from './facilitator-data-table.component';

describe('FacilitatorDataTableComponent', () => {
  let component: FacilitatorDataTableComponent;
  let fixture: ComponentFixture<FacilitatorDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitatorDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatorDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
