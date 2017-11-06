import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SFObject } from '../../models/sf-object.abstract.model';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {

  public sfObj: SFObject;
  public message: string;
  public title: string;

  constructor( @Inject(MAT_DIALOG_DATA) public data: { sfObject: any, title: string, message: string }) {
    this.sfObj = data.sfObject as SFObject;
    this.title = data.title ? data.title : '';
    this.message = data.message ? data.message : '';
  }
}