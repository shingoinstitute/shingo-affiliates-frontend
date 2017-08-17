import { Component, OnInit, Input } from '@angular/core';
import { Announcement } from '../../providers/announcement.service';

@Component({
  selector: 'app-quick-detail-item',
  templateUrl: './quick-detail-item.component.html',
  styleUrls: ['./quick-detail-item.component.scss']
})
export class QuickDetailItemComponent implements OnInit {

  @Input('announcement') announcement: Announcement;

  constructor() { }

  ngOnInit() {
  }

}
