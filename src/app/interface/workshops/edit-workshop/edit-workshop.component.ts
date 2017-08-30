// Angular Modules
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App Modules
import { WorkshopService } from '../../../services/workshop/workshop.service';
import { Workshop } from '../../../workshops/Workshop';

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.scss']
})
export class EditWorkshopComponent implements OnInit {

  @Input() public workshop: Workshop = new Workshop();

  constructor(private route: ActivatedRoute, private _ws: WorkshopService) { }

  public ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop'];
  }

  private save(data) {
    return this._ws.update(data);
  }

}
