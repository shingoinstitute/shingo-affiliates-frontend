import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { SupportHomeComponent } from './support-home.component';
import { SupportSearchComponent } from './support-search/support-search.component';
import { SupportCategoryComponent } from './support-category/support-category.component';
import { SupportPageComponent } from './support-page/support-page.component';

const supportRoutes: Routes = [

];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SupportHomeComponent,
        children: []
      },
      { path: 'search', component: SupportSearchComponent },
      { path: 'category/:name', component: SupportCategoryComponent },
      { path: ':id', component: SupportPageComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SupportRoutingModule { }