import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QuickDetailItemComponent } from './quick-detail-item.component'

describe('QuickDetailItemComponent', () => {
  let component: QuickDetailItemComponent
  let fixture: ComponentFixture<QuickDetailItemComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickDetailItemComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDetailItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
