// Angular Modules
import { Component } from '@angular/core';

// App Modules
import { WorkshopService } from '../../services/workshop/workshop.service';
import { Workshop } from '../../workshops/Workshop';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.scss']
})
export class AddWorkshopComponent {

  constructor(private _ws: WorkshopService) { }

  add(data: Workshop) {
    return this._ws.create(data);
  }

}
