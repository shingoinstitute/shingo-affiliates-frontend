import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { DashboardComponent } from './interface/dashboard/dashboard.component';
import { AddWorkshopComponent } from './interface/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './interface/edit-workshop/edit-workshop.component';
import { WorkshopDashboardComponent } from './interface/workshop-dashboard/workshop-dashboard.component';
import { ProfileComponent } from './interface/profile/profile.component';
import { LoginComponent } from './interface/login/login.component';
import { SupportComponent } from './interface/support/support.component';
import { SupportTrainingComponent } from './interface/support/support-training/support-training.component';
import { AdminPanelComponent } from './interface/admin-panel/admin-panel.component';
import { WorkshopDetailComponent } from './interface/workshops/workshop-detail/workshop-detail.component';
import { PasswordResetComponent } from './interface/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './interface/forgot-password/forgot-password.component';

/** Shared Module Components */
import { IsValidResolver } from './services/auth/is-valid.resolver';
import { UserResolver } from './services/auth/user.resolver';

/** Workshops */
import { WorkshopComponent } from './workshops/workshop/workshop.component';
import { WorkshopResolver } from './workshops/workshop.resolver';

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workshops/new', component: AddWorkshopComponent, resolve: { user: UserResolver } },
  { path: 'workshops/:id/edit', component: EditWorkshopComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'workshops/:id', component: WorkshopDetailComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'workshops', component: WorkshopDashboardComponent, canActivate: [IsValidResolver], resolve: { user: UserResolver } },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/training', component: SupportTrainingComponent },
  { path: 'support/training/:video', component: SupportTrainingComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: PasswordResetComponent },
  {
    path: 'admin',
    loadChildren: 'app/interface/admin-panel/admin-panel.module#AdminPanelModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
