import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CustomFormsModule } from 'ng2-validation'
import { RouterModule } from '@angular/router'

import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'

/** Workshop Module Components */
import { WorkshopComponent } from './workshop/workshop.component'
import { WorkshopDataTableComponent } from './workshop-data-table/workshop-data-table.component'
import { WorkshopFormComponent } from './workshop-form/workshop-form.component'
import { WorkshopResolver } from './workshop.resolver'
import { ActionPendingComponent } from './action-pending/action-pending.component'
import { AddWorkshopComponent } from './add-workshop/add-workshop.component'
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component'
import { UpcomingWorkshopsComponent } from './upcoming-workshops/upcoming-workshops.component'
import { WorkshopDashboardComponent } from './workshop-dashboard/workshop-dashboard.component'
import { WorkshopDetailComponent } from './workshop-detail/workshop-detail.component'

// Material Design imports
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatDatepickerModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatCardModule,
} from '@angular/material'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomFormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCardModule,

    FlexLayoutModule,
    SharedModule.forRoot(),
    RouterModule,
  ],
  declarations: [
    WorkshopComponent,
    WorkshopDataTableComponent,
    WorkshopFormComponent,
    ActionPendingComponent,
    AddWorkshopComponent,
    EditWorkshopComponent,
    UpcomingWorkshopsComponent,
    WorkshopDashboardComponent,
    WorkshopDetailComponent,
  ],
  exports: [
    WorkshopComponent,
    WorkshopDataTableComponent,
    WorkshopFormComponent,
    ActionPendingComponent,
    AddWorkshopComponent,
    EditWorkshopComponent,
    UpcomingWorkshopsComponent,
    WorkshopDashboardComponent,
    WorkshopDetailComponent,
  ],
  providers: [WorkshopResolver],
})
export class WorkshopsModule {}
