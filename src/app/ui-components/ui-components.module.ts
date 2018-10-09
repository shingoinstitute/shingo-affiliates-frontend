import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout'

import { WorkshopsModule } from '../workshops/workshops.module'
import { AdminPanelModule } from './admin-panel/admin-panel.module'

import { DashboardComponent } from './dashboard/dashboard.component'
import { LoginComponent } from './user-auth/login/login.component'
import { FormsEvalsComponent } from './materials/forms-evals/forms-evals.component'
import { MarketingMaterialsComponent } from './materials/marketing-materials/marketing-materials.component'
import { WorkshopMaterialsComponent } from './materials/workshop-materials/workshop-materials.component'
import { ProfileComponent } from './user-auth/profile/profile.component'
import { QuickDetailsComponent } from './quick-details/quick-details.component'
import { QuickDetailItemComponent } from './quick-details/quick-detail-item/quick-detail-item.component'
import { PasswordResetComponent } from './user-auth/password-reset/password-reset.component'
import { ForgotPasswordComponent } from './user-auth/forgot-password/forgot-password.component'
import { ChangePasswordDialog } from './user-auth/change-password-dialog/change-password-dialog.component'
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { MaterialsDialog } from './materials/materials-dialog/materials-dialog.component'

// Material Design imports
import {
  MatNativeDateModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatInputModule,
  MatToolbarModule,
  MatDialogModule,
  MatCardModule,
} from '@angular/material'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,

    FlexLayoutModule,
    WorkshopsModule,
    AdminPanelModule,
  ],
  declarations: [
    DashboardComponent,
    LoginComponent,
    FormsEvalsComponent,
    MarketingMaterialsComponent,
    WorkshopMaterialsComponent,
    ProfileComponent,
    QuickDetailItemComponent,
    QuickDetailsComponent,
    MaterialsDialog,
    PasswordResetComponent,
    ForgotPasswordComponent,
    ChangePasswordDialog,
    ForbiddenPageComponent,
    PageNotFoundComponent,
  ],
  exports: [
    DashboardComponent,
    LoginComponent,
    FormsEvalsComponent,
    MarketingMaterialsComponent,
    WorkshopMaterialsComponent,
    ProfileComponent,
    QuickDetailItemComponent,
    QuickDetailsComponent,
    MaterialsDialog,
  ],
  entryComponents: [ChangePasswordDialog, MaterialsDialog],
})
export class UIComponentsModule {}
