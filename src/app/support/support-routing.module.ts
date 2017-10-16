import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { SupportHomeComponent } from './support-home.component';
import { SupportSearchComponent } from './support-search/support-search.component';

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
      { path: 'search', component: SupportSearchComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SupportRoutingModule { }