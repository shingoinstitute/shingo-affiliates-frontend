// Angular Modules
import { Component } from '@angular/core'

// App Modules
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import {
  WorkshopForm,
  toWorkshopChanges,
} from '../../components/workshop-form/workshop-form.component'
import { Store } from '@ngrx/store'
import { State } from '~app/workshops/reducers'
import {
  WorkshopCreate,
  WorkshopApiActionTypes,
  WorkshopApiAction,
} from '~app/workshops/actions/workshop-api.actions'
import { filter } from 'rxjs/operators'
import { Actions, ofType } from '@ngrx/effects'
import { subscribeTwo } from '~app/util/util'
import { pipe } from 'rxjs'
import { CreateData } from '~app/workshops/services/workshop.service'

@Component({
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.scss'],
})
export class AddWorkshopComponent {
  pending = false
  constructor(
    private store: Store<State>,
    private actions$: Actions<WorkshopApiAction>,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  add(data: WorkshopForm) {
    this.pending = true
    console.log('Creating workshop with form data', data)
    const action = new WorkshopCreate({
      workshop: toWorkshopChanges(data) as CreateData,
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
          'An error occurred and the workshop could not be created',
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
