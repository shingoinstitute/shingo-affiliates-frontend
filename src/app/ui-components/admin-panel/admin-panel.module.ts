import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
// import { MaterialModule } from '@angular/material';

import { AdminPanelComponent } from './admin-panel.component';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AffiliatesModule } from '../../affiliates/affiliates.module';
import { FacilitatorsModule } from '../../facilitators/facilitators.module';

@NgModule({
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    FlexLayoutModule,
    // MaterialModule,
    AffiliatesModule,
    FacilitatorsModule
  ],
  declarations: [
    AdminPanelComponent,
    AdminTabsComponent
  ]
})
export class AdminPanelModule { }
