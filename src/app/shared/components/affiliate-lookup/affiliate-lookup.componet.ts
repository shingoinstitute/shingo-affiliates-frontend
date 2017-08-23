import { Component, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { AffiliateService } from '../../../services/affiliate/affiliate.service';
import { Affiliate } from "../../../affiliates/Affiliate";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-affiliate-lookup',
  templateUrl: './affiliate-lookup.component.html',
  styleUrls: ['./affiliate-lookup.component.scss']
})
export class AffiliateLookupComponent implements AfterViewInit {

  affiliates: Affiliate[] = [];

  @Input() affiliate: Affiliate;

  @Output('onSelect') onSelectEventEmitter = new EventEmitter<Affiliate>();

  formControl: FormControl = new FormControl();

  isSearching: boolean;

  constructor(private _as: AffiliateService) { }

  ngAfterViewInit() {
    // Listen to changes in auto-complete search field
    this.formControl.valueChanges.subscribe((query: string) => {
      if (query && query.length > 2) {
        this.isSearching = true;
        this._as.search(query)
        .debounceTime(250)
        .subscribe(data => {
          this.isSearching = false;
          this.affiliates = data.map(n => { return new Affiliate(n); }).sort((a: Affiliate, b: Affiliate) => {
            return a.name > b.name ? 1 : -1;
          });
        }, err => {
          this.isSearching = false;
          console.error(err);
        });
      }
    });

    // Set input value if affiliate already exists
    if (this.affiliate) {
      this.formControl.setValue(this.affiliate);
    }
  }

  onSelectChange(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.onSelectEventEmitter.emit(affiliate);
  }

  displayFn(affiliate: Affiliate): string {
    return affiliate ? affiliate.name : '';
  }

}