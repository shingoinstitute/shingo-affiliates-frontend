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
    return Observable.create(observer => {
      observer.next([
        {
          'title': 'Registration URL Update',
          'message': 'We have updated the system to not require a registration URL if the workshop is private.',
          'priority': 0
        },
        {
          'title': 'Safari Issues',
          // tslint:disable-next-line:max-line-length
          'message': 'There was some issues discovered when accessing the Affiliate Portal from the Safari web browser. The known issues have been addressed. If you find \'bugs\' or \'issues\' please email shingo.coord@usu.edu with a description of what is happening and please include the browser you are using.\n\nThank you',
          'priority': 1
        }
      ]);
    });
  }

}
