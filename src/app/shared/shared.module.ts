import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FillViewHeightDirective } from './directives/fill-height.directive';
import { IconLegendComponent } from "./components/icon-legend/icon-legend.component";

@NgModule({
   declarations: [
      IconLegendComponent
   ],
   imports: [ 
      CommonModule,
      MaterialModule
   ],
   exports: [
      IconLegendComponent
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
