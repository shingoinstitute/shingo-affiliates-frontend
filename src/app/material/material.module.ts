import { NgModule } from '@angular/core'
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatTreeModule,
} from '@angular/material'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatMomentDateModule } from '@angular/material-moment-adapter'

const MODULES = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  FlexLayoutModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatExpansionModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatTreeModule,
]

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class MaterialModule {}
