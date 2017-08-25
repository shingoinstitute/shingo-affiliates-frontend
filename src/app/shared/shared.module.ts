import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffiliateLookupComponent } from './components/affiliate-lookup/affiliate-lookup.componet';
import { FacilitatorLookupComponent } from './components/facilitator-lookup/facilitator-lookup.component';
import { MaterialModule, MdDialogModule } from '@angular/material';
import { FillViewHeightDirective } from './directives/fill-height.directive';
import { IconLegendComponent } from './components/icon-legend/icon-legend.component';
import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
   declarations: [
      IconLegendComponent,
      SimpleMessageDialog,
      AffiliateLookupComponent,
      FacilitatorLookupComponent
   ],
   imports: [ 
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      MdDialogModule,
      FroalaEditorModule.forRoot(),
      FroalaViewModule.forRoot()
   ],
   exports: [
      IconLegendComponent,
      SimpleMessageDialog,
      AffiliateLookupComponent,
      FacilitatorLookupComponent,
      MdDialogModule,
      FroalaEditorModule,
      FroalaViewModule
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
