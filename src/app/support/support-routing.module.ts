import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Interface Components */
import { SupportHomeComponent } from './support-home.component';

const supportRoutes: Routes = [

];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SupportHomeComponent,
        children: []
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SupportRoutingModule { }