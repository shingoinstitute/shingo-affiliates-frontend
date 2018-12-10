import { TestBed, async } from '@angular/core/testing'

import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component'

import {
  MatIconRegistry,
  MatSidenavModule,
  MatDialogModule,
  MatMenuModule,
  MatExpansionModule,
} from '@angular/material'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        // MatIconRegistry,
        MatExpansionModule,
        MatMenuModule,
        MatSidenavModule,
        MatDialogModule,
        RouterModule,
      ],
    }).compileComponents()
  }))

  describe('proof of concept test', () => {
    it('true is true', () => expect(true).toBe(true))
  })
})
