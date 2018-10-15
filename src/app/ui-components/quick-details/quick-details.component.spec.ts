import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QuickDetailsComponent } from './quick-details.component'

describe('QuickDetailsComponent', () => {
  let component: QuickDetailsComponent
  let fixture: ComponentFixture<QuickDetailsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickDetailsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
