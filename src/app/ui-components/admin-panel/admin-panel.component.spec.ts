import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Router, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AdminPanelComponent } from './admin-panel.component';

class RouterStub { }

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FlexLayoutModule
      ],
      declarations: [AdminPanelComponent],
      providers: [
        { provide: Router, useClass: RouterStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', inject([Router], (router: Router) => {
    expect(component).toBeDefined();
  }));

  it('should have a router', inject([Router], (router: Router) => {
    expect(component.router).toBeDefined();
    expect(component.router instanceof RouterStub).toBeTruthy();
  }));

});
