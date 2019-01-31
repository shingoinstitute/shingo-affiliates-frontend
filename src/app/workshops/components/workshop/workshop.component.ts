// Angular Modules
import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'

// App Modules
import {
  TextResponseDialogComponent,
  TextResponseData,
} from '~app/shared/components/text-response-dialog/text-response-dialog.component'
import { WorkshopBase } from '~app/workshops/workshop.model'
// tslint:disable-next-line:no-duplicate-imports
import * as W from '~app/workshops/workshop.model'
import { ordNumValue } from '~app/util/functional/Ord'
import { Observable } from 'rxjs'
import * as fromRoot from '~app/reducers'
import * as fromUser from '~app/user/reducers'
import { Store, select } from '@ngrx/store'
import { map } from 'rxjs/operators'
import { greaterThan } from 'fp-ts/lib/Ord'

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss'],
})
export class WorkshopComponent {
  @Input()
  workshop: WorkshopBase = W.workshop()

  isAdmin$: Observable<boolean>

  constructor(
    private router: Router,
    private dialog: MatDialog,
    store: Store<fromRoot.State>,
  ) {
    this.isAdmin$ = store.pipe(select(fromUser.isAdmin))
  }

  // add the workshop.model module to the class instance so
  // that we can use it in the template
  W = W

  get canEdit$() {
    return this.isAdmin$.pipe(
      map(isAdmin => {
        if (isAdmin) return isAdmin
        const status = W.status(this.workshop)
        return status === 'Proposed' || status === 'Verified'
      }),
    )
  }

  get canCancel() {
    const status = W.status(this.workshop)
    return (
      status === 'Proposed' ||
      status === 'Verified' ||
      greaterThan(ordNumValue)(W.endDate(this.workshop), new Date())
    )
  }

  get largeImage() {
    const split = W.image(this.workshop).split('.png')
    return `${split[0]}Large.png`
  }

  cancel() {
    const dialogRef = this.dialog.open(TextResponseDialogComponent, {
      data: {
        title: 'Cancel Workshop?',
        message: 'Please state the reason for cancelling this workshop...',
        acceptText: 'Yes, Cancel Workshop',
        cancelText: 'No, Keep Workshop',
        destructive: true,
      } as TextResponseData,
    })
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        throw new Error('Unimplemented')
        // this.workshop.status = 'Cancelled'
        // this._ws.cancel(this.workshop, result).subscribe(cancelled => cancelled)
      }
    })
  }

  goToEdit() {
    this.router.navigateByUrl(`/workshops/${this.workshop.Id}/edit`)
  }
}
