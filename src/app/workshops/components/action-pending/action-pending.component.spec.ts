import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActionPendingComponent } from './action-pending.component'

describe('ActionPendingComponent', () => {
  let component: ActionPendingComponent
  let fixture: ComponentFixture<ActionPendingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionPendingComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPendingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
