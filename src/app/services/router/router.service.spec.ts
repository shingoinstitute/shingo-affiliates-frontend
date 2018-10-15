import { RouterService } from './router.service'
import { TestBed, inject } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router'

describe('RouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterService, RouterTestingModule.withRoutes([])],
    })
  })

  // it('should be created', () => {

  // });
})
