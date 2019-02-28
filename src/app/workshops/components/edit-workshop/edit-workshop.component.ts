// Angular Modules
import { Component, Input } from '@angular/core'

// App Modules
import { WorkshopBase, workshop } from '~app/workshops/workshop.model'
import {
  WorkshopForm,
  toWorkshopChanges,
} from '../workshop-form/workshop-form.component'
import { Store } from '@ngrx/store'
import { State } from '~app/workshops/reducers'
import { Actions, ofType } from '@ngrx/effects'
import {
  WorkshopApiAction,
  WorkshopUpdate,
  WorkshopApiActionTypes,
} from '~app/workshops/actions/workshop-api.actions'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { subscribeTwo } from '~app/util/util'
import { pipe } from 'rxjs'
import { filter } from 'rxjs/operators'
import { UpdateData } from '~app/workshops/services/workshop.service'

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.scss'],
})
export class EditWorkshopComponent {
  @Input()
  workshop: WorkshopBase = workshop()
  pending = false

  constructor(
    private store: Store<State>,
    private actions$: Actions<WorkshopApiAction>,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  public save(data: WorkshopForm) {
    this.pending = true
    const action = new WorkshopUpdate({
      id: this.workshop.Id,
      data: toWorkshopChanges(data) as UpdateData,
    })

    const listener = subscribeTwo(
      this.actions$,
      pipe(
        ofType(WorkshopApiActionTypes.WorkshopMutSuccess),
        filter(({ payload: { action: a } }) => a === action),
      ),
      pipe(
        ofType(WorkshopApiActionTypes.WorkshopMutError),
        filter(({ payload: { action: a } }) => a === action),
      ),
    )

    this.store.dispatch(action)

    listener({
      error: ({ payload: { error } }) => {
        console.error('Error submitting workshop', error)
        // TODO: return to workshop form page and fill with this data, allowing user to retry
        this.snackbar.open(
          'An error occurred and the workshop could not be updated',
          'Ok',
          { panelClass: ['md-warn'] },
        )
      },
      success: ({ payload: { result } }) => {
        this.pending = false
        this.router.navigateByUrl(`/workshops/${result.id}`)
      },
    })
  }
}
