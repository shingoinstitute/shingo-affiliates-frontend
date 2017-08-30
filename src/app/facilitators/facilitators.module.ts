import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk';
import { FacilitatorDataTableComponent } from './facilitator-data-table/facilitator-data-table.component';
import { FacilitatorFormComponent } from './facilitator-form/facilitator-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule.forRoot()
  ],
  declarations: [
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
  ],
  exports: [
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
  ],
  entryComponents: [
    FacilitatorFormComponent
  ]
})
export class FacilitatorsModule { }

export {
  FacilitatorDataTableComponent,
  FacilitatorFormComponent
};

export * from './facilitator.model';
