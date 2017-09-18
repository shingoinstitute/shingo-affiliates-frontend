import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTrainingComponent } from './support-training.component';

describe('SupportVideoComponent', () => {
  let component: SupportTrainingComponent;
  let fixture: ComponentFixture<SupportTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
