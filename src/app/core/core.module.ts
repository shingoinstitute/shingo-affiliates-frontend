import { AppComponent } from './pages/main/app.component'
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'
import { ForbiddenPageComponent } from './pages/forbidden-page/forbidden-page.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
// import { MaterialModule } from '../material'
import { FlexLayoutModule } from '@angular/flex-layout'
import { LayoutModule } from '@angular/cdk/layout'
import {
  MatDialogModule,
  MatMenuModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
} from '@angular/material'

export const COMPONENTS = [
  AppComponent,
  ForbiddenPageComponent,
  PageNotFoundComponent,
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    // MaterialModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    FlexLayoutModule,

    LayoutModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {}
