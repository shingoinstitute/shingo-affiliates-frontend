import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk';
import { AffiliateDataTableComponent } from './affiliate-data-table/affiliate-data-table.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';
import { SharedModule } from '../shared/shared.module';
import { AdminFacilitatorTabComponent } from '../facilitators/admin-facilitator-tab/admin-facilitator-tab.component';
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component';

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    CdkTableModule,
    SharedModule.forRoot()
  ],
  declarations: [
    AffiliateDataTableComponent,
    AffiliateFormComponent
  ],
  exports: [
    AffiliateDataTableComponent,
    AffiliateFormComponent
  ],
  entryComponents: [
    AffiliateFormComponent
  ]
})
export class AffiliatesModule { }

export {
  AffiliateDataTableComponent,
  AffiliateFormComponent,
  AdminFacilitatorTabComponent,
  AdminAffiliateTabComponent
};

export * from './affiliate.model';
