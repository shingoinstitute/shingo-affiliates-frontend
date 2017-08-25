import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Affiliate } from "../../../affiliates/Affiliate";
import { SFObject } from "../../../shared/models/SFObject.abstract";

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html' 
})
export class AlertDialogComponent {
  sfObj: SFObject;
  message: string;
  constructor(@Inject(MD_DIALOG_DATA) public data: { sfObject: any, message: string }) {
    this.sfObj = data.sfObject as SFObject;
    this.message = data.message;
  }
}