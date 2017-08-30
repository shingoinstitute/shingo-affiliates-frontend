import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';

import { User } from '../../../shared/models/User';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component';
import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private user: User;

  constructor(private route: ActivatedRoute, private dialog: MdDialog) { }

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
  }

  private changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog);
    dialogRef.afterClosed().subscribe(message => this.dialog.open(SimpleMessageDialog, { data: message }));
  }

}
