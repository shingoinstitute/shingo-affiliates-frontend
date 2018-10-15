import { Component, Input } from '@angular/core'
import { Announcement } from '../../../services/announcement/announcement.model'

@Component({
  selector: 'app-quick-detail-item',
  templateUrl: './quick-detail-item.component.html',
  styleUrls: ['./quick-detail-item.component.scss'],
})
export class QuickDetailItemComponent {
  @Input()
  public announcement: Announcement
}
