import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { User } from '../../../shared/models/user.model';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component';
import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;

  constructor(public route: ActivatedRoute, public dialog: MatDialog) { }

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
  }

  public changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog);
    dialogRef.afterClosed().subscribe(message => this.dialog.open(SimpleMessageDialog, { data: message }));
  }

}
