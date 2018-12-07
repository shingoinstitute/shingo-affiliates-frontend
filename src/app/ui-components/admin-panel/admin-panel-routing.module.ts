import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AdminPanelComponent } from './admin-panel.component'
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component'

import { AdminAffiliateTabComponent } from '../../affiliates/admin-affiliate-tab/admin-affiliate-tab.component'
import { AdminFacilitatorTabComponent } from '../../facilitators/admin-facilitator-tab/admin-facilitator-tab.component'
import { AffiliateFormPageComponent } from '../../affiliates/affiliate-form-page.component'
import { FacilitatorFormPageComponent } from '../../facilitators/facilitators.module'

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path: '',
        component: AdminTabsComponent,
        children: [
          { path: 'affiliates', component: AdminAffiliateTabComponent },
          { path: 'facilitators', component: AdminFacilitatorTabComponent },
          {
            path: 'facilitators/form/:id',
            component: FacilitatorFormPageComponent,
          },
          {
            path: 'affiliates/form/:id',
            component: AffiliateFormPageComponent,
          },
        ],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminPanelRoutingModule {}
