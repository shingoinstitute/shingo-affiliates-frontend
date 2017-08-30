import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FillViewHeightDirective } from '../../shared/directives/fill-height.directive';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  providers: [FillViewHeightDirective]
})
export class AdminPanelComponent implements AfterViewInit {

  @ViewChild('pageRoot') private pageRoot;

  constructor(private fillHeight: FillViewHeightDirective, private router: Router) { }

  public ngAfterViewInit() {
    this.fillHeight.fillHeightOnElement(this.pageRoot);
  }

}
