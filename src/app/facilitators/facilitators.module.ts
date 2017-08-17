import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitatorComponent } from './facilitator/facilitator.component';
import { FacilitatorDataTableComponent } from './facilitator-data-table/facilitator-data-table.component';
import { FacilitatorFormComponent } from './facilitator-form/facilitator-form.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FacilitatorComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
  ],
  exports: [
    FacilitatorComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent
  ]
})
export class FacilitatorsModule { }

export {
  FacilitatorComponent,
  FacilitatorDataTableComponent,
  FacilitatorFormComponent
}

export * from './Facilitator';
