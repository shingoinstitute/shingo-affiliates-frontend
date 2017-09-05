import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';

import { AffiliateFormComponent } from '../../affiliates/affiliate-form/affiliate-form.component';
import { AdminAffiliateTabComponent } from '../../affiliates/admin-affiliate-tab/admin-affiliate-tab.component';
import { AdminFacilitatorTabComponent } from '../../facilitators/admin-facilitator-tab/admin-facilitator-tab.component';
import { FacilitatorFormComponent } from '../../facilitators/facilitator-form/facilitator-form.component';

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
          { path: 'facilitators/form/:id', component: FacilitatorFormComponent },
          { path: 'affiliates/form/:id', component: AffiliateFormComponent },
          { path: '**', redirectTo: 'affiliates' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AdminPanelRoutingModule { }