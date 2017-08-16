import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workshop } from '../Workshop';
import { WorkshopService } from '../workshop.service';

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
