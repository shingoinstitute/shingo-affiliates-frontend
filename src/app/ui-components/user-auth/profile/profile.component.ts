import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material'

import { User } from '../../../shared/models/user.model'
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component'
import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { LocaleService } from '../../../services/locale/locale.service'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user!: User
  public profileForm!: FormGroup

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public localeService: LocaleService,
  ) {}

  public ngOnInit() {
    this.user = this.route.snapshot.data['user']
    this.profileForm = new FormGroup({
      locale: new FormControl(this.localeService.locale),
    })
  }

  public saveLocale() {
    const localeControl = this.profileForm.get('locale')
    if (!localeControl) return
    const locale = localeControl.value as string
    this.localeService.locale = locale
    if (locale === '') {
      localeControl.setValue(this.localeService.locale)
    }
  }

  public changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog)
    dialogRef
      .afterClosed()
      .subscribe(message =>
        this.dialog.open(SimpleMessageDialog, { data: message }),
      )
  }
}
