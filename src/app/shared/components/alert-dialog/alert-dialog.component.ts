import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { SFObject } from '../../models/sf-object.abstract.model';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {

  private sfObj: SFObject;
  private message: string;

  constructor( @Inject(MD_DIALOG_DATA) public data: { sfObject: any, message: string }) {
    this.sfObj = data.sfObject as SFObject;
    this.message = data.message;
  }
}