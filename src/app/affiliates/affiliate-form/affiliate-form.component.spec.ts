import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateFormComponent } from './affiliate-form.component';

describe('AffiliateFormComponent', () => {
  let component: AffiliateFormComponent;
  let fixture: ComponentFixture<AffiliateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
