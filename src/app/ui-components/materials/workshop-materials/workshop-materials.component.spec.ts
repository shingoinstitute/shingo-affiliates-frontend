import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopMaterialsComponent } from './workshop-materials.component';

describe('WorkshopMaterialsComponent', () => {
  let component: WorkshopMaterialsComponent;
  let fixture: ComponentFixture<WorkshopMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
