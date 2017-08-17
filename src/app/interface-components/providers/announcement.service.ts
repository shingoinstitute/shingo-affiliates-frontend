import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AnnouncementService {

  constructor(private http: Http) {
     
  }

  getAnnouncements(): Observable<Announcement[]> {
    /** TODO: Remove after actual API route is implemented */
    return Observable.create(observer => {
      observer.next([
        {
          "title": "Registration URL Update",
          "message": "We have updated the system to not require a registration URL if the workshop is private.",
          "priority": 0
        },
        {
          "title": "Safari Issues",
          "message": "There was some issues discovered when accessing the Affiliate Portal from the Safari web browser. The known issues have been addressed. If you find 'bugs' or 'issues' please email shingo.coord@usu.edu with a description of what is happening and please include the browser you are using.\n\nThank you",
          "priority": 1
        }
      ]);
    })
    
    // return this.http.get('https://affiliates.shingo.org/announcements.json')
    // .first()
    // .debounceTime(500)
    // .map(res => {
    //   return res.json();
    // })
    // .catch(this.handleError);
  }

  handleError(error: Response | any): ErrorObservable {
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

export class Announcement {
  public title: string;
  public message: string;
  public priority: number;

  constructor(title: string, message: string, priority: number) {
    this.title = title;
    this.message = message;
    this.priority = priority;;
  }

  public static create(obj) {
    return new Announcement(obj.title || '', obj.message || '', obj.priority || -1);
  }
}
