// Angular Modules
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App Modules
import { WorkshopService } from '../../services/workshop/workshop.service';
import { Workshop } from '../Workshop';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {

  @Input() workshop: Workshop;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop'];
  }

}
