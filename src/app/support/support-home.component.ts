// tslint:disable:prefer-const
import { Component } from '@angular/core';
import { SupportService, SupportPage } from '../services/support/support.service';
import { SupportCategory } from './support-category/support-category.model';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-support-home',
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.scss']
})
export class SupportHomeComponent {

  public supportCategories: { [key: string]: SupportCategory } = {};

  public categories: string[] = [];

  public query: string;

  constructor(public supportService: SupportService, public router: Router) {

    supportService.describe().subscribe(desc => {
      this.parseDescription(desc);
    });
  }

  public onSearch() {
    this.router.navigateByUrl(`/support/search?q=${this.query || ''}`);
  }

  public parseDescription(desc: any) {
    if (desc && desc.category && desc.category.picklistValues) {
      let categories: string[] = [];
      for (const value of desc.category.picklistValues) {
        if (value.active && value.label) {
          categories.push(value.label);
        }
      }
      this.categories = categories;
    }
  }

}
