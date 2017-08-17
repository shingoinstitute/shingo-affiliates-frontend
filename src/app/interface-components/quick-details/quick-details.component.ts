import { Component, OnInit } from '@angular/core';
import { AnnouncementService, Announcement } from '../providers/announcement.service';

@Component({
  selector: 'app-quick-details',
  templateUrl: './quick-details.component.html',
  styleUrls: ['./quick-details.component.scss'],
  providers: [AnnouncementService]
})
export class QuickDetailsComponent implements OnInit {

  public announcements: Announcement[];

  constructor(private announcement: AnnouncementService) { }

  ngOnInit() {
    this.announcement.getAnnouncements().subscribe(data => {
      this.announcements = data.map(Announcement.create);
    }, err => {
      console.error(err);
    });
  }

}
