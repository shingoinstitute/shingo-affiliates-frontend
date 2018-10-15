import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AdminFacilitatorTabComponent } from './admin-facilitator-tab.component'

describe('AdminFacilitatorTabComponent', () => {
  let component: AdminFacilitatorTabComponent
  let fixture: ComponentFixture<AdminFacilitatorTabComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFacilitatorTabComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFacilitatorTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
