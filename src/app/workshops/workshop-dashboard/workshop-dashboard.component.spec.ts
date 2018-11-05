import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkshopDashboardComponent } from './workshop-dashboard.component'

describe('WorkshopDashboardComponent', () => {
  let component: WorkshopDashboardComponent
  let fixture: ComponentFixture<WorkshopDashboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopDashboardComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
