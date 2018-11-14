import { ProfileComponent } from './pages/profile/profile.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../auth/services/auth-guard.service'

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
