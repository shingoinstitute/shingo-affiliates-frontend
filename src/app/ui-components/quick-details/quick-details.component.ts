import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AnnouncementService } from '../../services/announcement/announcement.service';
import { Announcement } from '../../services/announcement/announcement.model';
import { MaterialsDialog } from '../materials/materials-dialog/materials-dialog.component';

@Component({
  selector: 'app-quick-details',
  templateUrl: './quick-details.component.html',
  styleUrls: ['./quick-details.component.scss'],
  providers: [AnnouncementService]
})
export class QuickDetailsComponent implements OnInit {

  public announcements: Announcement[];

  constructor(public announcement: AnnouncementService, public dialog: MatDialog) { }

  public ngOnInit() {
    this.announcement.getAnnouncements().subscribe(data => {
      this.announcements = data.map(Announcement.create);
    }, err => {
      console.error(err);
    });
  }

  public displayAfMaterials() {
    this.dialog.open(MaterialsDialog, { width: '80%', height: '100%' });
  }

}
