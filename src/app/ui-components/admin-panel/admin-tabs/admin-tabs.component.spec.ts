import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTabsComponent } from './admin-tabs.component';

describe('AdminTabsComponent', () => {
  let component: AdminTabsComponent;
  let fixture: ComponentFixture<AdminTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
