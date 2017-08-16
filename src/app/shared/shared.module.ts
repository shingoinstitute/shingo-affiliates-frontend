import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './providers/http.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [HttpService]
})
export class SharedModule { }
