import { Routes, RouterModule } from '@angular/router'
import { AddWorkshopComponent } from './pages/add-workshop/add-workshop.component'
import { AuthGuard } from '~app/auth/services/auth-guard.service'
import { EditWorkshopComponent } from './pages/edit-workshop/edit-workshop.component'
import { WorkshopResolver } from './services/workshop.resolver'
import { WorkshopDetailComponent } from './pages/workshop-detail/workshop-detail.component'
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component'
import { NgModule } from '@angular/core'

const routes: Routes = [
  {
    path: 'workshops/new',
    component: AddWorkshopComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workshops/:id/edit',
    component: EditWorkshopComponent,
    canActivate: [AuthGuard],
    resolve: { workshop: WorkshopResolver },
  },
  {
    path: 'workshops/:id',
    component: WorkshopDetailComponent,
    canActivate: [AuthGuard],
    resolve: { workshop: WorkshopResolver },
  },
  {
    path: 'workshops',
    component: WorkshopDashboardComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WorkshopsRoutingModule {}
