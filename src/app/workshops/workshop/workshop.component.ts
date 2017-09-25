// Angular Modules
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// App Modules
import { WorkshopService } from '../../services/workshop/workshop.service';
import { AuthService } from '../../services/auth/auth.service';
import { Workshop } from '../workshop.model';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent {

  @Input() public workshop: Workshop;

  constructor(public router: Router, public auth: AuthService) { }

  public canEdit() {
    if (this.auth.user && this.auth.user.isAdmin) return true;
    else {
      return this.workshop.status === 'Proposed' || this.workshop.status === 'Verified';
    }
  }

  public goToEdit() {
    this.router.navigateByUrl(`/workshops/${this.workshop.sfId}/edit`);
  }

  public largeImage() {
    const split = this.workshop.image.split('.png');
    return `${split[0]}Large.png`;
  }
}
