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
          'Changes to Workshop Form',
          'Facilitators are now able to select the start and end times for a workshop.<br/>To do so, enter the local start and end time in the workshop form, and make sure to pick the correct timezone for the host site from the map or picklist.',
          4,
        ),
      ]

      observer.next(announcements)
    })
  }
}
