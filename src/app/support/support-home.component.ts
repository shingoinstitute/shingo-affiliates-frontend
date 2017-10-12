import { Component } from '@angular/core';
import { SupportService } from '../services/support/support.service';

@Component({
  selector: 'app-support-home',
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.scss']
})
export class SupportHomeComponent {

  constructor(public _ss: SupportService) { }

}
