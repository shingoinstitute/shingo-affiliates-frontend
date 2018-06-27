// Angular Modules
import { Injectable } from '@angular/core';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { Announcement } from './announcement.model';

@Injectable()
export class AnnouncementService {

  public getAnnouncements(): Observable<Announcement[]> {
    /** TODO: Remove after actual API route is implemented */
    return new Observable<Announcement[]>(observer => {
      const announcements: Announcement[] = [
        new Announcement('Webinar - April 30, 2018',
          // tslint:disable-next-line:max-line-length
          'If you missed the webinar, be sure to <a href="https://youtu.be/U_FxdMXDOic">watch it here.</a> When you\'re done, make sure to fill out the survey in the video\'s description.' ,
          5
        ),
        new Announcement('Webinar - July 17, 2018',
          // tslint:disable-next-line:max-line-length
          'The next affiliate webinar is on July 17 at 9 am MT. Please visit <a href="https://connect.usu.edu/shingo">https://connect.usu.edu/shingo</a> to join us live, or watch the recording that will be posted here a couple of days later. Remember that all facilitators are required to view the webinars, so don’t forget to log back into the portal. See you soon!',
          4
        )
      ];

      observer.next(announcements);
    });
  }

}
