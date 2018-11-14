import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material'

import { User } from '../../services/user.service'
import { ChangePasswordDialog } from '../../components/change-password-dialog/change-password-dialog.component'
import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { LocaleService } from '../../../shared/services/locale/locale.service'
import { FormGroup, FormControl } from '@angular/forms'
import { bcp47Validator } from '../../../shared/services/locale/bcp47validator'
import { Observable, of } from 'rxjs'
import { Store, select } from '@ngrx/store'
import * as fromUser from '../../reducers'
import { filter } from 'rxjs/operators'
import { truthy } from '../../../util/util'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // we need initial data to prevent errors before the component is constructed
  public user$: Observable<User>
  public profileForm!: FormGroup

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public localeService: LocaleService,
    private store: Store<fromUser.State>,
  ) {
    this.user$ = this.store.pipe(
      select(fromUser.getUser),
      filter(truthy),
    )
  }

  public ngOnInit() {
    this.profileForm = new FormGroup({
      locale: new FormControl(this.localeService.locale, {
        updateOn: 'blur',
        validators: [bcp47Validator(true)],
      }),
    })
  }

  public saveLocale() {
    const localeControl = this.profileForm.get('locale')
    if (!localeControl) return
    if (localeControl.invalid) return
    const locale = localeControl.value as string
    this.localeService.locale = locale
    if (locale === '') {
      localeControl.setValue(this.localeService.locale)
    }
  }

  public changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog)
    dialogRef.afterClosed().subscribe(message => {
      if (message) {
        this.dialog.open(SimpleMessageDialog, { data: message })
      }
    })
  }
}
