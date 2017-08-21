import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Affiliate } from "../../../affiliates/Affiliate";
import { AffiliateService } from "../../../services/affiliate/affiliate.service";
import { SFSuccessResult } from "../../../services/base-api.abstract.service";
import { MdSnackBar } from "@angular/material";

@Component({
  selector: 'app-admin-affiliate-tab',
  templateUrl: './admin-affiliate-tab.component.html',
  styleUrls: ['./admin-affiliate-tab.component.scss']
})
export class AdminAffiliateTabComponent implements OnInit {


  displayedColumns = ["logo", "name", "website", "actions"];

  selectedAffiliate: Affiliate;

  isLoading: boolean;

  constructor(private _as: AffiliateService, private snackbar: MdSnackBar) { }

  ngOnInit() {
  }

  save() {
    this.isLoading = true;
    this._as.update(this.selectedAffiliate).subscribe((data: SFSuccessResult) => {
      console.log(data);
      this.selectedAffiliate = null;
      this.isLoading = false;
      this.snackbar.open('Affiliate successfully updated/created.', null, { duration: 1500 });
    }, err => {
      console.error(err);
      this.selectedAffiliate = null;
      this.isLoading = false;
    });
  }

  cancel() {
    this.selectedAffiliate = null;
  }

  onClickCreate() {
    this.selectedAffiliate = new Affiliate();
  }

  onClickEditHandler(affiliate: Affiliate) {
    this.selectedAffiliate = affiliate;
  }

  onClickDeleteHandler(affiliate: Affiliate) {
    
  }

}
