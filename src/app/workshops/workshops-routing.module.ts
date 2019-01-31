import { Routes, RouterModule, Route } from '@angular/router'
import { AddWorkshopComponent } from './pages/add-workshop/add-workshop.component'
import { AuthGuard } from '~app/auth/services/auth-guard.service'
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component'
import { NgModule } from '@angular/core'
import { WorkshopDetailPageComponent } from './pages/workshop-detail-page/workshop-detail-page.component'

export const editRoute: Route = {
  path: 'workshops/:id/edit',
  component: WorkshopDetailPageComponent,
  canActivate: [AuthGuard],
  //  resolve: { workshop: 'hi' },
}

export const detailRoute: Route = {
  path: 'workshops/:id',
  component: WorkshopDetailPageComponent,
  canActivate: [AuthGuard],
  // resolve: { workshop: WorkshopResolver },
}

export const dashboardRoute: Route = {
  path: 'workshops',
  component: WorkshopDashboardComponent,
  canActivate: [AuthGuard],
}

export const routes: Routes = [
  {
    path: 'workshops/new',
    component: AddWorkshopComponent,
    canActivate: [AuthGuard],
  },
  editRoute,
  detailRoute,
  dashboardRoute,
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WorkshopsRoutingModule {}
