import { Component, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { SupportPage } from '../../services/support/support.model'
import { SupportService } from '../../services/support/support.service'

@Component({
  selector: 'app-support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss'],
})
export class SupportPageComponent {
  @Input()
  public supportPage: SupportPage = new SupportPage()

  constructor(private route: ActivatedRoute, private _ss: SupportService) {
    route.params.subscribe(params => {
      if (params.id) {
        this._ss.getById(params.id).subscribe(page => (this.supportPage = page))
      }
    })
  }
}
