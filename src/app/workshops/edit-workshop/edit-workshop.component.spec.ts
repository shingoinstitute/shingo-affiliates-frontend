import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkshopComponent } from './edit-workshop.component';

describe('EditWorkshopComponent', () => {
  let component: EditWorkshopComponent;
  let fixture: ComponentFixture<EditWorkshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
