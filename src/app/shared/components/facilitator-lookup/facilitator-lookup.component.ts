import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from "@angular/forms";

import { Facilitator } from "../../../facilitators/Facilitator";
import { FacilitatorService } from "../../../services/facilitator/facilitator.service";

@Component({
  selector: 'app-facilitator-lookup',
  templateUrl: './facilitator-lookup.component.html',
  styleUrls: ['../sf-lookup.component.scss']
})
export class FacilitatorLookupComponent {
  facilitators: Facilitator[] = [];

  @Input('facilitator') facilitator: Facilitator;

  @Output('onSelect') onSelectEventEmitter = new EventEmitter<Facilitator>();

  formControl: FormControl = new FormControl();

  isSearching: boolean;

  constructor(private _fs: FacilitatorService) { }

  ngAfterViewInit() {
    // Listen to changes in auto-complete search field
    this.formControl.valueChanges.subscribe((query: string) => {
      if (query && query.length > 2) {
        this.isSearching = true;
        this._fs.search(query, false)
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

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'affiliate') {
        let change = changes[propName];
        let obj = change.currentValue;
        this.facilitator = new Facilitator(obj);
        this.formControl.setValue(this.facilitator);
      }
    }
  }

  onSelectChange(facilitator: Facilitator) {
    this.facilitator = facilitator;
    this.onSelectEventEmitter.emit(facilitator);
  }

  displayFn(facilitator: Facilitator): string {
    return facilitator ? facilitator.name : '';
  }
}