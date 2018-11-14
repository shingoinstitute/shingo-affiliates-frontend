import { NgModule } from '@angular/core'
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component'
import { FileDisplayComponent } from './components/file-display/file-display.component'
import { FileDropComponent } from './components/file-drop/file-drop.component'
import { FileTreeComponent } from './components/file-tree/file-tree.component'
import { SimpleMessageDialog } from './components/simple-message-dialog/simple-message-dialog.component'
import { TextResponseDialogComponent } from './components/text-response-dialog/text-response-dialog.component'
import { MaterialModule } from '../material'
import { IconLegendComponent } from './components/icon-legend/icon-legend.component'
import { CommonModule } from '@angular/common'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

export const COMPONENTS = [
  AlertDialogComponent,
  FileDisplayComponent,
  FileDropComponent,
  FileTreeComponent,
  SimpleMessageDialog,
  TextResponseDialogComponent,
  IconLegendComponent,
]

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SharedModule {}
