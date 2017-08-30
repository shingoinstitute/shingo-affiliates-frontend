import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { DashboardComponent } from './interface/dashboard/dashboard.component';
import { AddWorkshopComponent } from './interface/workshops/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './interface/workshops/edit-workshop/edit-workshop.component';
import { WorkshopDashboardComponent } from './interface/workshops/workshop-dashboard/workshop-dashboard.component';
import { ProfileComponent } from './interface/user-auth/profile/profile.component';
import { LoginComponent } from './interface/user-auth/login/login.component';
import { SupportComponent } from './interface/support/support.component';
import { SupportTrainingComponent } from './interface/support/support-training/support-training.component';
import { AdminPanelComponent } from './interface/admin-panel/admin-panel.component';
import { WorkshopDetailComponent } from './interface/workshops/workshop-detail/workshop-detail.component';
import { PasswordResetComponent } from './interface/user-auth/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './interface/user-auth/forgot-password/forgot-password.component';
import { ForbiddenPageComponent } from './interface/forbidden-page/forbidden-page.component';

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
  { path: 'profile', component: ProfileComponent, resolve: { user: UserResolver } },
  { path: 'login', component: LoginComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/training', component: SupportTrainingComponent },
  { path: 'support/training/:video', component: SupportTrainingComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: PasswordResetComponent },
  { path: '403', component: ForbiddenPageComponent },
  {
    path: 'admin',
    loadChildren: 'app/interface/admin-panel/admin-panel.module#AdminPanelModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
