import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService, CountriesService, RouterService, AuthService } from './providers';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [HttpService, CountriesService, RouterService, AuthService]
})
export class SharedModule { }
