import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SuccessComponent } from './success.component'
import { AuthGuard } from './auth/services/auth-guard.service'
import { ForbiddenPageComponent } from './core/pages/forbidden-page/forbidden-page.component'
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component'

const appRoutes: Routes = [
  { path: '', redirectTo: '/success', pathMatch: 'full' },
  { path: 'success', component: SuccessComponent, canActivate: [AuthGuard] },
  { path: '403', component: ForbiddenPageComponent },
  { path: '**', component: PageNotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
