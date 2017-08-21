import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component';
import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component';

const adminRoutes: Routes = [
   { 
      path: '', 
      component: AdminTabsComponent,
      children: [
         { path: 'affiliates', component: AdminAffiliateTabComponent },
         { path: 'facilitators', component: AdminFacilitatorTabComponent }
      ]
   }
]

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