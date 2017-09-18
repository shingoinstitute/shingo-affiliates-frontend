import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkshopComponent } from './add-workshop.component';

describe('AddWorkshopComponent', () => {
  let component: AddWorkshopComponent;
  let fixture: ComponentFixture<AddWorkshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
