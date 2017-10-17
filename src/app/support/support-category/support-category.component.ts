import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SupportPage } from '../../services/support/support.model';
import { SupportService } from '../../services/support/support.service';

@Component({
  selector: 'app-support-category',
  templateUrl: './support-category.component.html'
})
export class SupportCategoryComponent {
  @Input() public supportPages: SupportPage[] = [];
  @Input() public category: string = '';

  constructor(private route: ActivatedRoute, private _ss: SupportService) {
    this.category = route.snapshot.params['name'];
    if (this.category === 'all') {
      this._ss.getAll().subscribe(pages => this.supportPages = pages);
    } else {
      this._ss.getCategory(this.category).subscribe(pages => this.supportPages = pages);
    }
  }
}
