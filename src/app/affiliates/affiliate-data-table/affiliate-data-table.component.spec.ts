import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AffiliateDataTableComponent } from './affiliate-data-table.component'

describe('AffiliateDataTableComponent', () => {
  let component: AffiliateDataTableComponent
  let fixture: ComponentFixture<AffiliateDataTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateDataTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateDataTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
