import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StoreModule } from '@ngrx/store'
import { reducers } from './reducers'
import { EffectsModule } from '@ngrx/effects'
import { UserEffects } from './effects/user.effects'
import { ChangePasswordDialog } from './components/change-password-dialog/change-password-dialog.component'
// import { PasswordResetComponent } from './components/password-reset/password-reset.component'
import { ProfileComponent } from './pages/profile/profile.component'
// import { MaterialModule } from '../material'
import { ReactiveFormsModule } from '@angular/forms'
import { UserRoutingModule } from './user-routing.module'
import { SharedModule } from '../shared/shared.module'
import { SimpleMessageDialog } from '../shared/components/simple-message-dialog/simple-message-dialog.component'
import {
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatDialogModule,
} from '@angular/material'
import { FlexLayoutModule } from '@angular/flex-layout'

export const COMPONENTS = [
  ChangePasswordDialog,
  // PasswordResetComponent,
  ProfileComponent,
]

// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatDialogModule,

    SharedModule,
    ReactiveFormsModule,
    UserRoutingModule,
    // must match the desired name in the global reducer slice
    StoreModule.forFeature('userdata', reducers),
    EffectsModule.forFeature([UserEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: [ChangePasswordDialog, SimpleMessageDialog],
})
export class UserModule {}
