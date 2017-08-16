import { Component } from '@angular/core';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.scss']
})
export class AddWorkshopComponent {

  constructor(private _ws: WorkshopService) { }

  add(data) {
    return this._ws.create(data);
  }

}
