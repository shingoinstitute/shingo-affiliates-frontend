import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkshopDataTableComponent } from './workshop-data-table.component'

describe('WorkshopDataTableComponent', () => {
  let component: WorkshopDataTableComponent
  let fixture: ComponentFixture<WorkshopDataTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopDataTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDataTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
