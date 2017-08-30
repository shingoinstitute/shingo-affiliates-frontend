import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAffiliateTabComponent } from './admin-affiliate-tab.component';

describe('AdminAffiliateTabComponent', () => {
  let component: AdminAffiliateTabComponent;
  let fixture: ComponentFixture<AdminAffiliateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAffiliateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAffiliateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
