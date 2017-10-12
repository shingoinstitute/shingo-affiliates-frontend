// tslint:disable:member-access
// tslint:disable:max-classes-per-file
import { Component } from '@angular/core';
import { SupportService, SupportPage } from '../services/support/support.service';


export class SupportPages {
  public authentication: SupportPage[] = [];
  public workshops: SupportPage[] = [];
  public dashboard: SupportPage[] = [];
  public affiliates: SupportPage[] = [];
  public facilitators: SupportPage[] = [];
  public other: SupportPage[] = [];

  public assignSupportPagesToCategory(pages: SupportPage[]) {
    for (const page of pages) {
      const key = page.category ? page.category.toLowerCase() : 'other';
      if ((this as Object).hasOwnProperty(key))
        this[key].push(page);
      else 
        this['other'].push(page);
    }
  }

}

@Component({
  selector: 'app-support-home',
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.scss']
})
export class SupportHomeComponent {

  public supportPages: SupportPages = new SupportPages();
  public get categories(): string[] { return SupportPage.SupportPageCategoryTypes; }

  constructor(public _ss: SupportService) {
    _ss.getAll().subscribe(pages => {
      this.supportPages.assignSupportPagesToCategory(pages);
    },
    err => {
      console.error(err);
    });
  }
}
