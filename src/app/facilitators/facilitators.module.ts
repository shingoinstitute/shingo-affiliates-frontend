import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';
import { AffiliatesModule } from '../affiliates/affiliates.module';

import { AdminFacilitatorTabComponent } from './admin-facilitator-tab/admin-facilitator-tab.component';
import { FacilitatorDataTableComponent } from './facilitator-data-table/facilitator-data-table.component';
import { FacilitatorFormComponent } from './facilitator-form/facilitator-form.component';

// Material Design imports
import { 
  MdIconModule, 
  MdTableModule, 
  MdPaginatorModule, 
  MdSortModule, 
  MdFormFieldModule, 
  MdOptionModule, 
  MdDialogModule,
  MdSelectModule,
  MdSnackBarModule,
  MdButtonModule,
  MdInputModule,
  MdProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    
    MdIconModule,
    MdTableModule,
    MdPaginatorModule,
    MdSortModule,
    MdFormFieldModule,
    MdOptionModule,
    MdDialogModule,
    MdSelectModule,
    MdSnackBarModule,
    MdButtonModule,
    MdInputModule,
    MdProgressSpinnerModule,

    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule.forRoot(),
    AffiliatesModule
  ],
  declarations: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
  ],
  exports: [
    AdminFacilitatorTabComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
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
