import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component';
import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';

@NgModule({
   imports: [
      CommonModule,
      AdminPanelRoutingModule
   ],
   declarations: [
      AdminPanelComponent,
      AdminTabsComponent,
      AdminAffiliateTabComponent,
      AdminFacilitatorTabComponent
   ]
})
export class AdminPanelModule { }
