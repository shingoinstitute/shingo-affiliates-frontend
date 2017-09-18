import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdDialogModule } from '@angular/material';

import { CKEditorModule } from 'ng2-ckeditor';

import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component';
import { IconLegendComponent } from './components/icon-legend/icon-legend.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { SfLookupComponent } from './components/sf-lookup/sf-lookup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MdDialogModule,
    CKEditorModule
  ],
  declarations: [
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SfLookupComponent
  ],
  exports: [
    MdDialogModule,
    CKEditorModule,
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SfLookupComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    SimpleMessageDialog
  ]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
