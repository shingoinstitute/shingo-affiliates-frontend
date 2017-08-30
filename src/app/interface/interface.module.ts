import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { MdNativeDateModule, MdDatepickerModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { FlexLayoutModule } from '@angular/flex-layout';

import { WorkshopsModule } from '../workshops/workshops.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user-auth/login/login.component';
import { FormsEvalsComponent } from './materials/forms-evals/forms-evals.component';
import { MarketingMaterialsComponent } from './materials/marketing-materials/marketing-materials.component';
import { WorkshopMaterialsComponent } from './materials/workshop-materials/workshop-materials.component';
import { ProfileComponent } from './user-auth/profile/profile.component';
import { QuickDetailsComponent } from './quick-details/quick-details.component';
import { QuickDetailItemComponent } from './quick-details/quick-detail-item/quick-detail-item.component';
import { SupportComponent } from './support/support.component';
import { SupportTrainingComponent } from './support/support-training/support-training.component';
import { AddWorkshopComponent } from './workshops/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './workshops/edit-workshop/edit-workshop.component';
import { WorkshopDashboardComponent } from './workshops/workshop-dashboard/workshop-dashboard.component';
import { UpcomingWorkshopsComponent } from './workshops/upcoming-workshops/upcoming-workshops.component';
import { ActionPendingComponent } from './workshops/action-pending/action-pending.component';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { WorkshopDetailComponent } from './workshops/workshop-detail/workshop-detail.component';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { PasswordResetComponent } from './user-auth/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './user-auth/forgot-password/forgot-password.component';
import { ChangePasswordDialog } from './user-auth/change-password-dialog/change-password-dialog.component';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { MaterialsDialog } from './materials/materials-dialog/materials-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CdkTableModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule,
    WorkshopsModule,
    CommonModule,
    AdminPanelModule,
    Ng2FileDropModule,
    SharedModule.forRoot()
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
    SupportComponent,
    SupportTrainingComponent,
    AddWorkshopComponent,
    EditWorkshopComponent,
    WorkshopDashboardComponent,
    UpcomingWorkshopsComponent,
    ActionPendingComponent,
    WorkshopDetailComponent,
    PasswordResetComponent,
    ForgotPasswordComponent,
    ChangePasswordDialog,
    ForbiddenPageComponent,
    MaterialsDialog
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
    SupportComponent,
    SupportTrainingComponent,
    AddWorkshopComponent,
    EditWorkshopComponent,
    WorkshopDashboardComponent,
    UpcomingWorkshopsComponent,
    MaterialsDialog
  ],
  entryComponents: [
    ChangePasswordDialog,
    MaterialsDialog
  ]
})
export class InterfaceModule { }
