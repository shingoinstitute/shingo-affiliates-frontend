// Angular Modules
import { Injectable } from '@angular/core'

// RxJS Modules
import { Observable } from 'rxjs'

import { Announcement } from './announcement.model'

@Injectable()
export class AnnouncementService {
  public getAnnouncements(): Observable<Announcement[]> {
    /** TODO: Remove after actual API route is implemented */
    return new Observable<Announcement[]>(observer => {
      const announcements: Announcement[] = [
        new Announcement(
          'Workshop Table Changes',
          "The workshop data table now displays the start and end dates relative to the host-site's timezone.<br/>If you need to view the dates relative to your timezone, enable the Relative Start/End Time table fields under the Advanced Filter Options section of the Workshops page.",
          4,
        ),
      ]

      observer.next(announcements)
    })
  }
}
