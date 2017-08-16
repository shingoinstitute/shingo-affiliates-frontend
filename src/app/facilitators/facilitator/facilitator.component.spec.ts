import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorComponent } from './facilitator.component';

describe('FacilitatorComponent', () => {
  let component: FacilitatorComponent;
  let fixture: ComponentFixture<FacilitatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
