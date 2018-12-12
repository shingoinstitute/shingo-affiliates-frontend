import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { Facilitator } from './facilitator.model'
import { MatSnackBar } from '@angular/material'
import { FacilitatorService } from '../services/facilitator/facilitator.service'
import {
  FacilitatorForm,
  addToFacilitator,
  handleFacilitatorAction,
} from './facilitator-form/facilitator-form.component'
import { FormAction } from '../affiliates/affiliate-form/affiliate-form.component'
import { SFSuccessResult } from '../services/workshop/workshop.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-facilitator-form-page',
  template: `
    <app-facilitator-form
      [facilitator]="facilitator"
      [pending]="pending"
      [action]="action"
      (submitted)="onSubmit($event)"
    ></app-facilitator-form>
  `,
})
export class FacilitatorFormPageComponent implements OnInit, OnDestroy {
  pending = false
  facilitator?: Facilitator
  action: FormAction = 'create'
  private routeSub?: Subscription
  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private _fs: FacilitatorService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(route => {
      const id = route['id']
      if (typeof id === 'string' && id !== 'create') {
        this.action = 'update'
        this.getSFObject(id)
      } else {
        this.action = 'create'
      }
    })
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe()
  }

  private getSFObject(id: string) {
    this.pending = true
    this._fs.getById(id).subscribe(
      (facilitator?: Facilitator) => {
        this.pending = false
        if (facilitator) {
          this.facilitator = facilitator
        }
      },
      err => {
        console.error(err)
        this.pending = false
        this.snackbar.open(
          'A server error occurred and the facilitator could not be loaded.',
          'Okay',
        )
      },
    )
  }

  private handleError = (err: any) => {
    console.error(err)
    this.pending = false
    this.snackbar.open(
      'An error occurred and the requested operation could not be completed.',
      'Okay',
    )
  }

  onSubmit(facForm?: FacilitatorForm) {
    console.log('Saving', facForm)
    if (facForm) {
      const fac = addToFacilitator(facForm, this.facilitator)
      console.log('Merged Fac', fac)
      this.pending = true
      type ReturnTypeMerged = Observable<SFSuccessResult | { mapped: true }>
      ;(handleFacilitatorAction(
        facForm.action,
        fac,
        this._fs,
      ) as ReturnTypeMerged).subscribe(result => {
        this.pending = false
        const text = (result as SFSuccessResult).success
          ? 'Successfully saved the Facilitator'
          : 'Successfully mapped the Facilitator'
        this.snackbar.open(text, undefined, { duration: 2000 })
        this.location.back()
      }, this.handleError)
    }
  }
}
