import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpcomingWorkshopsComponent } from './upcoming-workshops.component'

describe('UpcomingWorkshopsComponent', () => {
  let component: UpcomingWorkshopsComponent
  let fixture: ComponentFixture<UpcomingWorkshopsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingWorkshopsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingWorkshopsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
