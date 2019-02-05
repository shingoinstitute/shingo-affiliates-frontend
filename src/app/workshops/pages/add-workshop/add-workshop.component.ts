// Angular Modules
import { Component } from '@angular/core'

// App Modules
import { WorkshopBase } from '../../workshop.model'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import {
  WorkshopForm,
  addToWorkshop,
} from '../../components/workshop-form/workshop-form.component'

@Component({
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.scss'],
})
export class AddWorkshopComponent {
  pending = false
  // constructor(
  //   private _ws: WorkshopService,
  //   private router: Router,
  //   private snackbar: MatSnackBar,
  // ) {}

  private create(workshop: WorkshopBase) {
    throw new Error('Unimplemented')
    // this._ws.create(workshop).subscribe(
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

  public add(data: WorkshopForm) {
    this.pending = true
    console.log('Creating workshop with form data', data)
    const workshop = addToWorkshop(data)
    this.create(workshop)
  }
}
