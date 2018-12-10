import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CustomFormsModule } from 'ng2-validation'
import { RouterModule } from '@angular/router'

import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'

/** Workshop Module Components */
import { WorkshopComponent } from './components/workshop/workshop.component'
import { WorkshopDataTableComponent } from './components/workshop-data-table/workshop-data-table.component'
import { WorkshopFormComponent } from './components/workshop-form/workshop-form.component'
import { WorkshopResolver } from './workshop.resolver'
import { ActionPendingComponent } from './components/action-pending/action-pending.component'
import { AddWorkshopComponent } from './pages/add-workshop/add-workshop.component'
import { EditWorkshopComponent } from './pages/edit-workshop/edit-workshop.component'
import { UpcomingWorkshopsComponent } from './components/upcoming-workshops/upcoming-workshops.component'
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component'
import { WorkshopDetailComponent } from './pages/workshop-detail/workshop-detail.component'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search'

// Material Design imports
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatCardModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatExpansionModule,
} from '@angular/material'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { UIComponentsModule } from '../ui-components/ui-components.module'
import { DashboardComponent } from './dashboard/dashboard.component'

const COMPONENTS = [
  WorkshopComponent,
  WorkshopDataTableComponent,
  WorkshopFormComponent,
  ActionPendingComponent,
  AddWorkshopComponent,
  EditWorkshopComponent,
  UpcomingWorkshopsComponent,
  WorkshopDashboardComponent,
  WorkshopDetailComponent,
  DashboardComponent,
]

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
    MatMomentDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,

    FlexLayoutModule,
    UIComponentsModule,
    SharedModule.forRoot(),
    RouterModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [WorkshopResolver],
})
export class WorkshopsModule {}
