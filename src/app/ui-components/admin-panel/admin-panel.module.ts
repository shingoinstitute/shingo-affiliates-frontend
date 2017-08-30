import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';

import { AffiliatesModule, AdminAffiliateTabComponent, AdminFacilitatorTabComponent } from '../../affiliates/affiliates.module';
import { FacilitatorsModule } from '../../facilitators/facilitators.module';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

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
    AlertDialogComponent,
    AdminFacilitatorTabComponent
  ],
  entryComponents: [
    AlertDialogComponent
  ]
})
export class AdminPanelModule { }
