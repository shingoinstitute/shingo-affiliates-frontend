import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MarketingMaterialsComponent } from './marketing-materials.component'

describe('MarketingMaterialsComponent', () => {
  let component: MarketingMaterialsComponent
  let fixture: ComponentFixture<MarketingMaterialsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingMaterialsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMaterialsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
