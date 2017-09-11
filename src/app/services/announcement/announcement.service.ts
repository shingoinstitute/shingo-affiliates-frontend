// Angular Modules
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// Mics Modules
import { CookieService } from 'ngx-cookie';

import { Announcement } from './announcement.model';

@Injectable()
export class AnnouncementService {

  constructor(public http: Http) { }

  public getAnnouncements(): Observable<Announcement[]> {
    /** TODO: Remove after actual API route is implemented */
    return Observable.create(observer => {
      observer.next([
        {
          'title': 'Registration URL Update',
          'message': 'We have updated the system to not require a registration URL if the workshop is public.',
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

  public handleError(error: Response | any): ErrorObservable {
    let err: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      err = body.error || JSON.stringify(body);
    } else {
      err = error.message ? error.message : error.toString();
    }
    return Observable.throw(err);
  }

}
