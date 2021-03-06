import { debounceTime } from 'rxjs/operators'
import { Component } from '@angular/core'
import { Facilitator } from '../../facilitators/facilitator.model'
import { FacilitatorService } from '../../services/facilitator/facilitator.service'
import { MatSnackBar, MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component'
import { FacilitatorFilterFactory } from '../../services/filters/facilitators/facilitator-filter-factory.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { Filter } from '../../services/filters/filter.abstract'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-admin-facilitator-tab',
  templateUrl: './admin-facilitator-tab.component.html',
  styleUrls: ['./admin-facilitator-tab.component.scss'],
})
export class AdminFacilitatorTabComponent implements OnInit {
  public isLoading = true
  public displayedColumns: string[] = ['name']
  public newFacilitator!: Facilitator
  public filters: Array<Filter<Facilitator, any>> = []
  public nameFilterControl = new FormControl('')

  constructor(
    public _fs: FacilitatorService,
    public filterFactory: FacilitatorFilterFactory,
    public snackbar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  public ngOnInit() {
    // Create text filter to filter facilitators by name.
    const textFilter = this.filterFactory.createTextFilter('Filter By Name')
    // Add the filter to `this.filters`, which is then passed into the data-table in `admin-facilitator-tabl.component.html`.
    this.filters.push(textFilter)
    textFilter.active = true

    // Create an observalbe that listens to changes to the `nameFilterInput` input field
    const nameFilterInputChange = this.nameFilterControl.valueChanges.pipe(
      debounceTime(250),
    )
    // Subscribe to the event listener. When a user types inside the input field, the nameFilter is notified of changes and the data table should update accordingly.
    nameFilterInputChange.subscribe(value => {
      const nameFilter = this.filters.find(f => f.name === 'Filter By Name')
      if (nameFilter) {
        nameFilter.criteria = value
      }
    })
  }

  public onSave(facilitator: Facilitator) {
    this.isLoading = true
    this.snackbar.open('Saving Changes...')
    if (facilitator.sfId === '') {
      this.create(facilitator)
    } else {
      this.update(facilitator)
    }
  }

  public onDelete(f: Facilitator) {
    const msg = `
      Are you sure you want to delete <strong>${
        f.name
      }'s</strong> account? This action cannot be undone.
      <br>
      <span class="mat-caption">This action will delete the user's contact information from Salesforce and remove them from the database.</span>
    `
    const title = `Delete ${f.constructor.name}?`
    this.presentAlertDialog(f, msg, title, true)
  }

  public onDisable(f: Facilitator) {
    const msg = `
    Are you sure you want to disable <strong>${f.name}'s</strong> account?
    <br>
    <span class="mat-caption">This action will remove the user's ability to login without deleting their account information.</span>
    `
    const title = `Disable ${f.constructor.name}?`
    this.presentAlertDialog(f, msg, title)
  }

  public presentAlertDialog(
    f: Facilitator,
    msg: string,
    title: string = '',
    shouldDelete: boolean = false,
  ) {
    const dialogBoxRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title,
        sfObject: f,
        message: msg,
      },
    })

    dialogBoxRef.afterClosed().subscribe(result => {
      if (result === true && shouldDelete) {
        this.delete(f)
      } else if (result === true) {
        this.disable(f)
      }
    })
  }

  public onResetPassword(f: Facilitator) {
    const dialogReg = this.dialog.open(AlertDialogComponent, {
      data: {
        title: `Reset Password?`,
        sfObject: f,
        message: `Send password-reset email to ${f.name}?`,
      },
    })

    dialogReg.afterClosed().subscribe(result => {
      if (result === true) {
        this.resetPassword(f)
      }
    })
  }

  public resetPassword(fac: Facilitator) {
    this.isLoading = true
    this.snackbar.open(`Sending password reset email to ${fac.email}...`)
    this._fs.resetPassword(fac.email).subscribe(
      data => {
        this.apiCallbackHandler(data)
        this.snackbar.open('Password reset email has been sent.', undefined, {
          duration: 2000,
        })
      },
      err => {
        this.apiCallbackHandler(null, err)
      },
    )
  }

  public update(fac: Facilitator) {
    this._fs.update(fac).subscribe(
      data => {
        this.apiCallbackHandler(data)
        this.snackbar.open('Facilitator Successfully Updated', undefined, {
          duration: 2000,
        })
      },
      err => {
        this.apiCallbackHandler(null, err)
      },
    )
  }

  public create(facilitator: Facilitator) {
    this._fs.create(facilitator).subscribe(
      data => {
        this.apiCallbackHandler(data)
        this.snackbar.open('Facilitator Succesfully Created', undefined, {
          duration: 2000,
        })
      },
      err => {
        this.apiCallbackHandler(null, err)
      },
    )
  }

  public delete(fac: Facilitator) {
    this.isLoading = true
    this.snackbar.open(`Deleting ${fac.name}'s Account...`)
    this._fs.delete(fac).subscribe(
      data => {
        this.apiCallbackHandler(data)
        this.snackbar.open('Facilitator Successfully Deleted.', undefined, {
          duration: 2000,
        })
      },
      err => {
        this.apiCallbackHandler(null, err)
      },
    )
  }

  public disable(fac: Facilitator) {
    this.isLoading = true
    this.snackbar.open(`Disabling ${fac.name}'s Account...`)
    this._fs.disable(fac).subscribe(
      data => {
        this.apiCallbackHandler(data)
        this.snackbar.open('Facilitator Successfully Disabled', 'Okay', {
          duration: 2000,
        })
      },
      err => {
        this.apiCallbackHandler(null, err)
      },
    )
  }

  public apiCallbackHandler(data?: any, err?: any) {
    this.isLoading = false
    this._fs.reloadData$.emit()
    if (err) {
      this.snackbar.open(
        'An error occured and the requested operation could not be completed.',
        'Okay',
        { duration: 3000 },
      )
      console.error(err)
    }
  }
}
