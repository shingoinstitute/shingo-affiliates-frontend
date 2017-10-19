import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { DashboardComponent } from './ui-components/dashboard/dashboard.component';
import { AddWorkshopComponent } from './workshops/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './workshops/edit-workshop/edit-workshop.component';
import { WorkshopDashboardComponent } from './workshops/workshop-dashboard/workshop-dashboard.component';
import { ProfileComponent } from './ui-components/user-auth/profile/profile.component';
import { LoginComponent } from './ui-components/user-auth/login/login.component';
import { AdminPanelComponent } from './ui-components/admin-panel/admin-panel.component';
import { WorkshopDetailComponent } from './workshops/workshop-detail/workshop-detail.component';
import { PasswordResetComponent } from './ui-components/user-auth/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './ui-components/user-auth/forgot-password/forgot-password.component';
import { ForbiddenPageComponent } from './ui-components/forbidden-page/forbidden-page.component';
import { PageNotFoundComponent } from './ui-components/page-not-found/page-not-found.component';
import { SupportHomeComponent } from './support/support-home.component';


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
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: PasswordResetComponent },
  { path: '403', component: ForbiddenPageComponent },
  { 
    path: 'support', 
    loadChildren: 'app/support/support.module#SupportModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/ui-components/admin-panel/admin-panel.module#AdminPanelModule'
  },
  { path: '**', component: PageNotFoundComponent }
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
