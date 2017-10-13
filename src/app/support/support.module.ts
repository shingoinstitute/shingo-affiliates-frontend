import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportHomeComponent } from './support-home.component';
import { SupportSearchComponent } from './support-search/support-search.component';
import { SupportCategoryComponent } from './support-category/support-category.component';
import { SupportPageComponent } from './support-page/support-page.component';

import { SupportRoutingModule } from './support-routing.module';

import {
  MdButtonModule,
  MdCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SupportRoutingModule,
    MdButtonModule,
    MdCardModule
  ],
  declarations: [
    SupportHomeComponent,
    SupportPageComponent,
    SupportCategoryComponent,
    SupportSearchComponent
  ]
})
export class SupportModule { }
