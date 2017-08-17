import { NgModule } from '@angular/core';
import { HttpService, CountriesService, RouterService, AuthService } from './providers';

@NgModule({
  providers: [HttpService, CountriesService, RouterService, AuthService]
})
export class SharedModule { }
