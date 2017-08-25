import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketing-materials',
  templateUrl: './marketing-materials.component.html',
  styleUrls: ['./marketing-materials.component.scss']
})
export class MarketingMaterialsComponent implements OnInit {

  private folder = { 'Marketing': false };

  constructor() { }

  ngOnInit() {
  }

}
