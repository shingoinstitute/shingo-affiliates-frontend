import { Component } from '@angular/core'
import { MatDialog } from '@angular/material'

import { User } from '../../services/user.service'
import { ChangePasswordDialog } from '../../components/change-password-dialog/change-password-dialog.component'
import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { LocaleService } from '../../../services/locale/locale.service'
import { FormGroup, FormControl } from '@angular/forms'
import { bcp47Validator } from '../../../services/locale/bcp47validator'
import { Observable } from 'rxjs'
import { Store, select } from '@ngrx/store'
import * as fromUser from '../../reducers'
import { filter } from 'rxjs/operators'
import { isTruthy } from '~app/util/predicates'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<User>
  profileForm: FormGroup

  constructor(
    private dialog: MatDialog,
    private localeService: LocaleService,
    private store: Store<fromUser.State>,
  ) {
    this.user$ = this.store.pipe(
      select(fromUser.getUser),
      filter(isTruthy),
    )
    this.profileForm = new FormGroup({
      locale: new FormControl(this.localeService.locale, {
        updateOn: 'blur',
        validators: [bcp47Validator(true)],
      }),
    })
  }

  saveLocale() {
    const localeControl = this.profileForm.get('locale')
    if (!localeControl) return
    if (localeControl.invalid) return
    const locale = localeControl.value as string
    this.localeService.locale = locale
    if (locale === '') {
      localeControl.setValue(this.localeService.locale)
    }
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog)
    dialogRef.afterClosed().subscribe(message => {
      if (message) {
        this.dialog.open(SimpleMessageDialog, { data: message })
      }
    })
  }
}
