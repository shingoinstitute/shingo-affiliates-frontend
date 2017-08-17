import { NgModule, ModuleWithProviders } from '@angular/core';
import { FillViewHeightDirective } from './directives/fill-height.directive';

@NgModule({})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [FillViewHeightDirective]
    }
  }
}
