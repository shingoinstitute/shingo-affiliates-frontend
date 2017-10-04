import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { AffiliateDataTableComponent } from './affiliate-data-table/affiliate-data-table.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component';

// import { CdkTableModule } from '@angular/cdk';
// import { MaterialModule } from '@angular/material';
import { 
  MdIconModule, 
  MdTableModule, 
  MdPaginatorModule, 
  MdSortModule, 
  MdFormFieldModule, 
  MdAutocompleteModule, 
  MdDialogModule, 
  MdOptionModule
} from '@angular/material';

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,

    // MaterialModule,
    MdIconModule,
    MdTableModule,
    MdPaginatorModule,
    MdSortModule,
    MdFormFieldModule,
    MdAutocompleteModule,
    MdDialogModule,
    MdOptionModule,

    FlexLayoutModule,
    // CdkTableModule,
    SharedModule.forRoot()
  ],
  declarations: [
    AdminAffiliateTabComponent,
    AffiliateDataTableComponent,
    AffiliateFormComponent
  ],
  exports: [
    AffiliateDataTableComponent,
    AffiliateFormComponent,
    AdminAffiliateTabComponent
  ],
  entryComponents: [
    AffiliateFormComponent
  ]
})
export default class AffiliatesModule { }

export {
  AffiliatesModule,
  AffiliateDataTableComponent,
  AffiliateFormComponent,
  AdminAffiliateTabComponent
};

// export * from './affiliate.model';
