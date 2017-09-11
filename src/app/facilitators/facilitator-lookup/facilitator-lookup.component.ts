import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Facilitator } from '../../facilitators/facilitator.model';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';

@Component({
  selector: 'app-facilitator-lookup',
  templateUrl: './facilitator-lookup.component.html'
})
export class FacilitatorLookupComponent implements AfterViewInit, OnChanges {

  @Input() public facilitator: Facilitator;
  @Input() public formControl: FormControl = new FormControl();

  @Output() public onSelect = new EventEmitter<Facilitator>();

  public facilitators: Facilitator[] = [];
  public isSearching: boolean;
  // formControl: FormControl = new FormControl();

  constructor(public _fs: FacilitatorService) { }

  public ngAfterViewInit() {
    // Listen to changes in auto-complete search field
    this.formControl.valueChanges.subscribe((query: string) => {
      if (query && query.length > 2) {
        this.isSearching = true;
        this._fs.search(query, undefined, false)
          .debounceTime(250)
          .subscribe(data => {
            this.isSearching = false;
            this.facilitators = data.map(n => new Facilitator(n)).sort((a: Facilitator, b: Facilitator) => {
              return a.name > b.name ? 1 : -1;
            });
          }, err => {
            this.isSearching = false;
            console.error(err);
          });
      }
    });

    // Set input value if facilitator already exists
    if (this.facilitator) {
      this.formControl.setValue(this.facilitator);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'affiliate') {
        const change = changes[propName];
        const obj = change.currentValue;
        this.facilitator = new Facilitator(obj);
        this.formControl.setValue(this.facilitator);
      }
    }
  }

  public onSelectChange(facilitator: Facilitator) {
    this.facilitator = facilitator;
    this.onSelect.emit(facilitator);
  }

  public displayFn(facilitator: Facilitator): string {
    return facilitator ? facilitator.name : '';
  }
}