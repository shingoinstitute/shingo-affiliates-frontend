import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, MdDialogModule } from '@angular/material';
import { FillViewHeightDirective } from './directives/fill-height.directive';
import { IconLegendComponent } from './components/icon-legend/icon-legend.component';
import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component';

@NgModule({
  declarations: [
    IconLegendComponent,
    SimpleMessageDialog
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MdDialogModule
  ],
  exports: [
    IconLegendComponent,
    SimpleMessageDialog,
    MdDialogModule
  ],
  entryComponents: [
    SimpleMessageDialog
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [FillViewHeightDirective]
    };
  }
}
