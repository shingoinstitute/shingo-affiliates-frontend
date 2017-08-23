import { Component, OnInit, Input } from '@angular/core';
import { Affiliate } from "../Affiliate";

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit {

  @Input('affiliate') affiliate: Affiliate;

  constructor() { }

  ngOnInit() {
    if (!this.affiliate)
      this.affiliate = new Affiliate();
  }

}
