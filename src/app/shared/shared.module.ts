import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { FillViewHeightDirective } from './directives/fill-height.directive';
import { IconLegendComponent } from "./components/icon-legend/icon-legend.component";
import { AffiliateLookupComponent } from './components/affiliate-lookup/affiliate-lookup.componet';

@NgModule({
   declarations: [
      IconLegendComponent,
      AffiliateLookupComponent
   ],
   imports: [ 
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
   ],
   exports: [
      IconLegendComponent,
      AffiliateLookupComponent
   ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [FillViewHeightDirective]
    }
  }
}
