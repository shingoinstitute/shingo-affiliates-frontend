import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopService, Workshop } from '../workshop.service';

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.scss']
})
export class EditWorkshopComponent implements OnInit {

  @Input() workshop: Workshop = new Workshop();

  constructor(private route: ActivatedRoute, private _ws: WorkshopService) { }

  ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop'];
    console.log('editing', this.workshop);
  }

  save(data) {
    return this._ws.update(data)
  }

}
