import { Component } from '@angular/core';
import { SupportService } from '../services/support/support.service';
import { SupportPage } from '../services/support/support.model';
import { SupportCategory } from './support-category/support-category.model';

@Component({
  selector: 'app-support-home',
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.scss']
})
export class SupportHomeComponent {

  public supportCategories: { [key: string]: SupportCategory } = {};
  public get supportCategoryProps() { return Object.keys(this.supportCategories); }
  public categories: string[] = [];

  constructor(public supportService: SupportService) {

    supportService.describe().subscribe(desc => {
      console.log('got desc: ', desc);
      if (desc.category.picklistValues) {
        this.categories = desc.category.picklistValues.map(val => val.value).sort();
        this.categories = ['All'].concat(this.categories);
      }
    });

    // supportService.getAll().subscribe((pages: SupportPage[]) => {
    //   this.sortPagesByCategory(pages);
    //   // console.log(`Retrieved ${pages.length} support page${pages.length ? '' : 's'}`);
    //   console.log('SUPPORT PAGES', pages);
    // },
    //   err => {
    //     console.error(err);
    //   });
  }

  public sortPagesByCategory(pages: SupportPage[]) {
    pages.map(page => {
      const category = page.category || 'Other';
      if (this.supportCategories.hasOwnProperty(category)) {
        this.supportCategories[category].pages.push(page);
      } else {
        this.supportCategories[category] = new SupportCategory(category, [page]);
      }
    });
  }

}
