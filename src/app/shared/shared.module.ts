import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component'
import { IconLegendComponent } from './components/icon-legend/icon-legend.component'
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component'
import {
  SearchComponent,
  SearchSelectionRenderDirective,
  SearchAutocompleteRenderDirective,
} from './components/search/search.component'
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
  MatListModule,
  MatChipsModule,
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
    MatListModule,
    MatChipsModule,

    FlexLayoutModule,
  ],
  declarations: [
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SearchComponent,
    SearchAutocompleteRenderDirective,
    SearchSelectionRenderDirective,
    TextResponseDialogComponent,
    FileDropComponent,
    FileDisplayComponent,
  ],
  exports: [
    // MdDialogModule,
    AlertDialogComponent,
    IconLegendComponent,
    SimpleMessageDialog,
    SearchComponent,
    SearchAutocompleteRenderDirective,
    SearchSelectionRenderDirective,
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
