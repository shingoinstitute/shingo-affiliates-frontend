import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private user: User;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
  }

  changePassword() {

  }

}
