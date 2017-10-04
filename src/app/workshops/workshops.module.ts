import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2FileDropModule } from 'ng2-file-drop';

import { SharedModule } from '../shared/shared.module';

/** Workshop Module Components */
import { WorkshopComponent } from './workshop/workshop.component';
import { WorkshopDataTableComponent } from './workshop-data-table/workshop-data-table.component';
import { WorkshopFormComponent } from './workshop-form/workshop-form.component';
import { WorkshopResolver } from './workshop.resolver';
import { ActionPendingComponent } from './action-pending/action-pending.component';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { UpcomingWorkshopsComponent } from './upcoming-workshops/upcoming-workshops.component';
import { WorkshopDashboardComponent } from './workshop-dashboard/workshop-dashboard.component';
import { WorkshopDetailComponent } from './workshop-detail/workshop-detail.component';

// import { CdkTableModule } from '@angular/cdk';
// import { MaterialModule } from '@angular/material';
import { 
  MdTableModule, 
  MdPaginatorModule, 
  MdSortModule, 
  MdFormFieldModule, 
  MdAutocompleteModule,
  MdSelectModule,
  MdDatepickerModule,
  MdButtonModule,
  MdProgressSpinnerModule,
  MdIconModule,
  MdCheckboxModule,
  MdProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomFormsModule,
    
    // CdkTableModule,
    // MaterialModule,
    MdTableModule,
    MdPaginatorModule,
    MdSortModule,
    MdFormFieldModule,
    MdAutocompleteModule,
    MdSelectModule,
    MdDatepickerModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdIconModule,
    MdCheckboxModule,
    MdProgressBarModule,

    FlexLayoutModule,
    Ng2FileDropModule,
    SharedModule.forRoot(),
    RouterModule
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
    WorkshopDetailComponent
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
    WorkshopDetailComponent
  ],
  providers: [WorkshopResolver]
})
export class WorkshopsModule { }
