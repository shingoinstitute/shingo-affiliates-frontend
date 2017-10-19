// Angular Modules
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

// App Modules
import { WorkshopService } from '../../services/workshop/workshop.service';
import { AuthService } from '../../services/auth/auth.service';
import { Workshop } from '../workshop.model';
import { TextResponseDialogComponent } from '../../shared/components/text-response-dialog/text-response-dialog.component';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent {

  @Input() public workshop: Workshop;

  constructor(public router: Router, public auth: AuthService, public _ws: WorkshopService, public dialog: MdDialog) { }

  public canEdit() {
    if (this.auth.user && this.auth.user.isAdmin) return true;
    else {
      return this.workshop.status === 'Proposed' || this.workshop.status === 'Verified';
    }
  }

  public canCancel() {
    return this.workshop.status === 'Proposed' || this.workshop.status === 'Verified' && new Date(this.workshop.endDate) > new Date();
  }

  public cancel() {
    const dialogRef = this.dialog.open(TextResponseDialogComponent, {
      data: {
        title: 'Cancel Workshop',
        message: 'Please state the reason for cancelling this workshop...',
        acceptText: 'Cancel',
        cancelText: 'Nevermind'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Workshop cancled with result', result);
      if (result !== undefined) {
        this.workshop.status = 'Cancelled';
        this._ws.cancel(this.workshop, result).subscribe(cancelled => console.log(cancelled));
      }
    });
  }

  public goToEdit() {
    this.router.navigateByUrl(`/workshops/${this.workshop.sfId}/edit`);
  }

  public largeImage() {
    const split = this.workshop.image.split('.png');
    return `${split[0]}Large.png`;
  }
}
