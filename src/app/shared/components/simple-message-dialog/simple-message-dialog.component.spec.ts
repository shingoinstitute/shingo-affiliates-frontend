import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SimpleMessageDialog } from './simple-message-dialog.component'

describe('SimpleMessageDialogComponent', () => {
  let component: SimpleMessageDialog
  let fixture: ComponentFixture<SimpleMessageDialog>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleMessageDialog],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMessageDialog)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
