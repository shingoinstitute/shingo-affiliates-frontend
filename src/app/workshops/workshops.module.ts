import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkshopComponent } from './workshop/workshop.component';
import { WorkshopDataTableComponent } from './workshop-data-table/workshop-data-table.component';
import { WorkshopFormComponent } from './workshop-form/workshop-form.component';
import { WorkshopResolver } from './workshop.resolver';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  declarations: [
    WorkshopComponent,
    WorkshopDataTableComponent,
    WorkshopFormComponent
  ],
  exports: [
    WorkshopComponent,
    WorkshopDataTableComponent,
    WorkshopFormComponent
  ],
  providers: [WorkshopResolver]
})
export class WorkshopsModule { }