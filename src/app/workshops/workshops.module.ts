import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CustomFormsModule } from 'ng2-validation'

import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'

/** Workshop Module Components */
import { WorkshopComponent } from './components/workshop/workshop.component'
import { WorkshopDataTableComponent } from './components/workshop-data-table/workshop-data-table.component'
import { WorkshopFormComponent } from './components/workshop-form/workshop-form.component'
import { ActionPendingComponent } from './components/action-pending/action-pending.component'
import { AddWorkshopComponent } from './pages/add-workshop/add-workshop.component'
import { EditWorkshopComponent } from './components/edit-workshop/edit-workshop.component'
import { UpcomingWorkshopsComponent } from './components/upcoming-workshops/upcoming-workshops.component'
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component'
import { WorkshopDetailComponent } from './components/workshop-detail/workshop-detail.component'
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
import { WorkshopsRoutingModule } from './workshops-routing.module'
import { StoreModule } from '@ngrx/store'
import { ROOT_KEY } from './reducers'
import { EffectsModule } from '@ngrx/effects'
import { WorkshopEffects } from './effects/workshop.effects'
import { RouterModule } from '@angular/router'
import { reducer } from './reducers/workshops.reducer'
import { WorkshopFocusComponent } from './pages/workshop-focus/workshop-focus.component'

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
  WorkshopFocusComponent,
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
    WorkshopsRoutingModule,
    StoreModule.forFeature(ROOT_KEY, reducer),
    EffectsModule.forFeature([WorkshopEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class WorkshopsModule {}
