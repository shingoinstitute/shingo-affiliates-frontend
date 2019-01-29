// Angular Modules
import { Component, Input } from '@angular/core'

// App Modules
import { WorkshopBase, workshop } from '~app/workshops/workshop.model'
import {
  WorkshopForm,
  addToWorkshop,
} from '../workshop-form/workshop-form.component'

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.scss'],
})
export class EditWorkshopComponent {
  @Input()
  workshop: WorkshopBase = workshop()
  pending = false

  constructor() // private _ws: WorkshopService,
  // private router: Router,
  // private snackbar: MatSnackBar,
  {}

  private update(workshop: WorkshopBase) {
    throw new Error('Unimplemented')
    // this._ws.update(workshop).subscribe(
    //   (result: SFSuccessResult) => {
    //     this.pending = false
    //     this.router.navigateByUrl(`/workshops/${result.id}`)
    //   },
    //   err => {
    //     console.error('Error submitting workshop', err)
    //     this.pending = false
    //     this.snackbar.open(
    //       'An error occurred and the requested operation could not be completed.',
    //       'Ok',
    //       { panelClass: ['md-warn'] },
    //     )
    //   },
    // )
  }

  public save(data: WorkshopForm) {
    this.pending = true
    this.workshop = addToWorkshop(data, this.workshop)
    this.update(this.workshop)
  }
}
