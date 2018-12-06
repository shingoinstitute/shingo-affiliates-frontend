import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Affiliate } from './affiliate.model'
import { Subscription, Observable } from 'rxjs'
import {
  AffiliateFormAction,
  AffiliateForm,
  addToAffiliate,
  handleAffiliateAction,
} from './affiliate-form/affiliate-form.component'
import { AffiliateService } from '../services/affiliate/affiliate.service'
import { MatSnackBar } from '@angular/material'
import { SFSuccessResult } from '../services/workshop/workshop.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-affiliate-form-page',
  template: `
    <app-affiliate-form
      [affiliate]="affiliate"
      [action]="action"
      [pending]="isLoading"
      (submitted)="onSubmit($event)"
    ></app-affiliate-form>
  `,
})
export class AffiliateFormPageComponent implements OnInit, OnDestroy {
  isLoading = false
  affiliate!: Affiliate
  action: AffiliateFormAction = 'create'
  routeSubscription?: Subscription
  constructor(
    private route: ActivatedRoute,
    private _as: AffiliateService,
    private snackbar: MatSnackBar,
    private location: Location,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(route => {
      const id = route['id']
      if (typeof id === 'string' && id !== 'create') {
        this.getSFObject(id)
        this.action = 'update'
      } else {
        this.action = 'create'
      }
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }

  private getSFObject(id: string) {
    this.isLoading = true
    this._as.getById(id).subscribe(
      (affiliate?: Affiliate) => {
        if (affiliate) {
          this.affiliate = affiliate
        }
        this.isLoading = false
      },
      err => {
        console.error(err)
        this.isLoading = false
      },
    )
  }

  private handleError = (err: any) => {
    console.error(err)
    this.isLoading = false
    this.snackbar.open(
      'An error occurred and the requested operation could not be completed.',
      'Okay',
    )
  }

  onSubmit(affForm?: AffiliateForm) {
    if (affForm) {
      const aff = addToAffiliate(affForm, this.affiliate)
      this.isLoading = true
      type ReturnTypeMerged = Observable<SFSuccessResult | { mapped: true }>
      ;(handleAffiliateAction(
        affForm.action,
        aff,
        this._as,
      ) as ReturnTypeMerged).subscribe(result => {
        this.isLoading = false
        const text = (result as SFSuccessResult).success
          ? 'Successfully saved the Affiliate'
          : 'Successfully mapped the Affiliate'
        this.snackbar.open(text, undefined, { duration: 2000 })
        this.location.back()
      }, this.handleError)
    }
  }
}
