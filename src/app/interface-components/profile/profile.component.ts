import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   user: { name: string, title: string } = { name: "Shingo Coordinator", title: "Instructor" }

  constructor() { }

  ngOnInit() {
  }

  changePassword() {

  }

}
