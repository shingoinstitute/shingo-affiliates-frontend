import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfLookupComponent } from './sf-lookup.component';

describe('SfLookupComponent', () => {
  let component: SfLookupComponent;
  let fixture: ComponentFixture<SfLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
