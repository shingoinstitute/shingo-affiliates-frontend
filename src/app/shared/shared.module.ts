import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './providers/http.service';
import { CountriesService } from './providers/countries.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [HttpService, CountriesService]
})
export class SharedModule { }
