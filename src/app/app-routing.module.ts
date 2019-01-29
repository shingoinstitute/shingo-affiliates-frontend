import { NgModule } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router'

/** Interface Components */
// import { DashboardComponent } from './workshops/dashboard/dashboard.component'
// import { AddWorkshopComponent } from './workshops/add-workshop/add-workshop.component'
// import { EditWorkshopComponent } from './workshops/edit-workshop/edit-workshop.component'
// import { WorkshopDashboardComponent } from './workshops/workshop-dashboard/workshop-dashboard.component'
// import { WorkshopDetailComponent } from './workshops/workshop-detail/workshop-detail.component'
import { PasswordResetComponent } from './ui-components/user-auth/password-reset/password-reset.component'
import { ForgotPasswordComponent } from './ui-components/user-auth/forgot-password/forgot-password.component'
import { ForbiddenPageComponent } from './core/pages/forbidden-page/forbidden-page.component'
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component'

/** Shared Module Components */
// import { IsValidGuard } from './services/auth/is-valid.guard'
// import { UserResolver } from './services/auth/user.resolver'
// import { IsAdminGuard } from './services/auth/is-admin.guard'

/** Workshops */
// import { WorkshopComponent } from './workshops/workshop/workshop.component'
// import { WorkshopResolver } from './workshops/workshop.resolver'
import { AuthGuard } from './auth/services/auth-guard.service'
// import { SuccessComponent } from './success.component'
import { DashboardComponent } from './core/pages/dashboard/dashboard.component'

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'workshops/new',
  //   component: AddWorkshopComponent,
  //   canActivate: [IsValidGuard],
  //   resolve: { user: UserResolver },
  // },
  // {
  //   path: 'workshops/:id/edit',
  //   component: EditWorkshopComponent,
  //   canActivate: [IsValidGuard],
  //   resolve: { workshop: WorkshopResolver },
  // },
  // {
  //   path: 'workshops/:id',
  //   component: WorkshopDetailComponent,
  //   canActivate: [IsValidGuard],
  //   resolve: { workshop: WorkshopResolver },
  // },
  // {
  //   path: 'workshops',
  //   component: WorkshopDashboardComponent,
  //   canActivate: [IsValidGuard],
  //   resolve: { user: UserResolver },
  // },
  // {
  //   path: 'profile',
  //   component: ProfileComponent,
  //   canActivate: [IsValidGuard],
  //   resolve: { user: UserResolver },
  // },
  // { path: 'login', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: PasswordResetComponent },
  { path: '403', component: ForbiddenPageComponent },
  // {
  //   path: 'support',
  //   loadChildren: 'app/support/support.module#SupportModule',
  // },
  // {
  //   path: 'admin',
  //   loadChildren:
  //     'app/ui-components/admin-panel/admin-panel.module#AdminPanelModule',
  //   canActivate: [IsValidGuard, IsAdminGuard],
  // },
  { path: '**', component: PageNotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
