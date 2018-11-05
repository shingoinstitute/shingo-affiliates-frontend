// tslint:disable:prefer-const
import { Component } from '@angular/core'
import { SupportService } from '../services/support/support.service'
import { SupportPage } from '../services/support/support.model'
import { SupportCategory } from './support-category/support-category.model'
import { Router, NavigationExtras } from '@angular/router'

@Component({
  selector: 'app-support-home',
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.scss'],
})
export class SupportHomeComponent {
  public supportCategories: { [key: string]: SupportCategory } = {}

  public categories: string[] = []

  public query: string | undefined

  constructor(public supportService: SupportService, public router: Router) {
    supportService.describe().subscribe(desc => {
      this.parseDescription(desc)
    })
  }

  public onSearch() {
    this.router.navigateByUrl(`/support/search?q=${this.query || ''}`)
  }

  public parseDescription(desc: any) {
    if (desc && desc.category && desc.category.picklistValues) {
      let categories: string[] = []
      for (const value of desc.category.picklistValues) {
        if (value.active && value.label) {
          categories.push(value.label)
        }
      }
      categories = categories.sort()
      this.categories = ['All'].concat(categories)
    }
  }
}
