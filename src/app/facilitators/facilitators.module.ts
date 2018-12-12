import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'
import { AffiliatesModule } from '../affiliates/affiliates.module'

import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component'
import { FacilitatorDataTableComponent } from './facilitator-data-table/facilitator-data-table.component'
import { FacilitatorFormComponent } from './facilitator-form/facilitator-form.component'

// Material Design imports
import {
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatOptionModule,
  MatDialogModule,
  MatSelectModule,
  MatSnackBarModule,
  MatButtonModule,
  MatInputModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { FacilitatorFormPageComponent } from './facilitator-form-page.component'

@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule.forRoot(),
    AffiliatesModule,
  ],
  declarations: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent,
    FacilitatorFormPageComponent,
  ],
  exports: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent,
    FacilitatorFormPageComponent,
  ],
  entryComponents: [FacilitatorFormPageComponent],
})
export default class FacilitatorsModule {}

export {
  FacilitatorsModule,
  FacilitatorDataTableComponent,
  FacilitatorFormComponent,
  FacilitatorFormPageComponent,
  AdminFacilitatorTabComponent,
}

// export * from './facilitator.model';
