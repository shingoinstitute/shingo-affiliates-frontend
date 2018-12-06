import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'

import { AffiliateDataTableComponent } from './affiliate-data-table/affiliate-data-table.component'
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component'
import { AdminAffiliateTabComponent } from './admin-affiliate-tab/admin-affiliate-tab.component'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search'

// Material Design imports
import {
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatOptionModule,
  MatSnackBarModule,
  MatButtonModule,
  MatInputModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material'
import { AffiliateFormPageComponent } from './affiliate-form-page.component'

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,

    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatOptionModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    MatSelectModule,

    FlexLayoutModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    AdminAffiliateTabComponent,
    AffiliateDataTableComponent,
    AffiliateFormPageComponent,
    AffiliateFormComponent,
  ],
  exports: [
    AffiliateDataTableComponent,
    AffiliateFormComponent,
    AffiliateFormPageComponent,
    AdminAffiliateTabComponent,
  ],
  entryComponents: [AffiliateFormPageComponent],
})
export default class AffiliatesModule {}

export {
  AffiliatesModule,
  AffiliateDataTableComponent,
  AffiliateFormComponent,
  AdminAffiliateTabComponent,
}

// export * from './affiliate.model';
