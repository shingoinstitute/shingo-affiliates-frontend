import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';

/** Affiliate Components */
import { AffiliatesModule } from "../../affiliates/affiliates.module";

/** Faciliatator Components */
import { FacilitatorsModule } from "../../facilitators/facilitators.module";

/** Admin Panel Components */
import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component';
import { ConfirmDeleteAffiliateDialogComponent } from './admin-affiliate-tab/confirm-delete-affiliate-dialog.component';
import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';

@NgModule({
   imports: [
      CommonModule,
      AdminPanelRoutingModule,
      FlexLayoutModule,
      MaterialModule,
      FacilitatorsModule,
      AffiliatesModule
   ],
   declarations: [
      AdminPanelComponent,
      AdminTabsComponent,
      AdminAffiliateTabComponent,
      ConfirmDeleteAffiliateDialogComponent,
      AdminFacilitatorTabComponent
   ],
   entryComponents: [
      ConfirmDeleteAffiliateDialogComponent
   ]
})
export class AdminPanelModule {}
