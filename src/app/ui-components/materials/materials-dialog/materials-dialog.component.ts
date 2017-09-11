import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-materials-dialog',
  templateUrl: './materials-dialog.component.html',
  styleUrls: ['./materials-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MaterialsDialog {

  constructor( @Inject(MD_DIALOG_DATA) public filter: { workshops: boolean, marketing: boolean, forms: boolean }) { }

}
