import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AnnouncementService, Announcement } from '../../services/announcement/announcement.service';
import { MaterialsDialog } from '../materials/materials-dialog/materials-dialog.component';

@Component({
  selector: 'app-quick-details',
  templateUrl: './quick-details.component.html',
  styleUrls: ['./quick-details.component.scss'],
  providers: [AnnouncementService]
})
export class QuickDetailsComponent implements OnInit {

  public announcements: Announcement[];

  constructor(private announcement: AnnouncementService, private dialog: MdDialog) { }

  ngOnInit() {
    this.announcement.getAnnouncements().subscribe(data => {
      this.announcements = data.map(Announcement.create);
    }, err => {
      console.error(err);
    });
  }

  displayAfMaterials() {
    this.dialog.open(MaterialsDialog, { width: '80%', height: '100%' });
  }

}
