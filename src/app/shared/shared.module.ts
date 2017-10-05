import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from 'ng2-ckeditor';

import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component';
import { IconLegendComponent } from './components/icon-legend/icon-legend.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { SfLookupComponent } from './components/sf-lookup/sf-lookup.component';

// Material Design imports
import { 
  MdDialogModule, 
  MdAutocompleteModule, 
  MdOptionModule ,
  MdProgressSpinnerModule,
  MdButtonModule,
  MdIconModule,
  MdInputModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MdDialogModule,
    MdAutocompleteModule,
    MdOptionModule,
    MdProgressSpinnerModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,

    CKEditorModule
  ],
  declarations: [
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SfLookupComponent
  ],
  exports: [
    // MdDialogModule,
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
