import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SupportHomeComponent } from './support-home.component'
import { SupportSearchComponent } from './support-search/support-search.component'
import { SupportCategoryComponent } from './support-category/support-category.component'
import { SupportPageComponent } from './support-page/support-page.component'

import { SupportRoutingModule } from './support-routing.module'

import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatListModule,
} from '@angular/material'
import { FormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    SupportRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  declarations: [
    SupportHomeComponent,
    SupportPageComponent,
    SupportCategoryComponent,
    SupportSearchComponent,
  ],
})
export class SupportModule {}
