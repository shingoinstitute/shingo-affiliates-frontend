import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CKEditorModule } from 'ng2-ckeditor'

import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component'
import { IconLegendComponent } from './components/icon-legend/icon-legend.component'
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component'
import { SfLookupComponent } from './components/sf-lookup/sf-lookup.component'
import { TextResponseDialogComponent } from './components/text-response-dialog/text-response-dialog.component'

// Material Design imports
import {
  MatDialogModule,
  MatAutocompleteModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material'
import { FileDropComponent } from './components/file-drop/file-drop.component'
import { FileDisplayComponent } from './components/file-display/file-display.component'
import { FlexLayoutModule } from '@angular/flex-layout'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,

    CKEditorModule,
    FlexLayoutModule,
  ],
  declarations: [
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SfLookupComponent,
    TextResponseDialogComponent,
    FileDropComponent,
    FileDisplayComponent,
  ],
  exports: [
    // MdDialogModule,
    CKEditorModule,
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SfLookupComponent,
    TextResponseDialogComponent,
    FileDropComponent,
    FileDisplayComponent,
  ],
  entryComponents: [
    AlertDialogComponent,
    SimpleMessageDialog,
    TextResponseDialogComponent,
    FileDropComponent,
  ],
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
    }
  }
}
