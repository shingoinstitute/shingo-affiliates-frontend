import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk';

import { SharedModule } from '../shared/shared.module';
// import { UIComponentsModule } from '../ui-components/ui-components.module';
import { AffiliatesModule } from '../affiliates/affiliates.module';

import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component';
import { FacilitatorDataTableComponent } from './facilitator-data-table/facilitator-data-table.component';
import { FacilitatorFormComponent } from './facilitator-form/facilitator-form.component';
import { FacilitatorLookupComponent } from './facilitator-lookup/facilitator-lookup.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // UIComponentsModule,
    SharedModule.forRoot(),
    AffiliatesModule
  ],
  declarations: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent,
    FacilitatorLookupComponent
  ],
  exports: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent,
    FacilitatorLookupComponent
  ],
  entryComponents: [
    FacilitatorFormComponent
  ]
})
export default class FacilitatorsModule { }

export {
  FacilitatorsModule,
  FacilitatorDataTableComponent,
  FacilitatorFormComponent,
  AdminFacilitatorTabComponent
};

// export * from './facilitator.model';
