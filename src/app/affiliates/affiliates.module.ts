import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { AffiliateDataTableComponent } from './affiliate-data-table/affiliate-data-table.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    CdkTableModule,
    SharedModule.forRoot()
  ],
  declarations: [
    AffiliateComponent,
    AffiliateDataTableComponent,
    AffiliateFormComponent
  ],
  exports: [
    AffiliateComponent,
    AffiliateDataTableComponent,
    AffiliateFormComponent
  ],
  entryComponents: [
    AffiliateFormComponent
  ]
})
export class AffiliatesModule { }

export * from './Affiliate';
