import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { AffiliateDataTableComponent } from './affiliate-data-table/affiliate-data-table.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';

@NgModule({
  imports: [
    CommonModule
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
  ]
})
export class AffiliatesModule { }

export {
  AffiliateComponent,
  AffiliateDataTableComponent,
  AffiliateFormComponent
}

export * from './Affiliate';