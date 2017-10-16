import { Component, Input, OnInit } from '@angular/core';
import { SupportPage, SupportService } from '../../services/support/support.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-support-category',
  templateUrl: './support-category.component.html',
  styleUrls: ['./support-category.component.scss']
})
export class SupportCategoryComponent implements OnInit {
  @Input() public supportPages: SupportPage[] = [];
  @Input() public category: string = '';

  constructor(public activeRoute: ActivatedRoute, public supportService: SupportService) { }

  public ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.category = params.name || '';
      this.getPages(this.category);
    });
  }

  public getPages(category: string) {
    this.supportService.getCategory(category).subscribe(pages => {
        this.supportPages = pages;
    }, err => {
      console.error(err);
    });
  }

}
