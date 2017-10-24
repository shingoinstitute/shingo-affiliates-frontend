import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

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

  constructor( @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, acceptText: string, cancelText: string }) {
    this.title = data.title;
    this.message = data.message;
    this.acceptText = data.acceptText;
    this.cancelText = data.cancelText;
  }
}