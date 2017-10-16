import { Component, OnInit } from '@angular/core';
import { SupportService, SupportPage } from '../../services/support/support.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-support-search',
  templateUrl: './support-search.component.html',
  styleUrls: ['./support-search.component.scss']
})
export class SupportSearchComponent implements OnInit {

  public results: SupportPage[] = [];
  public query: string;

  public isSearching: boolean;

  public searchHandlerSource = new Subject<string>();
  public searchHandler: Observable<string> = this.searchHandlerSource.asObservable();

  constructor(public supportService: SupportService, public activeRoute: ActivatedRoute) { }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.q && typeof params.q === 'string') {
        this.query = params.q;
        this.search();
      }
    });
  }

  public search(animateSpinner: boolean = true) {
    this.isSearching = animateSpinner;
    this.supportService.search(this.query)
    .distinctUntilChanged()
    .debounceTime(250)
    .subscribe(res => {
      this.isSearching = false;
      if (Array.isArray(res)) {
        this.results = res;
        for (const page of res) {
          if (typeof page.content === 'string') {
            // remove html tags to shorten text when displaying search results
            const content = page.content.replace(/\<[a-z]+\>|\<\/[a-z]+\>/g, ' ');
            // each word in the query is bolded to make it stand out in search result text
            const tokens = this.query.split(' ').join('|');
            page.Content__c = content.replace(new RegExp(`(${tokens})`, 'gi'), '<strong>$1</strong>');
          }
        }
      }
    });
  }

}
