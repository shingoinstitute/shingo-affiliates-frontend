import { Component, AfterViewInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AffiliateService, DEFAULT_AFFILIATE_SEARCH_FIELDS } from '../../services/affiliate/affiliate.service';
import { Affiliate } from '../../affiliates/affiliate.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-affiliate-lookup',
  templateUrl: './affiliate-lookup.component.html',
  styleUrls: ['./affiliate-lookup.component.scss']
})
export class AffiliateLookupComponent implements AfterViewInit, OnChanges {


  @Input('affiliate') public affiliate: Affiliate;
  @Input() public fields: string[] = [];

  @Output() public onSelect = new EventEmitter<Affiliate>();
  @Output() public onChange = new EventEmitter<string>();

  public affiliates: Affiliate[] = [];
  public formControl: FormControl = new FormControl();
  public isSearching: boolean;

  constructor(public _as: AffiliateService) { }

  public ngAfterViewInit() {
    // Listen to changes in auto-complete search field
    this.fields = this.fields.concat(DEFAULT_AFFILIATE_SEARCH_FIELDS);
    this.formControl.valueChanges.subscribe((query: string) => {
      if (query && query.length > 2) {
        this.isSearching = true;
        this.onChange.emit(query);
        this._as.search(query, this.fields)
          .debounceTime(250)
          .subscribe(data => {
            this.isSearching = false;
            this.affiliates = data.map(n => new Affiliate(n)).sort((a: Affiliate, b: Affiliate) => {
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

  public ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'affiliate') {
        const change = changes[propName];
        const obj = change.currentValue;
        this.affiliate = new Affiliate(obj);
        this.formControl.setValue(this.affiliate);
      }
    }
  }

  public onSelectChange(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.onSelect.emit(affiliate);
  }

  public displayFn(affiliate: Affiliate): string {
    return affiliate ? affiliate.name : '';
  }

}
