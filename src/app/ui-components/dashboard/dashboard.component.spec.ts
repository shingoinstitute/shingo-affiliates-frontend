import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { FlexLayoutModule } from '@angular/flex-layout'

import { DashboardComponent } from './dashboard.component'

describe('DashboardComponent', () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FlexLayoutModule],
      declarations: [
        DashboardComponent,
        MockComponent({ selector: 'app-quick-details' }),
        MockComponent({ selector: 'app-upcoming-workshops' }),
        MockComponent({ selector: 'app-action-pending' }),
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should have a quick details component', () => {
    expect(
      fixture.debugElement.query(By.css('app-quick-details')),
    ).toBeDefined()
  })

  it('should have a upcoming workshops component', () => {
    expect(
      fixture.debugElement.query(By.css('app-upcoming-workshops')),
    ).toBeDefined()
  })

  it('should have an action pending component', () => {
    expect(
      fixture.debugElement.query(By.css('app-action-pending')),
    ).toBeDefined()
  })
})
