import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { FillViewHeightDirective } from '../../shared/directives/fill-height.directive';

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss'],
  providers: [FillViewHeightDirective]
})
export class ForbiddenPageComponent implements AfterViewInit {

  @ViewChild('forbiddenRoot') private root: ElementRef;

  constructor(private router: Router, private fillHeight: FillViewHeightDirective) { }

  public ngAfterViewInit() {
    $(this.root.nativeElement).css('position', 'relative');
    this.fillHeight.fillHeightOnElement(this.root);
  }

}
