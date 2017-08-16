import { Component } from '@angular/core';
import { WorkshopService, Workshop } from '../workshop.service';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.scss']
})
export class AddWorkshopComponent {

  constructor(private _ws: WorkshopService) { console.log('_ws in AddWorkshopComponent: ', this._ws); }

  add(data: Workshop) {
    return this._ws.create(data);
  }

}
