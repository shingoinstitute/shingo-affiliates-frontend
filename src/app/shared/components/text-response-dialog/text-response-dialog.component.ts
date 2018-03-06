import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

// tslint:disable-next-line:interface-name
export interface TextResponseData {
  title?: string;
  message?: string;
  acceptText?: string;
  cancelText?: string;
  destructive?: boolean;
}

@Component({
  selector: 'app-text-response-dialog',
  templateUrl: './text-response-dialog.component.html'
})
export class TextResponseDialogComponent {

  public title: string;
  public message: string;
  public acceptText: string;
  public cancelText: string;
  public reason: string;
  public destructive: boolean;

  constructor( @Inject(MAT_DIALOG_DATA) public data: TextResponseData) {
    this.title = data.title ? data.title : '';
    this.message = data.message ? data.message : '';
    this.acceptText = data.acceptText ? data.acceptText : '';
    this.cancelText = data.cancelText ? data.cancelText : '';
    this.destructive = typeof data.destructive !== 'undefined' ? data.destructive : false;
  }
}