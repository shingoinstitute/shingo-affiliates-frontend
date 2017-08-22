// Angular Modules
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// App Modules
import { WorkshopService } from '../../services/workshop/workshop.service';
import { Workshop } from '../Workshop';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent {

  @Input() workshop: Workshop;

  constructor(private router: Router) { }

  public goToEdit() {
    this.router.navigateByUrl(`/workshops/${this.workshop.sfId}/edit`);
  }

  private largeImage() {
    const split = this.workshop.image.split('.png');
    return `${split[0]}Large.png`;
  }
}
